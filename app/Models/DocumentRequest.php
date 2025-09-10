<?php
// app/Models/DocumentRequest.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'document',
        'status',
        'file_path',
        'reject_reason',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
