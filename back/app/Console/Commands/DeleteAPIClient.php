<?php

namespace App\Console\Commands;

use App\Models\ApiClient;
use App\Models\Company;
use Illuminate\Console\Command;

class DeleteAPIClient extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'client:delete {id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete an existing API Client and revoke access';

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
        $client = ApiClient::find($this->argument('id'));
        if (!$client) {
            $this->error('There is not such API Client');
            return;
        }
        $company = Company::find($client->company_id);
        if (!$company) {
            $this->error('There is not an active company associated');
            return;
        }

        if ($this->confirm('You are about to remove the client ID"' . $client->id . '" associated to company "' . $company->name . '"')) {
            $client->delete();
            $this->info('Client "' . $client->id . '" has been deleted');
        }
    }

}
