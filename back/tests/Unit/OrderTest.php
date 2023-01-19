<?php

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class OrderTest extends TestCase
{
    public array                      $data;
    public \App\Services\OrderService $orderService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->data = (new \Database\Factories\OrderFactory())->definition();
        $this->orderService = new \App\Services\OrderService();
    }

    public function testCreateSuccessNoCustomer()
    {
        $order = $this->orderService->create($this->data);
        $this->assertInstanceOf(\App\Models\Order::class, $order);
    }

    public function testCreateSuccessCustomer()
    {
        $customer = \App\Models\Customer::factory()->make();
        $order = $this->orderService->create($this->data, $customer);

        $this->assertInstanceOf(\App\Models\Order::class, $order);
        $this->assertNotEquals($this->data['pickup_info'], $order->pickup_info);
        $this->assertEquals($customer->getAttributes(), $order->pickup_info);
    }

    public function testCreateNoOptionals()
    {
        // Remove items
        $data = $this->data;
        unset($data['number']);
        unset($data['total']);
        unset($data['comments']);
        unset($data['is_already_paid']);
        unset($data['money_change']);

        $order = $this->orderService->create($data);
        $this->assertInstanceOf(\App\Models\Order::class, $order);
        $this->assertIsString($order->number);
        $this->assertEquals(0, $order->total);
        $this->assertEquals('', $order->comments);
        $this->assertFalse($order->is_already_paid);
        $this->assertEquals(0, $order->money_change);
    }

    public function testEditSuccess()
    {
        $order = \App\Models\Order::factory()->make();
        $oldOrder = clone $order;
        $order = $this->orderService->edit($order, $this->data);

        $this->assertInstanceOf(\App\Models\Order::class, $order);
        $this->assertNotEquals($order, $oldOrder);
    }

    public function testEditNoOptionals()
    {
        $order = \App\Models\Order::factory()->make();
        $oldOrder = clone $order;
        // Remove items
        $data = $this->data;
        unset($data['number']);
        unset($data['total']);
        unset($data['comments']);
        unset($data['is_already_paid']);
        unset($data['money_change']);

        $order = $this->orderService->edit($order, $data);
        $this->assertEquals($oldOrder->number, $order->number);
        $this->assertEquals($oldOrder->total, $order->total);
        $this->assertEquals($oldOrder->comments, $order->comments);
        $this->assertEquals($oldOrder->is_already_paid, $order->is_already_paid);
        $this->assertEquals($oldOrder->money_change, $order->money_change);
    }

    public function testAddRelationshipsSuccess()
    {
        $order = \App\Models\Order::factory()->make();
        $status = \App\Models\Status::factory()->make();
        $company = \App\Models\Company::factory()->make();
        $paymentType = \App\Models\PaymentType::factory()->make();
        $customer = \App\Models\Customer::factory()->make();

        $this->orderService->addRelationships($order, $status, $company, $paymentType, $customer);
        $this->assertInstanceOf(\App\Models\Order::class, $order);
        $this->assertInstanceOf(\App\Models\Status::class, $order->status);
        $this->assertInstanceOf(\App\Models\Company::class, $order->company);
        $this->assertInstanceOf(\App\Models\PaymentType::class, $order->paymentType);
        $this->assertInstanceOf(\App\Models\Customer::class, $order->customer);
    }

    public function testAddRelationshipsEmpty()
    {
        $order = \App\Models\Order::factory()->make();

        $this->orderService->addRelationships($order);
        $this->assertNull($order->status);
        $this->assertNull($order->company);
        $this->assertNull($order->paymentType);
        $this->assertNull($order->customer);
    }

    public function testCreateHistoryNewSuccess()
    {
        $order = \App\Models\Order::factory()->make();
        $user = \App\Models\User::factory()->make();
        $history = $this->orderService->createHistory($order, $user);

        $this->assertInstanceOf(\App\Models\OrderHistory::class, $history);
        $this->assertIsString($history->comments);
    }

    public function testCreateHistoryUpdatedSuccess()
    {
        $order = \App\Models\Order::factory()->make();
        $history = \App\Models\OrderHistory::factory()->make();
        $user = \App\Models\User::factory()->make();
        $comments = $history->comments;
        // Make statuses equal
        $order->status_id = $history->status_id;

        $this->orderService->createHistory($order, $user, $history, $comments);

        $this->assertInstanceOf(\App\Models\OrderHistory::class, $history);
        $this->assertGreaterThan(0, strlen($history->comments));
    }

}
