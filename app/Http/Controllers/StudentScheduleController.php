<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Schedule;

class StudentScheduleController extends Controller
{
    public function studentSchedule(Request $request)
    {
        $user = $request->user(); // from auth

        if ($user->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $sectionId = $user->section_id;

        if (!$sectionId) {
            return response()->json(['message' => 'Student not assigned to a section'], 404);
        }

        $schedules = Schedule::with('section')
            ->where('section_id', $sectionId)
            ->get();

        return response()->json($schedules);
    }
    public function index(Request $request)
    {
        $student = $request->user(); // Authenticated student

        if ($student->role !== 'student') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$student->section_id) {
            return response()->json(['message' => 'No section assigned'], 404);
        }

        // $schedule = Schedule::with('section')
        //     ->where('section_id', $student->section_id)
        //     ->get();
        $schedule = Schedule::with(['section', 'entries.teacher',]) // include entries
            ->where('section_id', $student->section_id)
            ->get();


        return response()->json($schedule);
    }


}