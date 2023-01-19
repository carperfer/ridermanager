<?php

namespace App\Services;

use App\Models\PasswordReset;
use App\Models\User;
use App\Models\UserLocation;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserService
{
    /**
     * @param array $data
     * @return \App\Models\User
     */
    public function create(array $data): User
    {
        // Create user model
        $user = new User($data);
        $user->password = Hash::make($data['password']);
        $user->remember_token = Str::random(100);

        return $user;
    }

    /**
     * @param \App\Models\User $user
     * @param array            $data
     * @return \App\Models\User
     */
    public function edit(User $user, array $data): User
    {
        // Backup user model
        $oldUser = clone $user;

        // Add attributes from request data
        $user->fill($data);
        $user->expo_token = isset($data['expo_token']) ? $data['expo_token'] : $oldUser->expo_token;

        return $user;
    }

    /**
     * @return \App\Models\PasswordReset
     */
    public function addPasswordReset(): PasswordReset
    {
        return new PasswordReset(['token' => (string)Str::uuid()]);
    }

    /**
     * @param \App\Models\User $user
     * @param array            $data
     * @return \App\Models\User
     */
    public function editCredentials(User $user, array $data): User
    {
        // Update password and remember token
        $user->password = Hash::make($data['password']);
        $user->remember_token = Str::random(100);

        return $user;
    }

    /**
     * @param string $token
     * @return string[]
     */
    public function issueAccessToken(string $token): array
    {
        return [
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => time() + (config('auth.access_token_ttl') * 60), // 3 months
        ];
    }

    /**
     * @param \App\Models\User $user
     * @param array            $data
     * @return \App\Models\UserLocation
     */
    public function createLocation(User $user, array $data): UserLocation
    {
        return new UserLocation([
                                    'user_id' => $user->id,
                                    'lat'     => $data['lat'],
                                    'lon'     => $data['lon'],
                                ]);
    }

    /**
     * @param \App\Models\UserLocation $location
     * @param array                    $data
     * @return \App\Models\UserLocation
     */
    public function editLocation(UserLocation $location, array $data): UserLocation
    {
        $location->fill([
                            'lat' => $data['lat'],
                            'lon' => $data['lon'],
                        ]);

        return $location;
    }

}
