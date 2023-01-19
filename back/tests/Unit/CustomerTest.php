<?php

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class CustomerTest extends TestCase
{
    public \Faker\Generator              $faker;
    public \App\Services\CustomerService $customerService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->faker = \Faker\Factory::create();
        $this->customerService = new \App\Services\CustomerService();
    }

    public function testCreateSuccess()
    {
        $data = [
            'name'         => $this->faker->company,
            'address'      => $this->faker->streetAddress,
            'address_info' => $this->faker->secondaryAddress,
            'city'         => $this->faker->city,
            'zip'          => $this->faker->postcode,
            'phone'        => $this->faker->phoneNumber,
            'lat'          => $this->faker->latitude,
            'lon'          => $this->faker->longitude,
        ];
        $customer = $this->customerService->create($data);

        $this->assertInstanceOf(\App\Models\Customer::class, $customer);
        $this->assertTrue(\Illuminate\Support\Str::isUuid($customer->external_id));
        $this->goAssertFieldsEqual($customer, $data);
    }

    public function testEditSuccess()
    {
        $customer = \App\Models\Customer::factory()->make();
        $data = [
            'name'         => $this->faker->company,
            'address'      => $this->faker->streetAddress,
            'address_info' => $this->faker->secondaryAddress,
            'city'         => $this->faker->city,
            'zip'          => $this->faker->postcode,
            'phone'        => $this->faker->phoneNumber,
            'lat'          => $this->faker->latitude,
            'lon'          => $this->faker->longitude,
        ];
        $oldCustomer = clone $customer;

        $customer = $this->customerService->edit($customer, $data);
        $this->assertInstanceOf(\App\Models\Customer::class, $customer);
        $this->assertNotEquals($oldCustomer->name, $customer->name);
        $this->assertNotEquals($oldCustomer->address, $customer->address);
        $this->assertNotEquals($oldCustomer->address_info, $customer->address_info);
        $this->assertNotEquals($oldCustomer->city, $customer->city);
        $this->assertNotEquals($oldCustomer->zip, $customer->zip);
        $this->assertNotEquals($oldCustomer->phone, $customer->phone);
        $this->assertNotEquals($oldCustomer->lat, $customer->lat);
        $this->assertNotEquals($oldCustomer->lon, $customer->lon);
        $this->goAssertFieldsEqual($customer, $data);
    }

    private function goAssertFieldsEqual(\App\Models\Customer $customer, array $data)
    {
        $this->assertEquals($data['name'], $customer->name);
        $this->assertEquals($data['address'], $customer->address);
        $this->assertEquals($data['address_info'], $customer->address_info);
        $this->assertEquals($data['city'], $customer->city);
        $this->assertEquals($data['zip'], $customer->zip);
        $this->assertEquals($data['phone'], $customer->phone);
        $this->assertEquals($data['lat'], $customer->lat);
        $this->assertEquals($data['lon'], $customer->lon);
    }

}
