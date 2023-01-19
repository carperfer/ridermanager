<?php

namespace App\Rules;

class CompanyRules
{
    /**
     * @return string[]
     */
    public static function rules(): array
    {
        return ['name' => 'required|string|max:255'];
    }

}
