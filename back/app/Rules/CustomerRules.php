<?php

namespace App\Rules;

class CustomerRules
{
    /**
     * @return array
     */
    public static function rules(): array
    {
        return [
            'name'         => 'required|string|max:255',
            'address'      => 'required|string|max:255',
            'address_info' => 'sometimes|string|max:255',
            'zip'          => 'required|string|max:100',
            'city'         => 'required|string|max:100',
            'phone'        => 'required|string|max:20',
            'lat'          => 'required|numeric',
            'lon'          => 'required|numeric',
            'company_id'   => 'required|integer',
        ];
    }

    /**
     * @return string[]
     */
    public static function updateRules(): array
    {
        return [
            'name'         => 'sometimes|required|string|max:255',
            'address'      => 'sometimes|required|string|max:255',
            'address_info' => 'sometimes|string|max:255',
            'zip'          => 'sometimes|required|string|max:100',
            'city'         => 'sometimes|required|string|max:100',
            'phone'        => 'sometimes|required|string|max:20',
            'lat'          => 'sometimes|required|numeric',
            'lon'          => 'sometimes|required|numeric',
        ];
    }

    /**
     * @return string[]
     */
    public static function bulkDeleteRules(): array
    {
        return [
            'customers_id' => 'required|array',
            'company_id'   => 'required|integer',
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
