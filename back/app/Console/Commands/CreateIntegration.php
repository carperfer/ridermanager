<?php

namespace App\Console\Commands;

use App\Models\Integration;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class CreateIntegration extends Command
{
    public ?string $integrationName = null;
    public ?string $callbackUrl     = null;

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'integration:create {--class}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new service to integrate with';

    /**
     * Create a new command instance.
     *
     * @return void
     * @throws \Exception
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return void
     * @throws \Exception
     */
    public function handle()
    {
        $this->integrationName = $this->promptAttr('name');
        $this->checkName();
        $this->checkClass();
        $this->callbackUrl = $this->promptAttr('callback_url');

        // Info
        $this->info('You are about to create the integration:');
        $this->info('Integration name: ' . $this->integrationName);
        $this->info('Callback URL: ' . $this->callbackUrl);

        // Ask for confirmation and create
        if ($this->confirm('Are you sure?')) {
            $this->createIntegration();
            $this->createClassIfNeeded();
            $this->info('Integration created successfully!');
        }
    }

    /**
     * Ask for attributes.
     * @param $attr
     * @return string
     * @throws \Exception
     */
    private function promptAttr($attr): string
    {
        do {
            $value = $this->ask($attr);
        } while (!$this->isValidInput($value));

        return $value;
    }

    /**
     * Check whether the input is valid.
     * @param string|null $input
     * @return bool|false
     */
    private function isValidInput(?string $input): bool
    {
        if (!$input) {
            $this->warn('Name must contain a valid string!');
            return false;
        }

        return true;
    }

    /**
     * Check whether there is already an integration with such name and ask again if so.
     * @throws \Exception
     */
    private function checkName()
    {
        while (Integration::where('name', '=', $this->integrationName)->exists()) {
            $this->warn('There is already an integration with this name!');
            $this->integrationName = $this->promptAttr('name');
        }
    }

    /**
     * Check whether the class exists in namespace Integrations and warn if it does not.
     */
    private function checkClass()
    {
        $path = $this->laravel['app']->basePath() . '/app/Integrations/' . $this->integrationName . '.php';
        if (!file_exists($path) && !$this->option('class')) {
            $this->warn('There is no Integration class with this name, you must create it manually with artisan, or add the option --class to this command!');
        }
    }

    /**
     * Create the Integration class if option is included in command.
     */
    private function createClassIfNeeded()
    {
        if ($this->option('class')) {
            Artisan::call('make:integration ' . $this->integrationName);
        }
    }

    /**
     * Create the integration in database.
     */
    private function createIntegration()
    {
        Integration::create(['name' => $this->integrationName, 'callback_url' => $this->callbackUrl]);
    }

}
