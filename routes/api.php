<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Section;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SubjectTeacherController;
use App\Http\Controllers\SectionStudentController;
use App\Http\Controllers\TeacherInfoController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\ScheduleEntryController;
use App\Http\Controllers\StudentScheduleController;
use App\Http\Controllers\ViolationController;
use App\Http\Controllers\DocumentRequestController;
// Login Route
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'must_reset_password' => $user->must_reset_password, // use your column name
        ]
    ]);
});

// Protected users list
Route::middleware('auth:sanctum')->get('/users', function () {
    return response()->json([
        'users' => User::all()
    ]);
});

// CRUD user routes
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
Route::put('/users/{id}', [UserController::class, 'update']);
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Reset password (logged-in user)
Route::middleware('auth:sanctum')->post('/reset-password', function (Request $request) {
    $request->validate(['password' => 'required|min:8']);

    $user = $request->user();
    $user->password = Hash::make($request->password);
    $user->must_reset_password = false;
    $user->save();

    return response()->json(['message' => 'Password reset successful']);
});

// Reset password (by user ID, e.g. after login)
Route::post('/reset-password/{id}', function (Request $request, $id) {
    $request->validate(['password' => 'required|min:6']);

    $user = User::findOrFail($id);
    $user->password = Hash::make($request->password);
    $user->must_reset_password = false;
    $user->save();

    return response()->json(['message' => 'Password updated']);
});

Route::get('/users/{id}', function ($id) {
    $user = \App\Models\User::find($id);
    if (!$user)
        return response()->json(['error' => 'User not found'], 404);
    return response()->json(['user' => $user]);
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    $user = $request->user();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    return response()->json($user);
});

Route::get('/sections', [SectionController::class, 'index']);
Route::post('/sections', [SectionController::class, 'store']);
Route::put('/sections/{id}', [SectionController::class, 'update']);   // ✅ For edit
Route::delete('/sections/{id}', [SectionController::class, 'destroy']); // ✅ For delete

Route::get('/adviser/sections', function () {
    return \App\Models\Section::where('adviser_id', auth()->id())->get();
})->middleware('auth:sanctum');

Route::get('/sections/{id}', [SectionController::class, 'show'])->middleware('auth:sanctum');



// ✅ Get subject teachers assigned to a section
// Route::get('/sections/{id}/subject-teachers', [SubjectTeacherController::class, 'index'])->middleware('auth:sanctum');

// ✅ Assign a subject teacher to a section
Route::post('/sections/{id}/assign-subject-teacher', [SubjectTeacherController::class, 'store'])->middleware('auth:sanctum');

// ✅ Get students in a section
Route::get('/sections/{id}/students', [SectionStudentController::class, 'index'])->middleware('auth:sanctum');

// ✅ Add a student to a section
Route::post('/sections/{id}/add-student', [SectionStudentController::class, 'store'])->middleware('auth:sanctum');
Route::put('/section-student/{id}/update', [SectionStudentController::class, 'update'])->middleware('auth:sanctum');

Route::post('/sections/{id}/add-student', [SectionController::class, 'addStudent']);
// Route::get('/sections/{id}/subject-teachers', [SectionController::class, 'getSubjectTeachers']);

//Route::get('/sections/{id}/students', [SectionController::class, 'getSectionStudents']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/sections/{id}/students', [SectionController::class, 'getSectionStudents']);
});

Route::middleware('auth:sanctum')->get('/teacher/subjects', function (Request $request) {
    return $request->user()->assignedSubjects()->with('section')->get();
});

use App\Http\Controllers\StudentInfoController;

Route::middleware('auth:sanctum')->put('/student-info/{id}', [StudentInfoController::class, 'update']);
Route::put('/teacher-info/{id}', [TeacherInfoController::class, 'update']);



Route::post('/users/{id}/reset-password', [UserController::class, 'resetPasswordToDefault']);
Route::get('/students', [UserController::class, 'getStudents']);



Route::put('/students/{id}', [StudentInfoController::class, 'update']);
Route::get('/students', [StudentInfoController::class, 'index']);

