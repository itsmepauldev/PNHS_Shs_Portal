<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SectionStudentController extends Controller
{
  
    public function index($id)
    {
        $students = DB::table('users')
            ->join('students', 'users.id', '=', 'students.user_id')
            ->where('users.role', 'student')
            ->select(
                'users.id as user_id',
                'users.name',
                'users.email',
                'students.first_name',
                'students.middle_name',
                'students.last_name',
                'students.gender',
                'students.age',
                'students.contact_number',
                'students.emergency_phone',
                'students.gender',
                'students.lrn'
                // add more student fields as needed
            )
            ->get();


        return response()->json($students);
    }



    public function store(Request $request, $id)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
        ]);

        // Prevent duplicate
        $exists = DB::table('section_student')
            ->where('section_id', $id)
            ->where('student_id', $request->student_id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Student already added to this section.'], 409);
        }

        DB::table('section_student')->insert([
            'section_id' => $id,
            'student_id' => $request->student_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Student added to section.']);
    }
   
}
