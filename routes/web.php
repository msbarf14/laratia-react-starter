<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('login'));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::delete('users/bulk', [UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
    Route::patch('users/{user}/verification', [UserController::class, 'toggleVerification'])->name('users.toggle-verification');
    Route::resource('users', UserController::class)->only(['index', 'create', 'store', 'edit', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
