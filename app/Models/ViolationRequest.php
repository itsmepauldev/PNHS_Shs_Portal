<?php
// app/Models/ViolationRequest.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ViolationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'submitted_by',
        'violation_type',
        'offense_level',
        'description',
        'status',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }
}

