<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('violations', function (Blueprint $table) {
            $table->enum('offense_level', ['1st Warning', '2nd Warning', '3rd Warning'])->nullable()->after('description');
        });
    }

    public function down()
    {
        Schema::table('violations', function (Blueprint $table) {
            $table->dropColumn('offense_level');
        });
    }

};
