<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

test('guests cannot access user management', function () {
    $this->get(route('users.index'))->assertRedirect(route('login'));
});

test('authenticated users can view paginated users', function () {
    $actor = User::factory()->create();
    User::factory()->count(14)->create();

    $this->actingAs($actor)
        ->get(route('users.index', ['per_page' => 10]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/index')
            ->has('users.data', 10)
            ->where('users.total', 15)
            ->where('users.per_page', 10)
            ->where('filters.per_page', 10)
        );
});

test('an authenticated user can visit the create user page', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->get(route('users.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('users/create'));
});

test('an authenticated user can create a user', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->post(route('users.store'), [
            'name' => 'New User',
            'username' => 'new_user',
            'email' => 'new-user@example.test',
            'password' => 'StrongPassword123!',
            'password_confirmation' => 'StrongPassword123!',
            'email_verified' => true,
        ])
        ->assertRedirect(route('users.index'));

    $user = User::where('email', 'new-user@example.test')->firstOrFail();

    expect($user)
        ->name->toBe('New User')
        ->username->toBe('new_user')
        ->email_verified_at->not->toBeNull();
    expect(Hash::check('StrongPassword123!', $user->password))->toBeTrue();
});

test('user creation validates unique credentials and password confirmation', function () {
    $actor = User::factory()->create();
    $existingUser = User::factory()->create();

    $this->actingAs($actor)
        ->from(route('users.create'))
        ->post(route('users.store'), [
            'name' => 'Invalid User',
            'username' => $existingUser->username,
            'email' => $existingUser->email,
            'password' => 'StrongPassword123!',
            'password_confirmation' => 'different-password',
            'email_verified' => false,
        ])
        ->assertRedirect(route('users.create'))
        ->assertSessionHasErrors(['username', 'email', 'password']);
});

test('users can be searched and filtered by verification status', function () {
    $actor = User::factory()->create();
    User::factory()->create([
        'name' => 'Ayu Verified',
        'email' => 'ayu@example.test',
        'username' => 'ayu',
    ]);
    User::factory()->unverified()->create([
        'name' => 'Ayu Pending',
        'email' => 'pending@example.test',
        'username' => 'ayu_pending',
    ]);

    $this->actingAs($actor)
        ->get(route('users.index', [
            'search' => 'ayu',
            'verification' => 'unverified',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Ayu Pending')
            ->where('filters.search', 'ayu')
            ->where('filters.verification', 'unverified')
        );
});

test('an authenticated user can delete another user', function () {
    $actor = User::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($actor)
        ->delete(route('users.destroy', $user))
        ->assertRedirect();

    $this->assertModelMissing($user);
});

test('an authenticated user cannot delete their own account', function () {
    $actor = User::factory()->create();

    $this->actingAs($actor)
        ->delete(route('users.destroy', $actor))
        ->assertUnprocessable();

    $this->assertModelExists($actor);
});

test('selected users can be deleted in bulk', function () {
    $actor = User::factory()->create();
    $users = User::factory()->count(3)->create();

    $this->actingAs($actor)
        ->delete(route('users.bulk-destroy'), [
            'ids' => $users->pluck('id')->all(),
        ])
        ->assertRedirect();

    $users->each(fn (User $user) => $this->assertModelMissing($user));
    $this->assertModelExists($actor);
});

test('all filtered users can be deleted in bulk without selecting every page', function () {
    $actor = User::factory()->create(['name' => 'Keep Me']);
    User::factory()->create(['name' => 'Remove One']);
    User::factory()->create(['name' => 'Remove Two']);
    User::factory()->create(['name' => 'Other User']);

    $this->actingAs($actor)
        ->delete(route('users.bulk-destroy'), [
            'all' => true,
            'search' => 'Remove',
            'verification' => 'all',
        ])
        ->assertRedirect();

    expect(User::where('name', 'like', 'Remove%')->count())->toBe(0);
    expect(User::where('name', 'Other User')->exists())->toBeTrue();
    $this->assertModelExists($actor);
});

test('the current account is protected during bulk deletion', function () {
    $actor = User::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($actor)
        ->delete(route('users.bulk-destroy'), [
            'ids' => [$actor->id, $user->id],
        ])
        ->assertRedirect();

    $this->assertModelExists($actor);
    $this->assertModelMissing($user);
});

test('a user can be edited', function () {
    $actor = User::factory()->create();
    $user = User::factory()->create();

    $this->actingAs($actor)
        ->put(route('users.update', $user), [
            'name' => 'Updated User',
            'username' => 'updated_user',
            'email' => 'updated@example.test',
        ])
        ->assertRedirect(route('users.index'));

    expect($user->refresh())
        ->name->toBe('Updated User')
        ->username->toBe('updated_user')
        ->email->toBe('updated@example.test');
});

test('a user verification status can be toggled', function () {
    $actor = User::factory()->create();
    $user = User::factory()->unverified()->create();

    $this->actingAs($actor)
        ->patch(route('users.toggle-verification', $user))
        ->assertRedirect();

    expect($user->refresh()->email_verified_at)->not->toBeNull();

    $this->actingAs($actor)
        ->patch(route('users.toggle-verification', $user))
        ->assertRedirect();

    expect($user->refresh()->email_verified_at)->toBeNull();
});
