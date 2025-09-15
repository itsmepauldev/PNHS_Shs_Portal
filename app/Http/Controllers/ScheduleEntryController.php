<?php



namespace App\Http\Controllers;

use App\Models\ScheduleEntry;
use Illuminate\Http\Request;
use App\Models\Schedule;
class ScheduleEntryController extends Controller
{


    public function index(Request $request)
    {
        $query = ScheduleEntry::query();

        // Optional: filter by schedule_id or section if needed
        if ($request->has('schedule_id')) {
            $query->where('schedule_id', $request->schedule_id);
        }

        return response()->json($query->with(['teacher'])->get());
    }

    // for time conflict edited 09/07/25
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'schedule_id' => 'required|exists:schedules,id',
    //         'subject' => 'required|string',
    //         'day' => 'required|string',
    //         'start_time' => 'required|date_format:H:i',
    //         'end_time' => 'required|date_format:H:i|after:start_time',
    //         'room' => 'required|string',
    //         'teacher_id' => 'required|exists:users,id',
    //     ]);

    //     // Check teacher conflict
    //     $conflictTeacher = ScheduleEntry::where('teacher_id', $request->teacher_id)
    //         ->where('day', $request->day)
    //         ->where(function ($q) use ($request) {
    //             $q->whereBetween('start_time', [$request->start_time, $request->end_time])
    //                 ->orWhereBetween('end_time', [$request->start_time, $request->end_time]);
    //         })->exists();


    //     if ($conflictTeacher) {
    //         return response()->json(['error' => 'Teacher has a time conflict.'], 409);
    //     }

    //     // Check room conflict
    //     $conflictRoom = ScheduleEntry::where('room', $request->room)
    //         ->where('day', $request->day)
    //         ->where(function ($q) use ($request) {
    //             $q->whereBetween('start_time', [$request->start_time, $request->end_time])
    //                 ->orWhereBetween('end_time', [$request->start_time, $request->end_time]);
    //         })->exists();


    //     if ($conflictRoom) {
    //         return response()->json(['error' => 'Room is already booked at this time.'], 409);
    //     }

    //     $entry = ScheduleEntry::create($request->all());
    //     return response()->json($entry);
    // }

    // public function update(Request $request, $id)
    // {
    //     $entry = ScheduleEntry::findOrFail($id);

    //     $request->validate([

    //         'day' => 'required|string',
    //         'subject' => 'required|string',
    //         'start_time' => 'required|date_format:H:i',
    //         'end_time' => 'required|date_format:H:i|after:start_time',
    //         'room' => 'required|string',
    //         'teacher_id' => 'required|exists:users,id',
    //     ]);

    //     // Check conflicts (excluding current entry)
    //     $conflictTeacher = ScheduleEntry::where('teacher_id', $request->teacher_id)
    //         ->where('id', '!=', $id)
    //         ->where('day', $request->day)
    //         ->where(function ($q) use ($request) {
    //             $q->whereBetween('start_time', [$request->start_time, $request->end_time])
    //                 ->orWhereBetween('end_time', [$request->start_time, $request->end_time]);
    //         })->exists();


    //     if ($conflictTeacher) {
    //         return response()->json(['error' => 'Teacher has a time conflict.'], 409);
    //     }

    //     $conflictRoom = ScheduleEntry::where('room', $request->room)
    //         ->where('id', '!=', $id)
    //         ->where('day', $request->day)
    //         ->where(function ($q) use ($request) {
    //             $q->whereBetween('start_time', [$request->start_time, $request->end_time])
    //                 ->orWhereBetween('end_time', [$request->start_time, $request->end_time]);
    //         })->exists();


    //     if ($conflictRoom) {
    //         return response()->json(['error' => 'Room is already booked at this time.'], 409);
    //     }

    //     $entry->update($request->all());
    //     return response()->json($entry);
    // }


