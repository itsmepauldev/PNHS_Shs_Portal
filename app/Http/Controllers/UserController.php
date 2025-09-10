<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use App\Models\Section;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function index()
    {
        try {
            return response()->json([
                'users' => User::all()
            ]);
        } catch (\Exception $e) {
            Log::error('Fetch users failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch users'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'role' => 'required|in:admin,teacher,adviser,student',
            ]);

            // Set default password for teacher/student, use input password for admin
            $defaultPassword = '12345678';
            $password = $request->role === 'admin'
                ? $request->input('password') // Require password from input for admin
                : $defaultPassword;

            // Validation: if admin, password must be given and minimum 6 characters
            if ($request->role === 'admin') {
                $request->validate([
                    'password' => 'required|min:6',
                ]);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
                'password' => Hash::make($password),
                'must_reset_password' => $request->role !== 'admin', // true for teacher/student
            ]);

            return response()->json([
                'message' => 'User created successfully',
                'user' => $user,
            ], 201);
        } catch (\Exception $e) {
            Log::error('User creation failed: ' . $e->getMessage());
            return response()->json(['error' => 'User creation failed'], 500);
        }
    }




    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|string|in:admin,adviser,teacher,student',
            'password' => $request->filled('password') ? 'nullable|string|min:8' : '',
        ]);

        // Update user info
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (!empty($validated['password'])) {
            $user->password = bcrypt($validated['password']);
            $user->must_reset_password = false;
        }

        // If role changed from adviser to something else, remove from sections
        if ($user->role !== 'adviser') {
            Section::where('adviser_id', $user->id)->update(['adviser_id' => null]);
        }

        $user->save();

        return response()->json(['message' => 'User updated successfully']);
    }


    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->delete();

            return response()->json(['message' => 'User deleted']);
        } catch (\Exception $e) {
            Log::error('User deletion failed: ' . $e->getMessage());
            return response()->json(['error' => 'Delete failed'], 500);
        }
    }
    // public function getStudents($id)
    // {
    //     $students = User::with('student')
    //         ->where('role', 'student')
    //         ->where('section_id', $id)
    //         ->get();

    //     return response()->json($students);
    // }


}
