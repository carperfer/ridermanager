<?php

namespace App\Models;

use App\Observers\OrderObserver;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends BaseModel
{
    use SoftDeletes, HasFactory, OrderObserver;

    protected $fillable = [
        'number',
        'pickup_at',
        'pickup_info',
        'deliver_at',
        'delivery_info',
        'total',
        'comments',
        'is_already_paid',
        'money_change',
    ];

    protected $hidden = [
        'user',
        'customer',
    ];

    protected $casts = [
        'pickup_info'   => 'array',
        'delivery_info' => 'array',
    ];

    protected $filterable = [
        'pickup_after',
        'deliver_before',
        'status_id',
        'customer_id',
        'user_id',
    ];

    public function history()
    {
        return $this->hasMany(OrderHistory::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function paymentType()
    {
        return $this->belongsTo(PaymentType::class);
    }

    public function integration()
    {
        return $this->hasOne(OrderIntegration::class);
    }

    /**
     * @param \App\Models\Company $company
     * @param array               $filters
     * @return array
     */
    public static function getWithFilters(Company $company, array $filters = []): array
    {
        $orders = $company->orders();

        foreach ($filters as $filter => $value) {
            // Check the filter is defined in filterable attribute
            if (in_array($filter, (new static())->filterable)) {
                // Special filters
                if ($filter === 'pickup_after') {
                    $orders = $orders->where('pickup_at', '>=', $value);
                    continue;
                }
                if ($filter === 'deliver_before') {
                    $orders = $orders->where('deliver_at', '<', $value);
                    continue;
                }
                // Certain treatment for status
                if ($filter === 'status_id') {
                    $statuses = explode(',', $value);
                    $orders = $orders->whereIn($filter, $statuses);
                    continue;
                }
                // Other attributes
                $orders = $orders->where($filter, '=', $value);
            }
        }

        $orders = $orders->get();

        return $orders->toArray();
    }

}
