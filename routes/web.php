<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AmazonPreviewController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});

Route::get('/parts', function () {
    return view('parts');
});

Route::get('/login', [AdminAuthController::class, 'show'])->name('login');
Route::post('/login', [AdminAuthController::class, 'login']);
Route::post('/logout', [AdminAuthController::class, 'logout'])->name('logout');

Route::post('/api/amazon/preview', AmazonPreviewController::class)->middleware('admin');
