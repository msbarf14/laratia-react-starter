<?php

use Illuminate\Support\Facades\Route;

test('redirects root to login', function () {
    $response = $this->get('/');

    $response->assertRedirect(route('login'));
});

test('domain routes are not registered', function () {
    expect(Route::has('assets.index'))->toBeFalse()
        ->and(Route::has('asset-loans.index'))->toBeFalse()
        ->and(Route::has('damage-reports.index'))->toBeFalse()
        ->and(Route::has('master-data.users.index'))->toBeFalse()
        ->and(Route::has('admin.settings.edit'))->toBeFalse();
});
