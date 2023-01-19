<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Status extends BaseModel
{
    use HasFactory;

    const DEFAULT_VALUE   = 'in-queue';
    const ACCEPTED_STATUS = 'accepted';
    const PICKUP_STATUS = 'picking-up';
    const DELIVERING_STATUS = 'delivering';
    const COMPLETED_STATUS = 'completed';
    const CANCELED_STATUS = 'canceled';
    const TROUBLED_STATUS = 'troubled';
    const SUCCESS_STATUSES           = [
        'in-queue',
        'accepted',
        'picking-up',
        'delivering',
        'completed',
    ];
    const ERROR_STATUSES             = [
        'canceled',
        'troubled',
    ];

    public    $timestamps = false;
    protected $fillable   = ['name', 'sort'];

    public static function getStatusFromName(string $name)
    {
        $status = static::getByField('name', $name);

        return $status->id;
    }

}