Route::delete('/students/{id}', [StudentInfoController::class, 'destroy']);

Route::put('/section/remove-student/{id}', [SectionController::class, 'removeStudent']);



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::post('/schedules', [ScheduleController::class, 'store']);
    Route::put('/schedules/{id}', [ScheduleController::class, 'update']);
    Route::delete('/schedules/{id}', [ScheduleController::class, 'destroy']);
    Route::get('/schedules/{id}', [ScheduleController::class, 'show']);

    Route::post('/schedule-entries', [ScheduleEntryController::class, 'store']);
    Route::put('/schedule-entries/{id}', [ScheduleEntryController::class, 'update']);
    Route::delete('/schedule-entries/{id}', [ScheduleEntryController::class, 'destroy']);
    // routes/api.php

    // In routes/api.php
    Route::get('/available-sections', [SectionController::class, 'getAvailableSections']);
    Route::get('/sections/{id}/assigned-teachers', [SectionController::class, 'getAssignedTeachers']);
    Route::get('/sections/{section}/teachers', [SectionController::class, 'getTeachers']);
    // Route::get('/sections/{id}/subject-teachers', [SectionController::class, 'getSubjectTeachers']);
    Route::middleware('auth:sanctum')->get('/sections/{id}/subject-teachers', [SectionController::class, 'getSubjectTeachers']);
    Route::get('/schedule-entries', [ScheduleEntryController::class, 'index']);
    Route::get('/schedules/section/{sectionId}', [ScheduleController::class, 'getBySectionId']);
    Route::get('/schedules/section/{sectionId}', [ScheduleController::class, 'getBySection']);
    Route::put('/schedule-entries/{id}', [ScheduleEntryController::class, 'update']);
    Route::delete('/schedule-entries/{id}', [ScheduleEntryController::class, 'destroy']);





    Route::get('/my-schedule/{teacherId}', [ScheduleController::class, 'getTeacherSchedule']);
    Route::get('/my-schedule/{id}', [ScheduleEntryController::class, 'getMySchedule']);


    Route::middleware('auth:sanctum')->get('/student/schedule', [StudentScheduleController::class, 'getSchedule']);

});
Route::get('/student/schedule', [ScheduleController::class, 'studentSchedule']);
Route::middleware('auth:sanctum')->get('/student/schedule', [StudentScheduleController::class, 'index']);
Route::put('/violations/{id}', [ViolationController::class, 'update']);



















Route::get('/violations', [ViolationController::class, 'index']);
Route::post('/violations', [ViolationController::class, 'store']);




Route::get('/students/available', [ViolationController::class, 'getAvailableStudents']);
Route::post('/violations/assign', [ViolationController::class, 'assignViolation']);



Route::get('/violations', [ViolationController::class, 'index']);
Route::get('/violations/students', [ViolationController::class, 'getStudents']);
Route::post('/violations', [ViolationController::class, 'store']);
Route::delete('/violations/{id}', [ViolationController::class, 'destroy']);
Route::get('/violations/student/{id}/last-offense', [ViolationController::class, 'getStudentLastOffense']);




Route::get('/violations/student/{studentId}', [ViolationController::class, 'getViolationsByStudent']);






Route::get('/document-requests', [DocumentRequestController::class, 'index']);
Route::post('/document-requests/{id}/upload', [DocumentRequestController::class, 'upload']);
Route::post('/document-requests/{id}/reject', [DocumentRequestController::class, 'reject']);
Route::post('/document-requests/{id}/reupload', [DocumentRequestController::class, 'reupload']);
Route::get('/document-requests', [DocumentRequestController::class, 'index']);
Route::post('/document-requests', [DocumentRequestController::class, 'store']);
Route::get('/my-document-requests', [DocumentRequestController::class, 'myRequests']); // Student
Route::delete('/document-requests/{id}', [DocumentRequestController::class, 'destroy']);



Route::put('/sections/{id}/subject-teachers/{teacher}', [SectionController::class, 'updateSubjectTeacher']);
Route::delete('/sections/{id}/subject-teachers/{teacher}', [SectionController::class, 'removeSubjectTeacher']);




