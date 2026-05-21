<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Seed the single admin account.
     *
     * ⚠ Set your password below before running.
     *     php artisan db:seed --class=AdminSeeder
     *
     * Re-running this seeder updates the existing admin's password
     * (idempotent — won't create duplicates).
     */
    public function run(): void
    {
        // 👉 EDIT THIS LINE — replace with your real password
        $password = 'EDIT THIS';

        DB::table('admins')->updateOrInsert(
            ['id' => 1],
            [
                'password' => Hash::make($password),
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }
}
