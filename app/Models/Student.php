<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lrn',
        'first_name',
        'middle_name',
        'last_name',
        'gender',
        'birth_date',
        'age',
        'nationality',
        'religion',
        'home_address',
        'contact_number',
        'is_4ps',
        'father_name',
        'mother_name',
        'guardian_name',
        'emergency_contact_name',
        'emergency_relationship',
        'emergency_phone',
        'emergency_address',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function section()
    {
        return $this->belongsToMany(Section::class, 'section_student');
    }

}

