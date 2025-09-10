<?php

// app/Models/TeacherInfo.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'middle_name',
        'last_name',
        'gender',
        'dob',
        'age',
        'nationality',
        'religion',
        'address',
        'contact_number',
        'position',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
