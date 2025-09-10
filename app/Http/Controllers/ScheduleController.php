<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Section;
use Illuminate\Http\Request;
use App\Models\ScheduleEntry;

class ScheduleController extends Controller
{
    public function index()
    {
        // return Schedule::with('section')->get();
        return Schedule::with('section.adviser')->get();

    }

    public function store(Request $request)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
        ]);

        // Prevent duplicate schedule for the same section
        if (Schedule::where('section_id', $request->section_id)->exists()) {
            return response()->json(['error' => 'Schedule for this section already exists.'], 409);
        }

        $schedule = Schedule::create([
            'section_id' => $request->section_id,
        ]);

        return response()->json($schedule);
    }

    public function show($id)
    {
        $schedule = Schedule::with(['section', 'entries.teacher'])->find($id);

        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found.'], 404);
        }

        return response()->json($schedule);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'section_id' => 'required|exists:sections,id',
        ]);

        $schedule = Schedule::findOrFail($id);
        $schedule->section_id = $request->section_id;
        $schedule->save();

        return response()->json($schedule);
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted successfully.']);
    }
    public function getScheduleBySection($sectionId)
    {
        $section = Section::findOrFail($sectionId);

        $schedule = $section->schedule;
        if (!$schedule) {
            $schedule = Schedule::create(['section_id' => $sectionId]);
        }

        return response()->json($schedule);
    }
    public function getBySectionId($sectionId)
    {
        $schedule = Schedule::where('section_id', $sectionId)->first();

        if (!$schedule) {
            return response()->json(['message' => 'Schedule not found'], 404);
        }

        return response()->json($schedule);
    }
    // GET /api/schedules/section/{sectionId}
    public function getBySection($sectionId)
    {
        $schedule = Schedule::with(['entries.teacher'])
            ->where('section_id', $sectionId)
            ->first();

        if (!$schedule) {
            $schedule = Schedule::create(['section_id' => $sectionId]);
            $schedule->load(['entries.teacher']);
        } else {
            $schedule->load(['entries.teacher']); // ✅ Ensure entries.teacher is always loaded
        }

        return response()->json($schedule);
    }




    public function getTeacherSchedule($teacherId)
    {
        try {
            $entries = ScheduleEntry::with(['schedule.section', 'teacher'])
                ->where('teacher_id', $teacherId)
                ->get();

            return response()->json($entries);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
