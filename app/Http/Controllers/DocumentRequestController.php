<?php

// app/Http/Controllers/DocumentRequestController.php
namespace App\Http\Controllers;

use App\Models\DocumentRequest;
use Illuminate\Http\Request;

class DocumentRequestController extends Controller
{
    // Admin: get all requests
    public function index()
    {
        $requests = DocumentRequest::with('student')->latest()->get();
        return response()->json($requests);
    }

    // Admin: upload document
    public function upload(Request $request, $id)
    {
        $doc = DocumentRequest::findOrFail($id);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('documents', 'public');
            $doc->update([
                'file_path' => $path,
                'status' => 'Completed'
            ]);
        }

        return response()->json(['message' => 'Document uploaded successfully']);
    }

    // Admin: reject request
    public function reject(Request $request, $id)
    {
        $doc = DocumentRequest::findOrFail($id);
        $doc->update([
            'status' => 'Rejected',
            'reject_reason' => $request->reason
        ]);
        return response()->json(['message' => 'Request rejected']);
    }

    // Admin: reupload
    public function reupload(Request $request, $id)
    {
        $doc = DocumentRequest::findOrFail($id);

        if ($request->hasFile('file')) {
            $path = $request->file('file')->store('documents', 'public');
            $doc->update([
                'file_path' => $path,
                'status' => 'Completed'
            ]);
        }

        return response()->json(['message' => 'Document reuploaded successfully']);
    }

    // app/Http/Controllers/DocumentRequestController.php

    // public function store(Request $request)
    // {
    //     // If you use Sanctum/Session auth, prefer: $studentId = $request->user()->id;
    //     $validated = $request->validate([
    //         'student_id' => 'required|exists:users,id',
    //         'document' => 'required|in:Good Moral,Form 137,Enrollment Certificate',
    //     ]);

    //     // Prevent duplicate pending request of same type
    //     $exists = \App\Models\DocumentRequest::where('student_id', $validated['student_id'])
    //         ->where('document', $validated['document'])
    //         ->where('status', 'Pending')
    //         ->exists();

    //     if ($exists) {
    //         return response()->json([
    //             'message' => 'You already have a pending request for this document.'
    //         ], 422);
    //     }

    //     $req = \App\Models\DocumentRequest::create([
    //         'student_id' => $validated['student_id'],
    //         'document' => $validated['document'],
    //         'status' => 'Pending',
    //     ])->load('student');

    //     return response()->json([
    //         'message' => 'Request submitted.',
    //         'data' => $req,
    //     ], 201);
    // }

   public function store(Request $request)
{
    $validated = $request->validate([
        'student_id' => 'required|exists:users,id',
        'document' => 'required|in:Good Moral,Form 137,Enrollment Certificate',
    ]);

    // Count only successful requests (Pending + Completed) — ignore Rejected
    $totalRequests = \App\Models\DocumentRequest::where('student_id', $validated['student_id'])
        ->where('document', $validated['document'])
        ->whereIn('status', ['Pending', 'Completed']) // ✅ ignore rejected
        ->count();

    if ($totalRequests >= 3) {
        return response()->json([
            'message' => 'You can only request this document up to 3 times.'
        ], 422);
    }

    // Prevent duplicate pending request of same type
    $exists = \App\Models\DocumentRequest::where('student_id', $validated['student_id'])
        ->where('document', $validated['document'])
        ->where('status', 'Pending')
        ->exists();

    if ($exists) {
        return response()->json([
            'message' => 'You already have a pending request for this document.'
        ], 422);
    }

    $req = \App\Models\DocumentRequest::create([
        'student_id' => $validated['student_id'],
        'document' => $validated['document'],
        'status' => 'Pending',
    ])->load('student');

    return response()->json([
        'message' => 'Request submitted.',
        'data' => $req,
    ], 201);
}


    // app/Http/Controllers/DocumentRequestController.php

    public function myRequests(Request $request)
    {
        // If using Sanctum auth
        // $studentId = $request->user()->id;
        // But since you're passing student_id from frontend:
        $studentId = $request->query('student_id');

        $requests = DocumentRequest::where('student_id', $studentId)
            ->latest()
            ->get();

        return response()->json($requests);
    }
    public function destroy($id)
    {
        $req = \App\Models\DocumentRequest::findOrFail($id);
        if ($req->status !== 'Pending') {
            return response()->json(['message' => 'Only pending requests can be cancelled.'], 422);
        }
        $req->delete();
        return response()->json(['message' => 'Request cancelled.']);
    }

}
