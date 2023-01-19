<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends BaseModel
{
    use SoftDeletes, HasFactory;

    protected $fillable = ['name', 'address', 'address_info', 'city', 'zip', 'phone', 'lat', 'lon'];

    protected $casts = [
        'lat' => 'float',
        'lon' => 'float',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

}
