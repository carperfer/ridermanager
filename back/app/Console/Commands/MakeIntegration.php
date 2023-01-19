<?php

namespace App\Console\Commands;

use Illuminate\Console\GeneratorCommand;

class MakeIntegration extends GeneratorCommand
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'make:integration';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new integration class';

    /**
     * The type of class being generated.
     *
     * @var string
     */
    protected $type = 'Integration class';

    /**
     * Get the stub file for the generator.
     *
     * @return string
     */
    protected function getStub(): string
    {
        return __DIR__ . '/../stubs/integration.stub';
    }

    /**
     * Determine if the class already exists.
     *
     * @param string $rawName
     * @return bool
     */
    protected function alreadyExists($rawName): bool
    {
        $name = class_basename(str_replace('\\', '/', $rawName));

        $path = "{$this->laravel['path']}/../app/Integrations/{$name}.php";

        return file_exists($path);
    }

    /**
     * Replace the namespace for the given stub.
     *
     * @param string $stub
     * @param string $name
     * @return $this
     */
    protected function replaceNamespace(&$stub, $name): static
    {
        $name = class_basename(str_replace('\\', '/', $name));

        $stub = str_replace('{IntegrationName}', $name, $stub);

        return $this;
    }

    /**
     * Get the destination class path.
     *
     * @param string $name
     * @return string
     */
    protected function getPath($name): string
    {
        $name = class_basename(str_replace('\\', '/', $name));

        return "{$this->laravel['path']}/../app/Integrations/{$name}.php";
    }

}
