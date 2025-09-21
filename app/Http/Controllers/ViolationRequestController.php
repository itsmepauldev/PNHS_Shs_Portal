<?php

namespace App\Http\Controllers;

use App\Models\ViolationRequest;
use Illuminate\Http\Request;

class ViolationRequestController extends Controller
{
    // Teacher/Adviser sends request
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'violation_type' => 'required|string',
            'offense_level' => 'required|string',
            'description' => 'required|string',
        ]);

        $req = ViolationRequest::create([
            'student_id' => $request->student_id,
            'submitted_by' => auth()->id(),
            'violation_type' => $request->violation_type,
            'offense_level' => $request->offense_level,
            'description' => $request->description,
            'status' => 'pending',
        ]);

        return response()->json(['message' => 'Violation request sent to Guidance', 'request' => $req]);
    }

    // Teacher/Adviser can view their own requests
    public function myRequests()
    {
        $requests = ViolationRequest::with(['student'])
            ->where('submitted_by', auth()->id())
            ->latest()
            ->get();

        return response()->json($requests);
    }

    // Guidance sees all requests
    public function index()
    {
        $requests = ViolationRequest::with(['student', 'submittedBy'])
            ->latest()
            ->get();

        return response()->json($requests);
    }

    // Guidance marks as reviewed (once manually inputted into violations)
    public function markReviewed($id)
    {
        $req = ViolationRequest::findOrFail($id);
        $req->status = 'reviewed';
        $req->save();

        return response()->json(['message' => 'Request marked as reviewed']);
    }

    public function decline($id)
    {
        $request = ViolationRequest::findOrFail($id);
        $request->status = 'declined';
        $request->save();

        return response()->json(['message' => 'Request declined']);
    }

}

