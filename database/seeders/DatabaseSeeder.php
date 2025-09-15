<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Create 2 Admins
        for ($i = 1; $i <= 2; $i++) {
            $firstName = $faker->firstName;
            $lastName  = $faker->lastName;

            User::create([
                'name' => "$firstName $lastName",
                'email' => strtolower($lastName) . $i . '@gmail.com',
                'password' => Hash::make('12345678'),
                'role' => 'admin',
                'must_reset_password' => false,
            ]);
        }

        // Create 5 Teachers
        for ($i = 1; $i <= 5; $i++) {
            $firstName = $faker->firstName;
            $lastName  = $faker->lastName;

            User::create([
                'name' => "$firstName $lastName",
                'email' => strtolower($lastName) . "t$i@gmail.com",
                'password' => Hash::make('12345678'),
                'role' => 'teacher',
                'must_reset_password' => true,
            ]);
        }

        // Create 5 Advisers
        for ($i = 1; $i <= 5; $i++) {
            $firstName = $faker->firstName;
            $lastName  = $faker->lastName;

            User::create([
                'name' => "$firstName $lastName",
                'email' => strtolower($lastName) . "a$i@gmail.com",
                'password' => Hash::make('12345678'),
                'role' => 'adviser',
                'must_reset_password' => true,
            ]);
        }

        // Create 20 Students
        for ($i = 1; $i <= 20; $i++) {
            $firstName = $faker->firstName;
            $lastName  = $faker->lastName;

            User::create([
                'name' => "$firstName $lastName",
                'email' => strtolower($lastName) . "s$i@gmail.com",
                'password' => Hash::make('12345678'),
                'role' => 'student',
                'must_reset_password' => true,
            ]);
        }
    }
}
