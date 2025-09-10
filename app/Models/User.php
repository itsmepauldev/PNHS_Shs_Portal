<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Section;
class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'must_reset_password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function assignedSubjects()
    {
        return $this->hasMany(\App\Models\SubjectTeacher::class, 'teacher_id');
    }
    public function student()
    {
        return $this->hasOne(\App\Models\Student::class, 'user_id');
    }
    public function subjectTeachers()
    {
        return $this->hasMany(SubjectTeacher::class, 'teacher_id');
    }
    public function section()
    {
        return $this->belongsTo(Section::class);
    }
    public function scheduleEntries()
    {
        return $this->hasMany(ScheduleEntry::class, 'teacher_id');
    }





    public function violations()
    {
        return $this->hasMany(Violation::class, 'student_id');
    }


}
