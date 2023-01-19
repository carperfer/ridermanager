<?php

return [
    'app_debug'     => env('APP_DEBUG', false),
    'app_name'      => env('APP_NAME', 'RiderManager'),
    'app_url'       => env('APP_URL', 'https://app.ridermanager.com'),
    'cache_store'   => env('CACHE_DRIVER', 'redis'),
    'expo_push_url' => env('EXPO_URL_PUSH', 'https://exp.host/--/api/v2/push/send'),
    'realtime'      => [
        'host'  => env('NODE_REALTIME_HOST', ''),
        'port'  => env('NODE_REALTIME_PORT', 4000),
        'token' => env('NODE_REALTIME_TOKEN', ''),
    ],
    'web_url'       => env('WEB_URL', 'http://ridermanager.com'),
];
