<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Section;
use Illuminate\Http\Request;
use App\Events\AdviserSectionAssigned;
use App\Models\SubjectTeacher;
use App\Models\Schedule;


class SectionController extends Controller
{
    public function index()
    {
        $sections = Section::with('adviser:id,name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'section_name' => $s->section_name,
                    'strand' => $s->strand,
                    'grade_level' => $s->grade_level,
                    'adviser_id' => $s->adviser_id,
                    'adviser_name' => $s->adviser->name ?? '—',
                    'semester' => $s->semester,
                    'school_year' => $s->school_year,
                ];
            });

        return response()->json(['sections' => $sections]);
    }



    public function store(Request $request)
    {
        list($semester, $school_year) = $this->getCurrentSemesterAndYear();

        if (!$semester || !$school_year) {
            return response()->json(['error' => 'Section creation is not allowed during this period (April–May).'], 403);
        }

        $request->validate([
            'section_name' => 'required|string',
            'strand' => 'required|string',
            'grade_level' => 'required|string',
            'adviser_id' => 'required|exists:users,id',
        ]);

        // Check for duplicate name in same sem/year
        $exists = Section::where('section_name', $request->section_name)
            ->where('school_year', $school_year)
            ->where('semester', $semester)
            ->exists();

        if ($exists) {
            return response()->json(['error' => 'Section name already exists for this semester and school year.'], 422);
        }

        // ✅ Create section
        $section = Section::create([
            'section_name' => $request->section_name,
            'strand' => $request->strand,
            'grade_level' => $request->grade_level,
            'adviser_id' => $request->adviser_id,
            'semester' => $semester,
            'school_year' => $school_year,
        ]);

        // ✅ Auto-create empty schedule for this section
        $schedule = Schedule::create([
            'section_id' => $section->id,
        ]);

        return response()->json([
            'section' => $section,
            'schedule' => $schedule,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'section_name' => 'required|string',
            'strand' => 'required|string',
            'grade_level' => 'required|string',
            'school_year' => 'required|string',
            'semester' => 'required|string',
            'adviser_id' => 'required|exists:users,id',
        ]);

        $section = Section::findOrFail($id);

        $section->update([
            'section_name' => $request->section_name,
            'strand' => $request->strand,
            'grade_level' => $request->grade_level,
            'school_year' => $request->school_year,
            'semester' => $request->semester,
            'adviser_id' => $request->adviser_id,
        ]);

        return response()->json(['message' => 'Section updated successfully', 'section' => $section]);
    }



    public function destroy($id)
    {
        $section = Section::findOrFail($id);

        // delete related schedule(s)
        Schedule::where('section_id', $section->id)->delete();

        $section->delete();

        return response()->json(['message' => 'Section and its schedule deleted successfully.']);
    }

    public function show($id)
    {
        $section = Section::with('adviser')->findOrFail($id);
        $user = auth()->user();

        // ✅ Allow admin to access any section
        if ($user->role !== 'admin' && $section->adviser_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($section);
    }

    public function addStudent(Request $request, $sectionId)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        $student = User::findOrFail($request->student_id);

        // ✅ Prevent student from being assigned to multiple sections
        if ($student->section_id !== null) {
            return response()->json(['error' => 'This student is already assigned to another section.'], 400);
        }

        $section = Section::findOrFail($sectionId);

        // ✅ Assign student to section
        $student->section_id = $section->id;
        $student->save();

        return response()->json(['message' => 'Student added to section successfully.']);
    }


    public function getSubjectTeachers($id)
    {
        // $section = Section::findOrFail($id);

        // Assuming you have a subject_teachers table with teacher_id, section_id, subject
        $teachers = \DB::table('subject_teachers')
            ->join('users', 'users.id', '=', 'subject_teachers.teacher_id')
            ->where('subject_teachers.section_id', $id)
            ->select(
                'subject_teachers.id',
                'subject_teachers.teacher_id',
                'users.name as teacher_name',
                'subject_teachers.subject'
            )

            ->get();


        return response()->json($teachers);
    }


    public function getSectionStudents($id)
    {
        $section = Section::findOrFail($id);
        $user = auth()->user();

        // Allow admin OR adviser of the section to access
        if ($user->role !== 'admin' && $section->adviser_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Load users with their student info
        $students = User::with('student')
            ->where('role', 'student')
            ->where('section_id', $id)
            ->get();

        return response()->json($students);
    }


    // app/Http/Controllers/SectionController.php

    private function getCurrentSemesterAndYear()
    {
        $now = now();
        $month = $now->month;
        $year = $now->year;

        if ($month >= 6 && $month <= 10) {
            return ['1st', "$year-" . ($year + 1)];
        } elseif ($month >= 11 && $month <= 12) {
            return ['2nd', "$year-" . ($year + 1)];
        } elseif ($month >= 1 && $month <= 3) {
            return ['2nd', ($year - 1) . "-$year"];
        }

        return [null, null];
    }


    public function removeStudent($id)
    {
        try {
            $user = User::findOrFail($id);

            // Check if this user is a student
            if ($user->role !== 'student') {
                return response()->json(['message' => 'User is not a student'], 400);
            }

            // Remove section_id (detach student from section)
            $user->section_id = null;
            $user->save();

            return response()->json(['message' => 'Student removed from section successfully']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error removing student from section',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getAvailableSections()
    {
        // Get IDs of sections that already have a schedule
        $scheduledSectionIds = Schedule::pluck('section_id');

        // Return only sections NOT in that list
        $availableSections = Section::whereNotIn('id', $scheduledSectionIds)->get();

        return response()->json($availableSections);
    }

    public function getTeachers($sectionId)
    {
        $teachers = User::whereHas('subjectTeachers', function ($query) use ($sectionId) {
            $query->where('section_id', $sectionId);
        })->get();

        return response()->json($teachers);
    }

    public function mySchedule($id)
    {
        $user = \App\Models\User::with('sections')->findOrFail($id);

        if ($user->role === 'student') {
            $section = $user->sections()->first(); // pivot table section_student

            if (!$section) {
                return response()->json([]);
            }

            // Get schedule for that section with entries and subjects
            $schedule = \App\Models\Schedule::with(['entries.subject', 'section'])
                ->where('section_id', $section->id)
                ->get();

            return response()->json($schedule);
        }

        // Default for teacher/adviser (already done)
        $entries = \App\Models\ScheduleEntry::with(['subject', 'schedule.section'])
            ->where('teacher_id', $id)
            ->get();

        return response()->json($entries);
    }










    // public function updateSubjectTeacher(Request $request, $sectionId, $teacherId)
// {
//     $request->validate([
//         'teacher_id' => 'required|exists:users,id',
//         'subject' => 'required|string',
//     ]);

    //     // 🔎 Check if another teacher is already assigned to the same subject in this section
//     $conflict = SubjectTeacher::where('section_id', $sectionId)
//         ->where('subject', $request->subject)
//         ->where('id', '!=', $teacherId) // exclude current row
//         ->exists();

    //     if ($conflict) {
//         return response()->json(['error' => 'This subject is already assigned to another teacher in this section.'], 422);
//     }

    //     $teacher = SubjectTeacher::where('section_id', $sectionId)->findOrFail($teacherId);

    //     $oldTeacherId = $teacher->teacher_id; // keep track of old teacher

    //     // ✅ Update teacher assignment and subject
//     $teacher->update([
//         'teacher_id' => $request->teacher_id,
//         'subject' => $request->subject,
//     ]);

    //     // 🔄 Update schedule entries for this section (subject-specific)
//     $schedule = \App\Models\Schedule::where('section_id', $sectionId)->first();

    //     if ($schedule) {
//         \App\Models\ScheduleEntry::where('schedule_id', $schedule->id)
//             ->where('teacher_id', $oldTeacherId)
//             ->where('subject', $request->subject) // only update matching subject
//             ->update(['teacher_id' => $request->teacher_id]);
//     }

    //     return response()->json(['message' => 'Subject teacher updated successfully and schedule entries updated']);
// }


    public function updateSubjectTeacher(Request $request, $sectionId, $teacherId)
    {
        $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'subject' => 'required|string',
        ]);

        // Check for subject conflict in this section
        $conflict = SubjectTeacher::where('section_id', $sectionId)
            ->where('subject', $request->subject)
            ->where('id', '!=', $teacherId) // exclude current row
            ->exists();

        if ($conflict) {
            return response()->json(['error' => 'This subject is already assigned to another teacher in this section.'], 422);
        }

        $teacher = SubjectTeacher::where('section_id', $sectionId)->findOrFail($teacherId);

        $oldTeacherId = $teacher->teacher_id;
        $oldSubject = $teacher->subject; // save old subject before update

        // Update teacher assignment and subject
        $teacher->update([
            'teacher_id' => $request->teacher_id,
            'subject' => $request->subject,
        ]);

        // Update schedule entries matching old teacher and old subject
        $schedule = \App\Models\Schedule::where('section_id', $sectionId)->first();

        if ($schedule) {
            \App\Models\ScheduleEntry::where('schedule_id', $schedule->id)
                ->where('teacher_id', $oldTeacherId)
                ->where('subject', $oldSubject) // use old subject here
                ->update([
                    'teacher_id' => $request->teacher_id,
                    'subject' => $request->subject, // update subject in schedule too
                ]);
        }

        return response()->json([
            'message' => 'Subject teacher updated successfully and schedule entries updated'
        ]);
    }






    // public function updateSubjectTeacher(Request $request, $sectionId, $teacherId)
// {
//     $request->validate([
//         'teacher_id' => 'required|exists:users,id',
//         'subject' => 'required|string',
//     ]);

    //     // 🔎 Check if another teacher is already assigned to the same subject in this section
//     $conflict = SubjectTeacher::where('section_id', $sectionId)
//         ->where('subject', $request->subject)
//         ->where('id', '!=', $teacherId) // exclude current row
//         ->exists();

    //     if ($conflict) {
//         return response()->json(['error' => 'This subject is already assigned to another teacher in this section.'], 422);
//     }

    //     $teacher = SubjectTeacher::where('section_id', $sectionId)->findOrFail($teacherId);

    //     // ✅ Update teacher assignment and subject
//     $teacher->update([
//         'teacher_id' => $request->teacher_id,
//         'subject' => $request->subject,
//     ]);

    //     return response()->json(['message' => 'Subject teacher updated successfully']);
// }



    public function removeSubjectTeacher($sectionId, $teacherId)
    {
        $teacher = SubjectTeacher::where('section_id', $sectionId)->findOrFail($teacherId);

        // 🔎 Find the schedule for this section
        $schedule = \App\Models\Schedule::where('section_id', $sectionId)->first();

        if ($schedule) {
            // 🗑 Delete all schedule entries for this teacher in this section's schedule
            \App\Models\ScheduleEntry::where('schedule_id', $schedule->id)
                ->where('teacher_id', $teacher->teacher_id)
                ->delete();
        }

        // 🗑 Finally remove teacher from subject_teachers
        $teacher->delete();

        return response()->json(['message' => 'Subject teacher and related schedule entries removed successfully']);
    }




}

