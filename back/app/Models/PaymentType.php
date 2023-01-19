<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class PaymentType extends BaseModel
{
    use HasFactory;

    const DEFAULT_VALUE = 'others';

    public static array $typeNames  = [
        'cash',
        'card',
        'others',
    ];
    public              $timestamps = false;

    protected $fillable = ['name'];

}