    public function store(Request $request)
    {
        $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'subject' => 'required|string',
            'day' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'required|string',
            'teacher_id' => 'required|exists:users,id',
        ]);

        // ✅ Teacher conflict check
        $conflictTeacher = ScheduleEntry::where('teacher_id', $request->teacher_id)
            ->where('day', $request->day)
            ->where(function ($q) use ($request) {
                $q->where('start_time', '<', $request->end_time)
                    ->where('end_time', '>', $request->start_time);
            })
            ->exists();

        if ($conflictTeacher) {
            return response()->json(['error' => 'Teacher has a time conflict.'], 409);
        }

        // ✅ Room conflict check
        $conflictRoom = ScheduleEntry::where('room', $request->room)
            ->where('day', $request->day)
            ->where(function ($q) use ($request) {
                $q->where('start_time', '<', $request->end_time)
                    ->where('end_time', '>', $request->start_time);
            })
            ->exists();



        if ($conflictRoom) {
            return response()->json(['error' => 'Room is already booked at this time.'], 409);
        }

        // Section conflict check
        $conflictSection = ScheduleEntry::whereHas('schedule', function ($q) use ($request) {
            $q->where('id', $request->schedule_id);
        })
            ->where('day', $request->day)
            ->where(function ($q) use ($request) {
                $q->where('start_time', '<', $request->end_time)
                    ->where('end_time', '>', $request->start_time);
            })
            ->exists();

        if ($conflictSection) {
            return response()->json(['error' => 'This section already has a class at this time.'], 409);
        }


        $entry = ScheduleEntry::create($request->all());
        return response()->json($entry);
    }
    // for time conflict edited 09/07/25
    // public function update(Request $request, $id)
    // {
    //     $entry = ScheduleEntry::findOrFail($id);

    //     $request->validate([
    //         'day' => 'required|string',
    //         'subject' => 'required|string',
    //         'start_time' => 'required|date_format:H:i',
    //         'end_time' => 'required|date_format:H:i|after:start_time',
    //         'room' => 'required|string',
    //         'teacher_id' => 'required|exists:users,id',
    //     ]);

    //     $start_time = $request->start_time;
    //     $end_time = $request->end_time;

    //     // Conflict checking for teacher
    //     $conflictTeacher = ScheduleEntry::where('teacher_id', $request->teacher_id)
    //         ->where('id', '!=', $id)
    //         ->where('day', $request->day)
    //         ->where(function ($q) use ($start_time, $end_time) {
    //             $q->whereBetween('start_time', [$start_time, $end_time])
    //                 ->orWhereBetween('end_time', [$start_time, $end_time]);
    //         })->exists();

    //     if ($conflictTeacher) {
    //         return response()->json(['error' => 'Teacher has a time conflict.'], 409);
    //     }

    //     // Conflict checking for room
    //     $conflictRoom = ScheduleEntry::where('room', $request->room)
    //         ->where('id', '!=', $id)
    //         ->where('day', $request->day)
    //         ->where(function ($q) use ($start_time, $end_time) {
    //             $q->whereBetween('start_time', [$start_time, $end_time])
    //                 ->orWhereBetween('end_time', [$start_time, $end_time]);
    //         })->exists();

    //     if ($conflictRoom) {
    //         return response()->json(['error' => 'Room is already booked at this time.'], 409);
    //     }

    //     // Save the update
    //     $entry->update([
    //         'day' => $request->day,
    //         'subject' => $request->subject,
    //         'start_time' => $start_time,
    //         'end_time' => $end_time,
    //         'room' => $request->room,
    //         'teacher_id' => $request->teacher_id,
    //     ]);

    //     return response()->json($entry);
    // }

    public function update(Request $request, $id)
    {
        $entry = ScheduleEntry::findOrFail($id);

        $request->validate([
            'day' => 'required|string',
            'subject' => 'required|string',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'required|string',
            'teacher_id' => 'required|exists:users,id',
        ]);

        $start_time = $request->start_time;
        $end_time = $request->end_time;

        // ✅ Teacher conflict check (ignore current entry)
        $conflictTeacher = ScheduleEntry::where('teacher_id', $request->teacher_id)
            ->where('id', '!=', $id)
            ->where('day', $request->day)
            ->where(function ($q) use ($start_time, $end_time) {
                $q->where('start_time', '<', $end_time)
                    ->where('end_time', '>', $start_time);
            })
            ->exists();

        if ($conflictTeacher) {
            return response()->json(['error' => 'Teacher has a time conflict.'], 409);
        }

        // ✅ Room conflict check (ignore current entry)
        $conflictRoom = ScheduleEntry::where('room', $request->room)
            ->where('id', '!=', $id)
            ->where('day', $request->day)
            ->where(function ($q) use ($start_time, $end_time) {
                $q->where('start_time', '<', $end_time)
                    ->where('end_time', '>', $start_time);
            })
            ->exists();

        if ($conflictRoom) {
            return response()->json(['error' => 'Room is already booked at this time.'], 409);
        }

        // Section conflict check (exclude current entry)
        $conflictSection = ScheduleEntry::whereHas('schedule', function ($q) use ($request) {
            $q->where('id', $request->schedule_id);
        })
            ->where('id', '!=', $id)
            ->where('day', $request->day)
            ->where(function ($q) use ($request) {
                $q->where('start_time', '<', $request->end_time)
                    ->where('end_time', '>', $request->start_time);
            })
            ->exists();

        if ($conflictSection) {
            return response()->json(['error' => 'This section already has a class at this time.'], 409);
        }

        // Save update
        $entry->update([
            'day' => $request->day,
            'subject' => $request->subject,
            'start_time' => $start_time,
            'end_time' => $end_time,
            'room' => $request->room,
            'teacher_id' => $request->teacher_id,
        ]);

        return response()->json($entry);
    }

    public function destroy($id)
    {
        $entry = ScheduleEntry::findOrFail($id);
        $entry->delete();

        return response()->json(['message' => 'Schedule entry deleted.']);
    }





    public function getMySchedule($id)
    {
        $entries = ScheduleEntry::with('subject', 'schedule.section')
            ->where('teacher_id', $id)
            ->get();

        return response()->json($entries);
    }



    
}

