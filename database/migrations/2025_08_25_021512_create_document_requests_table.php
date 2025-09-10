<?php
// database/migrations/xxxx_xx_xx_create_document_requests_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('document_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id'); // link to users table
            $table->string('document'); // Good Moral, Form 137, Enrollment Certificate
            $table->string('status')->default('Pending'); // Pending, Completed, Rejected
            $table->string('file_path')->nullable(); // uploaded file
            $table->string('reject_reason')->nullable();
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_requests');
    }
};
