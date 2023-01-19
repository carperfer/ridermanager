<?php

namespace App\Services;

use App\Models\Company;

class CompanyService
{
    /**
     * @param array $data
     * @return \App\Models\Company
     */
    public function create(array $data): Company
    {
        return new Company($data);
    }

    /**
     * @param \App\Models\Company $company
     * @param array               $data
     * @return \App\Models\Company
     */
    public function edit(Company $company, array $data): Company
    {
        // Add attributes from request data
        $company->fill($data);

        return $company;
    }

}
