<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;
class Schedule extends Model
{

    protected $fillable = [
        'section_id',
    ];
    // Schedule.php
    public function entries()
    {
        return $this->hasMany(ScheduleEntry::class);
    }
    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }


}
