<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Hash;
use Laravel\Lumen\Auth\Authorizable;

class ApiClient extends BaseModel implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory, SoftDeletes;

    protected $fillable = ['api_key'];
    protected $hidden   = ['token', 'company'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function integration()
    {
        return $this->belongsTo(Integration::class);
    }

    public function orders()
    {
        return $this->hasMany(OrderIntegration::class);
    }

    /**
     * Check the Auth token and retrieve the API Client or null if it is not valid, or it does not exist.
     *
     * @param $token
     * @return ApiClient|null
     */
    public function getClient($token): ?ApiClient
    {
        // Check if token is not null and is well-formed
        if ($token && str_contains($token, '::')) {
            // Split client id and token
            [$token, $clientId] = explode('::', $token);

            // Get API Client
            $client = $this::find($clientId);

            // Check hashed token
            if ($client && Hash::check($token, $client->token)) {
                // Return API Client model
                return $client;
            }
        }

        // Return null to not authenticate
        return null;
    }

}
