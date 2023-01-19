<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderHistory extends BaseModel
{
    use HasFactory;

    protected $table = 'orders_history';
    protected $fillable = ['order_id', 'status_id', 'comments'];
    protected $hidden = ['id'];

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
