<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Section;

class SubjectTeacher extends Model
{
    protected $fillable = ['teacher_id', 'section_id', 'subject'];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
