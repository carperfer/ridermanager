<?php

namespace App\Console\Commands;

use App\Models\ApiClient;
use App\Models\Company;
use App\Models\Integration;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CreateAPIClient extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'client:create';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new API Client with a unique API Token';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        // Ask for company
        $companyId = $this->ask('Company ID');
        if (!$companyId || !is_numeric($companyId)) {
            $this->error('ID must contain a valid number!');
            return;
        }
        $company = Company::find((int)$companyId);
        if (!$company) {
            $this->error('Company does not exist!');
            return;
        }

        // Ask for integration
        $integrations = Integration::all();
        $integrationName = $this->choice('Choose integration service', $integrations->pluck('name')->toArray());
        $integration = $integrations->where('name', '=', $integrationName)->first();

        // Ask for API key
        $apiKey = $this->ask('API Key (leave blank if not necessary)');

        $this->info('You are about to create the API Client:');
        $this->info('Company: ' . $company->name . ' (' . $company->id . ')');
        $this->info('Integration: ' . $integration->name);
        $this->info('API Key: ' . $apiKey);

        if ($this->confirm('Are you sure?')) {
            // Create API Client
            $client = new ApiClient(['api_key' => $apiKey]);
            $client->company()->associate($company);
            $client->integration()->associate($integration);

            /// Create API Token
            $token = Str::random(32);
            $client->token = Hash::make($token);
            $client->save();

            // Output
            $this->info('API TOKEN:');
            $this->line($token . '::' . $client->id, 'bg=green');
            $this->warn('Copy and save this token as it will not be recoverable from the database!');
        }
    }

}
