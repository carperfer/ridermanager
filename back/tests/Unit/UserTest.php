<?php

use Illuminate\Support\Str;
use Laravel\Lumen\Testing\DatabaseMigrations;

/**
 * Class UserTest
 */
class UserTest extends TestCase
{

    public array                     $data;
    public \App\Services\UserService $userService;
    private \Faker\Generator         $faker;

    protected function setUp(): void
    {
        parent::setUp();
        $this->data = (new \Database\Factories\UserFactory())->definition();
        $this->userService = new \App\Services\UserService();
        $this->faker = \Faker\Factory::create();
    }

    /**
     * @test
     */
    public function testCreateUser()
    {
        $user = $this->userService->create($this->data);
        $this->assertInstanceOf(\App\Models\User::class, $user);
        $this->assertIsString($user->email);
        $this->assertIsString($user->password);
        $this->assertIsString($user->first_name);
        $this->assertIsString($user->last_name);
        $this->assertIsString($user->phone);
    }

    /**
     * @test
     */
    public function testEditUser()
    {
        $user = \App\Models\User::factory()->make();
        $oldUser = clone $user;
        $user = $this->userService->edit($user, $this->data);
        $this->assertInstanceOf(\App\Models\User::class, $user);
        $this->assertNotEquals($oldUser->email, $user->email);
        $this->assertNotEquals($oldUser->first_name, $user->first_name);
        $this->assertNotEquals($oldUser->last_name, $user->last_name);
        $this->assertNotEquals($oldUser->phone, $user->phone);
        $this->assertEquals($oldUser->password, $user->password);
        $this->assertEquals($oldUser->remember_token, $user->remember_token);
    }

    /**
     * @test
     */
    public function testAddPasswordReset()
    {
        $pwdReset = $this->userService->addPasswordReset();
        $this->assertInstanceOf(\App\Models\PasswordReset::class, $pwdReset);
        $this->assertTrue(\Illuminate\Support\Str::isUuid($pwdReset->token));
    }

    /**
     * @test
     */
    public function testEditCredentials()
    {
        $user = \App\Models\User::factory()->make();
        $oldUser = clone $user;
        $data = [
            'password' => 'new_secret',
        ];

        $user = $this->userService->editCredentials($user, $data);
        $this->assertInstanceOf(\App\Models\User::class, $user);
        $this->assertNotEquals($oldUser->password, $user->password);
        $this->assertNotEquals($oldUser->remember_token, $user->remember_token);
    }

    /**
     * @test
     */
    public function testIssueAccessToken()
    {
        $token = Str::random();
        $response = $this->userService->issueAccessToken($token);

        $this->assertIsArray($response);
        $this->assertArrayHasKey('access_token', $response);
        $this->assertArrayHasKey('token_type', $response);
        $this->assertArrayHasKey('expires_in', $response);
        $this->assertEquals($token, $response['access_token']);
        $this->assertIsString($response['token_type']);
        $this->assertIsInt($response['expires_in']);
    }

    public function testCreateLocation()
    {
        $user = \App\Models\User::factory()->make();
        $data = [
            'lat' => $this->faker->latitude,
            'lon' => $this->faker->longitude,
        ];
        $location = $this->userService->createLocation($user, $data);

        $this->assertInstanceOf(\App\Models\UserLocation::class, $location);
        $this->assertEquals($user->id, $location->user_id);
        $this->assertEquals($data['lat'], $location->lat);
        $this->assertEquals($data['lon'], $location->lon);
    }

    public function testEditLocation()
    {
        $location = new \App\Models\UserLocation([
                                                     'user_id' => rand(1, 10),
                                                     'lat'     => $this->faker->latitude,
                                                     'lon'     => $this->faker->longitude,
                                                 ]);
        $oldLocation = clone $location;
        $data = [
            'lat' => $this->faker->latitude,
            'lon' => $this->faker->longitude,
        ];
        $location = $this->userService->editLocation($location, $data);

        $this->assertInstanceOf(\App\Models\UserLocation::class, $location);
        $this->assertEquals($oldLocation->user_id, $location->user_id);
        $this->assertNotEquals($oldLocation->lat, $location->lat);
        $this->assertNotEquals($oldLocation->lon, $location->lon);
    }

}
