<?php

namespace App\Http\Controllers;

use App\Http\Requests\BulkDestroyUsersRequest;
use App\Http\Requests\IndexUserRequest;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(IndexUserRequest $request): Response
    {
        $filters = $request->validated();
        $search = $request->string('search')->trim()->toString();
        $verification = $request->string('verification', 'all')->toString();
        $perPage = $request->integer('per_page', 10);

        $query = User::query()
            ->select(['id', 'name', 'username', 'email', 'email_verified_at', 'created_at']);

        $this->applyUserFilters($query, $search, $verification);

        $users = $query
            ->latest()
            ->paginate($perPage)
            ->withQueryString()
            ->through(fn (User $user): array => [
                'id' => $user->getKey(),
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->toJSON(),
                'created_at' => $user->created_at?->toJSON(),
            ]);

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $filters['search'] ?? '',
                'verification' => $verification,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $user->only(['id', 'name', 'username', 'email']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create');
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = new User([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => $validated['password'],
        ]);
        $user->email_verified_at = $validated['email_verified'] ? now() : null;
        $user->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User created.')]);

        return to_route('users.index');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update($request->validated());
        Inertia::flash('toast', ['type' => 'success', 'message' => __('User updated.')]);

        return to_route('users.index');
    }

    public function toggleVerification(User $user): RedirectResponse
    {
        $user->forceFill([
            'email_verified_at' => $user->email_verified_at ? null : now(),
        ])->save();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $user->email_verified_at
                ? __('User verified.')
                : __('User verification revoked.'),
        ]);

        return back();
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_if($user->is(auth()->user()), 422, __('You cannot delete your own account.'));

        $user->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('User deleted.')]);

        return back();
    }

    public function bulkDestroy(BulkDestroyUsersRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $query = User::query();

        if ($request->boolean('all')) {
            $this->applyUserFilters(
                $query,
                (string) ($validated['search'] ?? ''),
                (string) ($validated['verification'] ?? 'all'),
            );
        } else {
            $query->whereKey($validated['ids']);
        }

        $query
            ->whereKeyNot(auth()->id())
            ->delete();
        Inertia::flash('toast', ['type' => 'success', 'message' => __('Selected users deleted.')]);

        return back();
    }

    private function applyUserFilters(Builder $query, string $search, string $verification): void
    {
        $query->when($search, function (Builder $query, string $search): void {
            $query->where(function (Builder $query) use ($search): void {
                $query->whereLike('name', "%{$search}%", caseSensitive: false)
                    ->orWhereLike('email', "%{$search}%", caseSensitive: false)
                    ->orWhereLike('username', "%{$search}%", caseSensitive: false);
            });
        })
            ->when($verification === 'verified', fn (Builder $query) => $query->whereNotNull('email_verified_at'))
            ->when($verification === 'unverified', fn (Builder $query) => $query->whereNull('email_verified_at'));
    }
}
