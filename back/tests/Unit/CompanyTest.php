<?php

class CompanyTest extends TestCase
{
    public \Faker\Generator             $faker;
    public \App\Services\CompanyService $companyService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->faker = \Faker\Factory::create();
        $this->companyService = new \App\Services\CompanyService();
    }

    public function testCreateSuccess()
    {
        $data = [
            'name' => $this->faker->company
        ];
        $company = $this->companyService->create($data);

        $this->assertInstanceOf(\App\Models\Company::class, $company);
        $this->assertIsString($company->name);
    }

    public function testEditSuccess()
    {
        $data = [
            'name' => $this->faker->company
        ];
        $company = \App\Models\Company::factory()->make();
        $oldCompany = clone $company;
        $company = $this->companyService->edit($company, $data);

        $this->assertNotEquals($company->name, $oldCompany->name);
    }

}
