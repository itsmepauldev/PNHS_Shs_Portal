<?php

namespace App\Http\Controllers;

use App\Models\TeacherInfo;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeacherInfoController extends Controller
{
    public function update(Request $request, $id)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'gender' => 'required|string|in:Male,Female',
            'dob' => 'required|date',
            'age' => 'required|integer|min:18',
            'nationality' => 'required|string',
            'religion' => 'required|string',
            'address' => 'required|string',
            'contact_number' => 'required|string',
            'position' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::findOrFail($id);

        // ✅ Update full name in users table
        $fullName = $request->first_name . ' ' . $request->middle_name . ' ' . $request->last_name;

        $user->password = Hash::make($request->password);
        $user->must_reset_password = false;
        $user->name = trim($fullName);
        $user->save();

        // ✅ Save teacher-specific info
        TeacherInfo::updateOrCreate(
            ['user_id' => $id],
            $request->except(['password', 'password_confirmation']) + ['user_id' => $id]
        );

        return response()->json(['message' => 'Teacher info updated successfully']);
    }

}
