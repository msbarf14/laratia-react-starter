<?php

namespace App\Console\Commands;

use App\Concerns\PasswordValidationRules;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

#[Signature('make:user')]
#[Description('Create a new user')]
class MakeUserCommand extends Command
{
    use PasswordValidationRules;

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $input = [
            'name' => trim((string) $this->ask('Name')),
            'email' => trim((string) $this->ask('Email')),
            'username' => Str::lower(trim((string) $this->ask('Username'))),
            'password' => (string) $this->secret('Password'),
            'password_confirmation' => (string) $this->secret('Confirm password'),
        ];

        $validator = Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'username' => ['required', 'string', 'max:50', 'alpha_dash:ascii', Rule::unique(User::class)],
            'password' => $this->passwordRules(),
        ]);

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $validated = $validator->validated();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['username'],
            'password' => $validated['password'],
        ]);

        $this->info("User {$user->username} ({$user->email}) created successfully.");

        return self::SUCCESS;
    }
}
