<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Role extends BaseModel
{
    use HasFactory;

    const ADMIN_ROLE  = 'administrator';
    const DRIVER_ROLE = 'driver';

    public    $timestamps = false;
    protected $fillable   = ['name'];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class);
    }

}
