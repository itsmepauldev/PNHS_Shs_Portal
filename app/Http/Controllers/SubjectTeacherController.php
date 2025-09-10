<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Section;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SubjectTeacherController extends Controller
{
    public function index($id)
    {
        $data = DB::table('subject_teachers')
            ->join('users', 'users.id', '=', 'subject_teachers.teacher_id')
            ->where('section_id', $id)
            ->select('subject_teachers.id', 'users.name as teacher_name', 'subject_teachers.subject')
            ->get();

        return response()->json($data);
    }

    public function store(Request $request, $id)
    {
        $request->validate([
            'teacher_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
        ]);

        DB::table('subject_teachers')->insert([
            'section_id' => $id,
            'teacher_id' => $request->teacher_id,
            'subject' => $request->subject,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Subject teacher assigned.']);
    }


}


