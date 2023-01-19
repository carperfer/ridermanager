<?php

namespace App\Models;

class Permission extends BaseModel
{
    const PERMISSIONS = [
        'manage-users',
        'manage-invites',
        'manage-company',
        'manage-customers',
        'create-orders',
        'edit-orders',
        'update-status',
        'remove-orders',
        'see-history',
    ];
    public    $timestamps = false;
    protected $fillable   = ['name'];

}
