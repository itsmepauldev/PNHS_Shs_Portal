<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class StudentInfoController extends Controller
{


    public function index()
    {
        $students = Student::with('user')->get(); // assumes Student belongsTo User
        return response()->json($students);
    }
   

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // If password is included, it's likely a student filling out their full profile
        if ($request->has('password')) {
            $request->validate([
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'gender' => 'required|string',
                'birth_date' => 'required|date',
                'age' => 'required|integer',
                'nationality' => 'required|string',
                'religion' => 'required|string',
                'home_address' => 'required|string',
                'contact_number' => 'required|string',
                'is_4ps' => 'required|boolean',
                'emergency_contact_name' => 'required|string',
                'emergency_relationship' => 'required|string',
                'emergency_phone' => 'required|string',
                'emergency_address' => 'required|string',
                'password' => 'required|string|min:6|confirmed',
                 'password' => 'required|string|min:6|confirmed',

            ]);

            $user->password = Hash::make($request->password);
            $user->must_reset_password = false;
            $fullName = $request->first_name . ' ' . $request->middle_name . ' ' . $request->last_name;
            $user->name = trim($fullName);
            $user->save();

            Student::updateOrCreate(
                ['user_id' => $id],
                $request->except(['password', 'password_confirmation']) + ['user_id' => $id]
            );

            return response()->json(['message' => 'Student self-info submitted successfully']);
        }

        // If `student` key exists, it's likely the admin updating a student's info
        if ($request->has('student')) {
            $validated = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email',
                'student.gender' => 'required|string|in:male,female',
                'student.age' => 'required|integer',
                'student.address' => 'required|string',
                'student.contact_number' => 'required|string',
                'student.emergency_contact' => 'required|string',
                'student.lrn' => 'nullable|string|max:255',
            ]);

            $user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            if ($user->student) {
                $user->student->update([
                    'gender' => $request->student['gender'],
                    'lrn' => $request->student['lrn'],
                    'age' => $request->student['age'],
                    'home_address' => $request->student['address'],
                    'contact_number' => $request->student['contact_number'],
                    'emergency_phone' => $request->student['emergency_contact'],
                ]);
            }

            return response()->json(['message' => 'Student updated by admin']);
        }

        return response()->json(['message' => 'Invalid update request'], 422);
    }
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Delete related student info first if exists
        if ($user->student) {
            $user->student->delete();
        }

        $user->delete();

        return response()->json(['message' => 'Student and user deleted successfully']);
    }

}
