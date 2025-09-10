<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'violation_type',
        'description',
        'offense_level',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
