<?php

namespace App\Http\Controllers;

use App\Models\Violation;
use App\Models\User;
use Illuminate\Http\Request;

class ViolationController extends Controller
{
    // Fetch all violations with student info
    public function index()
    {
        $violations = Violation::with('student')->latest()->get();
        return response()->json($violations);
    }



    // Store new violation
    // public function store(Request $request)
    // {
    //     try {
    //         $validated = $request->validate([
    //             'student_id' => 'required|exists:users,id',
    //             'violation_type' => 'required|string',
    //             'description' => 'required|string|max:500',
    //             'offense_level' => 'required|string|in:1st Warning,2nd Warning,3rd Warning',
    //         ]);

    //         $violation = Violation::create($validated);

    //         return response()->json([
    //             'message' => 'Violation added successfully',
    //             'violation' => $violation->load('student')
    //         ]);
    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         return response()->json([
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'student_id' => 'required|exists:users,id',
                'violation_type' => 'required|string',
                'description' => 'required|string|max:500',
            ]);

            // Check the student's latest warning
            $latest = Violation::where('student_id', $validated['student_id'])
                ->orderBy('id', 'desc') // latest record
                ->first();

            // Determine next warning
            if (!$latest) {
                $nextWarning = "1st Warning";
            } elseif ($latest->offense_level === "1st Warning") {
                $nextWarning = "2nd Warning";
            } elseif ($latest->offense_level === "2nd Warning") {
                $nextWarning = "3rd Warning";
            } else {
                // Already at 3rd Warning → reject request
                return response()->json([
                    'status' => 'declined',
                    'message' => 'This student already has 3rd Warning. No more violations can be recorded.'
                ], 422);
            }

            // Create violation with correct warning
            $violation = Violation::create([
                'student_id' => $validated['student_id'],
                'violation_type' => $validated['violation_type'],
                'description' => $validated['description'],
                'offense_level' => $nextWarning,
            ]);

            return response()->json([
                'status' => 'approved',
                'message' => "Violation recorded as {$nextWarning}",
                'violation' => $violation->load('student')
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Delete violation
    public function destroy($id)
    {
        $violation = Violation::findOrFail($id);
        $violation->delete();

        return response()->json(['message' => 'Violation deleted successfully']);
    }
    // ViolationController.php
    public function getStudentLastOffense($studentId)
    {
        $lastOffense = Violation::where('student_id', $studentId)
            ->orderBy('created_at', 'desc')
            ->value('offense_level');

        return response()->json(['last_offense' => $lastOffense]);
    }

    public function getStudents()
    {
        $students = User::where('role', 'student')
            ->whereDoesntHave('violations', function ($query) {
                $query->where('offense_level', '3rd Warning');
            })
            ->select('id', 'name')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json($students);
    }


    // In ViolationController.php
    public function getViolationsByStudent($studentId)
    {
        $violations = Violation::where('student_id', $studentId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($violations);
    }
    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate([
                'student_id' => 'required|exists:users,id',
                'violation_type' => 'required|string',
                'description' => 'required|string|max:500',
                'offense_level' => 'required|string|in:1st Warning,2nd Warning,3rd Warning',
            ]);

            $violation = Violation::findOrFail($id);
            $violation->update($validated);

            return response()->json([
                'message' => 'Violation updated successfully',
                'violation' => $violation->load('student')
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
