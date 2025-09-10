<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AdviserSectionAssigned implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $section;

    public function __construct($section)
    {
        $this->section = $section;
    }

    public function broadcastOn(): Channel
    {
        // Target the adviser using their user-specific private channel
        return new PrivateChannel('adviser.' . $this->section->adviser_id);
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->section->id,
            'section_name' => $this->section->section_name,
            'grade_level' => $this->section->grade_level,
            'strand' => $this->section->strand,
        ];
    }

    public function broadcastAs(): string
    {
        return 'SectionAssigned';
    }
}
