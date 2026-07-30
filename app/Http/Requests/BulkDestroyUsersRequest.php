<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BulkDestroyUsersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'all' => ['sometimes', 'boolean'],
            'ids' => ['required_unless:all,true', 'array', 'min:1'],
            'ids.*' => [
                'integer',
                'distinct',
                Rule::exists('users', 'id'),
            ],
            'search' => ['nullable', 'string', 'max:100'],
            'verification' => ['nullable', Rule::in(['all', 'verified', 'unverified'])],
        ];
    }
}
