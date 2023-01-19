<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
$router->post('/register', 'AuthController@register');
$router->post('/login', 'AuthController@login');
$router->post('/forgot', 'AuthController@forgot');
$router->get('/reset/{token}', 'AuthController@viewReset');
$router->post('/reset', 'AuthController@reset');

$router->get('/invites/{token}', 'InviteController@show');
$router->post('users', 'UserController@store');

$router->get('/customers/{uuid}', 'CustomerController@show');
$router->post('orders/customer', 'OrderController@storeCustomer');
$router->get('/customers/{uuid}/orders', 'OrderController@getCustomer');

// Payment Types
$router->get('/payment-types', 'PaymentTypesController@index');

$router->group(
    ['middleware' => 'auth'],
    function () use ($router) {
        // Users
        $router->get('/users/logged', 'UserController@getLoggedUser');
        $router->put('/users/credentials', 'UserController@updateCredentials');
        $router->post('/users/location', 'UserController@storeLocation');
        $router->delete('/users/location', 'UserController@destroyLocation');
        $router->put('/users/{id}', 'UserController@update');
        $router->get('/users', 'UserController@index');

        $router->put('/users', 'UserController@update');
        $router->post('/users/bulk-delete', 'UserController@bulkDestroy');
        $router->delete('/users/{id}', 'UserController@destroy');
        $router->get('/users/{id}/orders', 'OrderController@getUserOrders');

        // Companies
        $router->get('/companies/{id}', 'CompanyController@show');
        $router->post('/companies', 'CompanyController@store');
        $router->put('/companies/{id}', 'CompanyController@update');
        $router->delete('/companies/{id}', 'CompanyController@destroy');

        // Customers
        $router->get('/customers', 'CustomerController@index');
        $router->post('/customers', 'CustomerController@store');
        $router->put('/customers/{id}', 'CustomerController@update');
        $router->delete('/customers/{id}', 'CustomerController@destroy');
        $router->post('/customers/bulk-delete', 'CustomerController@bulkDestroy');

        // Invites
        $router->get('/invites', 'InviteController@index');
        $router->post('/invites', 'InviteController@store');
        $router->delete('/invites/{id}', 'InviteController@destroy');

        // Orders */
        $router->get('/orders', 'OrderController@index');
        $router->get('/users/orders', 'OrderController@getOrdersAssigned');
        $router->get('/orders/{id}', 'OrderController@show');
        $router->post('/orders', 'OrderController@store');
        $router->put('/orders/{id}', 'OrderController@update');
        $router->post('/orders/bulk-delete', 'OrderController@bulkDestroy');
        $router->delete('/orders/{id}', 'OrderController@destroy');
        $router->post('/orders/{id}/status', 'OrderController@updateStatus');
        $router->post('/orders/{id}/assign', 'OrderController@updateAssignation');

        // Roles */
        $router->get('/roles', 'RoleController@index');

        // Statuses */
        $router->get('/statuses', 'StatusController@index');

        // Auth */
        $router->post('/logout', 'AuthController@logout');
    }
);

$router->group(
    ['prefix' => 'v1', 'middleware' => 'auth:api'],
    function () use ($router) {
        // Orders
        $router->get('/orders', 'OrderController@getOrders');
        $router->get('/orders/{id}', 'OrderController@showOrder');
        $router->post('/orders', 'OrderController@handleOrder');
        $router->delete('/orders/{id}', 'OrderController@cancelOrder');
    }
);
