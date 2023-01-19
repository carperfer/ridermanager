<?php

namespace App\Rules;

use App\Models\Status;

class OrderRules
{
    /**
     * @return string[]
     */
    public static function webRules(): array
    {
        return [
            'pickup_at'                  => 'required|date_format:Y-m-d H:i:s',
            'deliver_at'                 => 'required|date_format:Y-m-d H:i:s|after:pickup_at',
            'pickup_info.name'           => 'required|string',
            'pickup_info.phone'          => 'required|numeric',
            'pickup_info.address'        => 'required|string',
            'pickup_info.address_info'   => 'sometimes|string',
            'pickup_info.zip'            => 'required|string',
            'pickup_info.city'           => 'required|string',
            'pickup_info.lat'            => 'required|numeric',
            'pickup_info.lon'            => 'required|numeric',
            'delivery_info.name'         => 'required|string',
            'delivery_info.phone'        => 'required|numeric',
            'delivery_info.address'      => 'required|string',
            'delivery_info.address_info' => 'sometimes|string',
            'delivery_info.zip'          => 'required|string',
            'delivery_info.city'         => 'required|string',
            'delivery_info.lat'          => 'required|numeric',
            'delivery_info.lon'          => 'required|numeric',
            'total'                      => 'sometimes|required|integer',
            'is_already_paid'            => 'sometimes|required|boolean',
            'money_change'               => 'sometimes|required|integer',
            'customer_id'                => 'present',
            'company_id'                 => 'required|integer',
            'payment_type_id'            => 'sometimes|required|integer',
            'comments'                   => 'sometimes|string|max:500',
        ];
    }

    /**
     * @return string[]
     */
    public static function customerRules(): array
    {
        return [
            'pickup_at'                  => 'required|date_format:Y-m-d H:i:s',
            'deliver_at'                 => 'required|date_format:Y-m-d H:i:s|after:pickup_at',
            'delivery_info.name'         => 'required|string',
            'delivery_info.phone'        => 'required|numeric',
            'delivery_info.address'      => 'required|string',
            'delivery_info.address_info' => 'sometimes|string',
            'delivery_info.zip'          => 'required|string',
            'delivery_info.city'         => 'required|string',
            'delivery_info.lat'          => 'required|numeric',
            'delivery_info.lon'          => 'required|numeric',
            'total'                      => 'sometimes|required|integer',
            'is_already_paid'            => 'sometimes|required|boolean',
            'money_change'               => 'sometimes|required|integer',
            'comments'                   => 'sometimes|string|max:500',
            'customer_id'                => 'required|integer',
            'payment_type_id'            => 'sometimes|required|integer',
            'customer_external_id'       => 'required|uuid',
        ];
    }

    /**
     * @return string[]
     */
    public static function apiRules(): array
    {
        return [
            'number'                     => 'sometimes|required|string',
            'pickup_at'                  => 'required|date_format:Y-m-d H:i:s',
            'deliver_at'                 => 'required|date_format:Y-m-d H:i:s|after:pickup_at',
            'pickup_info.name'           => 'required|string',
            'pickup_info.phone'          => 'required|numeric',
            'pickup_info.address'        => 'required|string',
            'pickup_info.address_info'   => 'sometimes|string',
            'pickup_info.zip'            => 'required|string',
            'pickup_info.city'           => 'required|string',
            'pickup_info.lat'            => 'required|numeric',
            'pickup_info.lon'            => 'required|numeric',
            'delivery_info.name'         => 'required|string',
            'delivery_info.phone'        => 'required|numeric',
            'delivery_info.address'      => 'required|string',
            'delivery_info.address_info' => 'sometimes|string',
            'delivery_info.zip'          => 'required|string',
            'delivery_info.city'         => 'required|string',
            'delivery_info.lat'          => 'required|numeric',
            'delivery_info.lon'          => 'required|numeric',
            'total'                      => 'sometimes|required|integer',
            'payment_type_id'            => 'sometimes|required|integer|exists:payment_types,id',
            'is_already_paid'            => 'sometimes|required|boolean',
            'money_change'               => 'sometimes|required|integer',
            'comments'                   => 'sometimes|string|max:500',
            'external_id'                => 'required',
        ];
    }

    /**
     * @return string[]
     */
    public static function statusUpdateRules(): array
    {
        return [
            'status_id' => 'required|integer',
            'comments'  => 'present|max:500|required_if:status_id,' . Status::getStatusFromName(Status::CANCELED_STATUS),
        ];
    }

    /**
     * @return string[]
     */
    public static function filtersRules(): array
    {
        return [
            'company_id'     => 'required|integer',
            'pickup_after'   => 'sometimes|required|date_format:Y-m-d H:i:s',
            'deliver_before' => 'sometimes|required|date_format:Y-m-d H:i:s',
        ];
    }

    /**
     * @return string[]
     */
    public static function filterDates(): array
    {
        return [
            'pickup_after'   => 'sometimes|required|date_format:Y-m-d H:i:s',
            'deliver_before' => 'sometimes|required|date_format:Y-m-d H:i:s',
        ];
    }

    /**
     * @return string[]
     */
    public static function bulkDeleteRules(): array
    {
        return [
            'orders_id'  => 'required|array',
            'company_id' => 'required|integer',
        ];
    }

    public static function assignationUpdateRules()
    {
        return ['user_id' => 'present'];
    }

}
