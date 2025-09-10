<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('schedule_entries', function (Blueprint $table) {
            $table->string('day')->after('schedule_id');
        });
    }

    public function down(): void
    {
        Schema::table('schedule_entries', function (Blueprint $table) {
            $table->dropColumn('day');
        });
    }
};
