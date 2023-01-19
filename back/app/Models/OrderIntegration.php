<?php

namespace App\Models;

class OrderIntegration extends BaseModel
{
    protected $table      = 'orders_integrations';
    public    $timestamps = false;
    protected $fillable   = ['api_client_id', 'external_id'];

    public function client()
    {
        return $this->belongsTo(ApiClient::class, 'api_client_id');
    }
}
