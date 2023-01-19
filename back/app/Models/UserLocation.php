<?php

namespace App\Models;

use App\Observers\LocationObserver;

class UserLocation extends BaseModel
{
    use LocationObserver;

    protected $table    = 'users_location';
    protected $fillable = ['user_id', 'lat', 'lon'];
    protected $hidden   = ['id', 'user_id'];

    protected $casts = [
        'lat' => 'float',
        'lon' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
