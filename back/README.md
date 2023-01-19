# RiderManager Back-end

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![PHP Version](https://img.shields.io/badge/PHP-%5E8.0-blue)

## Instructions to set up the development environment

### Pre-requisites

- Docker, installed, configured, and running.

### Installation

1. Clone the file `.env.example` into a file named `.env` and fill out the missing variables with the correct values. Exclude the variables `APP_KEY` and `JWT_SECRET` as they will be auto-generated later. Please, contact the Tech team in order to get help about this.
2. Open a console and browse to the project's directory. Then, bring up the containers by running `docker-compose up -d`.
    - Note: The command will start all the containers specified in the file `docker-compose.yml`. To start only certain containers, check out the [Docker documentation](https://docs.docker.com/compose/).
    - Note 2: If you are working on Linux and your user does not belong to a group with permissions to execute Docker's commands, you may need to use `sudo`.
3. Connect the back-end container when they are up and running with the command `docker exec -it <container_name> /bin/bash`. You will find the container name in the file `docker-compose.yml` or in the output of the command `docker ps`.
4. Run the command `composer install` to install the dependencies in your project's directory.
5. Run the command `php artisan key:generate` to create a new application key that will be automatically stored in the file `.env` as value of the variable `APP_KEY`.
6. Run the command `php artisan jwt:secret` to create a new JWT encryption token that will be automatically stored in the file `.env` as value of the variable `JWT_SECRET`.

If you are working with a newly fresh installed database:
7. Within the back-end container, execute the necessary migration to create the database structure and populate some tabled with the initial needed data: `php artisan migrate`
    
Now, you have all the necessary to start working with the back-end in your development environment.

#### Other useful commands

- `php artisan db:seed` to execute the main seeders and populate the database with the initial needed data, such as roles, permissions, or statuses. This is included in the first migration, so it is not mandatory to execute manually when creating the environment.
- `php artisan migrate:rollback` to undo the last batch migrated.
- `php artisan db:wipe` to remove all the tables; it is useful in case you want to re-build the entire database.

## License
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

Written by Carlos Pérez Fernández <carlos@covermanager.com>
