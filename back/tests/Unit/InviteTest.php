<?php

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class InviteTest extends TestCase
{
    public \Faker\Generator            $faker;
    public \App\Services\InviteService $inviteService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->faker = \Faker\Factory::create();
        $this->inviteService = new \App\Services\InviteService();
    }

    public function testCreateSuccess()
    {
        $data = [
            'email'   => $this->faker->freeEmail,
        ];
        $invite = $this->inviteService->create($data);

        $this->assertInstanceOf(\App\Models\Invite::class, $invite);
        $this->assertEquals($data['email'], $invite->email);
        $this->assertTrue(\Illuminate\Support\Str::isUuid($invite->token));
    }

}
