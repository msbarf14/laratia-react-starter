<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('it creates a user from interactive input', function () {
    $this->artisan('make:user')
        ->expectsQuestion('Name', 'Admin User')
        ->expectsQuestion('Email', 'admin@example.com')
        ->expectsQuestion('Username', 'Admin_User')
        ->expectsQuestion('Password', 'password')
        ->expectsQuestion('Confirm password', 'password')
        ->expectsOutput('User admin_user (admin@example.com) created successfully.')
        ->assertSuccessful();

    $user = User::query()->where('email', 'admin@example.com')->firstOrFail();

    expect($user->name)->toBe('Admin User')
        ->and($user->username)->toBe('admin_user')
        ->and(Hash::check('password', $user->password))->toBeTrue();

    $this->assertModelExists($user);
});

test('it rejects an email that is already in use', function () {
    User::factory()->create(['email' => 'admin@example.com']);

    $this->artisan('make:user')
        ->expectsQuestion('Name', 'Another Admin')
        ->expectsQuestion('Email', 'admin@example.com')
        ->expectsQuestion('Username', 'another_admin')
        ->expectsQuestion('Password', 'password')
        ->expectsQuestion('Confirm password', 'password')
        ->assertFailed();

    expect(User::query()->where('email', 'admin@example.com')->count())->toBe(1);
});

test('it rejects a username that is already in use', function () {
    User::factory()->create(['username' => 'admin_user']);

    $this->artisan('make:user')
        ->expectsQuestion('Name', 'Another Admin')
        ->expectsQuestion('Email', 'another@example.com')
        ->expectsQuestion('Username', 'ADMIN_USER')
        ->expectsQuestion('Password', 'password')
        ->expectsQuestion('Confirm password', 'password')
        ->assertFailed();

    expect(User::query()->where('username', 'admin_user')->count())->toBe(1);
});

test('it rejects an invalid password', function (string $password, string $confirmation) {
    $this->artisan('make:user')
        ->expectsQuestion('Name', 'Admin User')
        ->expectsQuestion('Email', 'admin@example.com')
        ->expectsQuestion('Username', 'admin_user')
        ->expectsQuestion('Password', $password)
        ->expectsQuestion('Confirm password', $confirmation)
        ->assertFailed();

    expect(User::query()->where('email', 'admin@example.com')->exists())->toBeFalse();
})->with([
    'too short' => ['short', 'short'],
    'confirmation does not match' => ['password', 'different-password'],
]);
