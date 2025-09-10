<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User; // ✅ Add this line

class Section extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_name',
        'strand',
        'grade_level',
        'adviser_id',
        'semester',
        'school_year',
    ];

    public function adviser()
    {
        return $this->belongsTo(User::class, 'adviser_id');
    }

    public function subjectTeachers()
    {
        return $this->hasMany(\App\Models\SubjectTeacher::class);
    }
    public function entries()
    {
        return $this->hasMany(ScheduleEntry::class);
    }

    // App\Models\Section.php

    public function students()
    {
        return $this->belongsToMany(User::class, 'section_student');
    }

    public function schedule()
    {
        return $this->hasOne(Schedule::class);
    }


}
