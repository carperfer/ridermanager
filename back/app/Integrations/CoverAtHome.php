<?php

namespace App\Integrations;

use App\Models\ApiClient;
use App\Models\Order;
use App\Models\Status;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CoverAtHome implements Integration
{
    const INTEGRATION_ACCESS_TOKEN = 'integration:access_token:';
    const CANCEL_REASON_KEY  = 'rider_company_cancelled';

    public string  $grantType = 'client_credentials';
    public ?string $accessToken;
    public string    $clientId = 'rdm-integration';
    public ApiClient $apiClient;

    protected string $authEndpoint     = '/Auth/token';
    protected string $locationEndpoint = '/driver/DeliveryDriver/update_driver_location';
    protected string $statusEndpoint   = '/driver/DeliveryDriver/update_integration_driver';
    /**
     * Sort ID on RDM => Status ID on CAH
     *
     * @var array
     */
    protected array $statuses = [
        0  => 5,
        1  => 10,
        2  => 15,
        3  => 20,
        4  => 30,
        -2 => -20,
    ];

    /**
     * @throws \Illuminate\Http\Client\RequestException
     * @throws \Psr\SimpleCache\InvalidArgumentException
     */
    public function __construct(ApiClient $apiClient)
    {
        $this->apiClient = $apiClient;
        $this->accessToken = $this->getAuth($apiClient);
    }

    /**
     * @param \App\Models\ApiClient $apiClient
     * @return string
     * @throws \Illuminate\Http\Client\RequestException
     * @throws \Psr\SimpleCache\InvalidArgumentException
     */
    public function getAuth(ApiClient $apiClient): string
    {
        // Check whether the access token is on Redis
        if (null === $this->accessToken = $this->getAccessTokenFromRedis($apiClient->id)) {
            // Get access token from auth endpoint
            $response = Http::asForm()->post(
                $apiClient->integration->callback_url . $this->authEndpoint,
                [
                    'grant_type'    => $this->grantType,
                    'client_id'     => $this->clientId,
                    'client_secret' => $apiClient->api_key,
                ]
            );

            // Throw an exception if a client or server error occurred
            $response->throw();

            $this->accessToken = $response['access_token'];

            // Store in Redis
            Cache::store(get_cache_store())->put(self::INTEGRATION_ACCESS_TOKEN . $apiClient->id, $this->accessToken, $response['expires_in']);
        }

        return $this->accessToken;
    }

    /**
     * @param \App\Models\Order $order
     */
    public function updateStatus(Order $order)
    {
        try {
            // Define main body
            $body = [
                'id_order' => $order->integration->external_id,
                'status'   => $this->statuses[$order->status->sort],
            ];

            // Check if order was canceled and add reasons
            if ($order->status->name === Status::CANCELED_STATUS) {
                $body['cancellation'] = $this->getCancelationBody();
            }

            $response = Http::withToken($this->accessToken)->post($this->apiClient->integration->callback_url . $this->statusEndpoint, $body);

            // Throw an exception if a client or server error occurred
            $response->throw();
        } catch (\Throwable $exception) {
            Log::error($exception->getMessage());
        }
    }

    /**
     * @param \App\Models\Order $order
     * @param array             $location
     */
    public function updateDriverLocation(Order $order, array $location = [])
    {
        try {
            if (isset($location['lat']) && isset($location['lon'])) {
                $response = Http::withToken($this->accessToken)->post($this->apiClient->integration->callback_url . $this->locationEndpoint, [
                    'id_order' => $order->integration->external_id,
                    'driver'   => [
                        'latitude'  => $location['lat'],
                        'longitude' => $location['lon'],
                    ],
                ]);
                // Throw an exception if a client or server error occurred
                $response->throw();
            }
        } catch (\Throwable $exception) {
            Log::error($exception->getMessage());
        }
    }

    /**
     * @param int $id
     * @return mixed
     * @throws \Psr\SimpleCache\InvalidArgumentException
     */
    private function getAccessTokenFromRedis(int $id): mixed
    {
        return Cache::store(get_cache_store())->get(self::INTEGRATION_ACCESS_TOKEN . $id);
    }

    private function getCancelationBody()
    {
        return [
            'reason_key'   => self::CANCEL_REASON_KEY,
            'cancelled_by' => config('global.app_name'),
        ];
    }

}
