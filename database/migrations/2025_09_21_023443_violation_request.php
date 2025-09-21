<?php
// database/migrations/xxxx_xx_xx_create_violation_requests.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('violation_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('submitted_by'); // teacher/adviser
            $table->string('violation_type');
            $table->string('offense_level');
            $table->text('description');
            $table->string('status')->default('pending'); // pending, reviewed
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('submitted_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('violation_requests');
    }
};
