<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStudentsTable extends Migration
{
    public function up()
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Personal Information
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('gender');
            $table->date('birth_date');
            $table->integer('age');
            $table->string('nationality');
            $table->string('religion');
            $table->text('home_address');
            $table->string('contact_number');

            // 4Ps
            $table->boolean('is_4ps');

            // Family Information
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('guardian_name')->nullable();

            // Emergency Contact
            $table->string('emergency_contact_name');
            $table->string('emergency_relationship');
            $table->string('emergency_phone');
            $table->string('emergency_address');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('students');
    }
}
