<?php

namespace App\Rules;

class InviteRules
{

    /**
     * @return string[]
     */
    public static function rules(): array
    {
        return [
            'email'      => 'required|string|email',
            'role_id'    => 'required|integer',
            'company_id' => 'required|integer',
        ];
    }

    /**
     * @return string[]
     */
    public static function tokenRules(): array
    {
        return [
            'token'      => 'required|uuid',
            'password'   => 'required|string|min:6|confirmed',
            'email'      => 'sometimes|required|string|email',
            'first_name' => 'sometimes|required|string|max:255',
            'last_name'  => 'sometimes|required|string|max:255',
            'phone'      => 'sometimes|required|string',
        ];
    }

    /**
     * @return string[]
     */
    public static function filtersRules(): array
    {
        return ['company_id' => 'required|integer'];
    }

}
