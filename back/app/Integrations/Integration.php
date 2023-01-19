<?php

namespace App\Integrations;

use App\Models\ApiClient;
use App\Models\Order;

interface Integration
{
    /**
     * @param \App\Models\ApiClient $apiClient
     */
    public function __construct(ApiClient $apiClient);

    /**
     * @param \App\Models\ApiClient $apiClient
     * @return string
     */
    public function getAuth(ApiClient $apiClient): string;

    /**
     * @param \App\Models\Order $order
     * @return void
     */
    public function updateStatus(Order $order);

    /**
     * @param \App\Models\Order $order
     * @param array             $location
     * @return void
     */
    public function updateDriverLocation(Order $order, array $location = []);

}
