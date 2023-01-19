<?php

namespace App\Providers;

use App\Models\ApiClient;
use App\Models\Company;
use App\Policies\PermissionPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Boot the authentication services for the application.
     *
     * @return void
     */
    public function boot()
    {
        // Here you may define how you wish users to be authenticated for your Lumen
        // application. The callback which receives the incoming request instance
        // should return either a User instance or null. You're free to obtain
        // the User instance via an API token or any other method necessary.

        Gate::policy(Company::class, PermissionPolicy::class);

        $this->app['auth']->viaRequest(
            'token',
            function ($request) {
                $client = new ApiClient();
                return $client->getClient($request->header('x-api-key'));
            }
        );
    }

}
