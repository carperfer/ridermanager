<?php

namespace App\Rules;

class UserRules
{
    /**
     * @return array
     */
    public static function createRules(): array
    {
        return [
            'email'      => 'required|string|email|max:255|unique:users,email',
            'password'   => 'required|string|min:6|max:255|confirmed',
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'phone'      => 'required|string',
            'expo_token' => 'sometimes|required|string|regex:/ExponentPushToken\[(.+)\]/',
            'role_id'    => 'sometimes|required|integer',
        ];
    }

    /**
     * @return array
     */
    public static function editRules(): array
    {
        return [
            'email'      => 'sometimes|required|string|email|max:255',
            'first_name' => 'sometimes|required|string|max:255',
            'last_name'  => 'sometimes|required|string|max:255',
            'phone'      => 'sometimes|required|string',
            'expo_token' => 'sometimes|required|string|regex:/ExponentPushToken\[(.+)\]/',
            'role_id'    => 'sometimes|required|integer',
        ];
    }

    /**
     * @return string[]
     */
    public static function forgotPwdRules(): array
    {
        return ['email' => 'required|string|email'];
    }

    /**
     * @return string[]
     */
    public static function resetPwdRules(): array
    {
        return [
            'token'    => 'required|uuid',
            'password' => 'required|string|min:6|confirmed',
        ];
    }

    /**
     * @return string[]
     */
    public static function loginRules(): array
    {
        return [
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ];
    }

    /**
     * @return string[]
     */
    public static function updatePwdRules(): array
    {
        return [
            'current_password' => 'required|string|password',
            'password'         => 'required|string|min:6|max:255|confirmed|different:current_password',
        ];
    }

    /**
     * @return string[]
     */
    public static function bulkDeleteRules(): array
    {
        return [
            'users_id'   => 'required|array',
            'company_id' => 'required|integer',
        ];
    }

    /**
     * @return string[]
     */
    public static function locationRules(): array
    {
        return [
            'lat' => 'required|numeric',
            'lon' => 'required|numeric',
        ];
    }

    /**
     * @return string[]
     */
    public static function filtersRules(): array
    {
        return [
            'company_id' => 'required|integer',
            'email'      => 'sometimes|required|string|email|max:255',
            'first_name' => 'sometimes|required|string|max:255',
            'last_name'  => 'sometimes|required|string|max:255',
        ];
    }

    /**
     * @return string[]
     */
    public static function companyIdRules(): array
    {
        return ['company_id' => 'required|integer'];
    }

}
