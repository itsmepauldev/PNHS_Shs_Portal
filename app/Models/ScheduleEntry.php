<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleEntry extends Model
{

    protected $fillable = [
        'schedule_id',
        'day',
        'subject',
        'start_time',
        'end_time',
        'room',
        'teacher_id',
    ];



    // ScheduleEntry.php
    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    // App\Models\ScheduleEntry.php



    public function section()
    {
        return $this->belongsToThrough(Section::class, Schedule::class);
    }

}
