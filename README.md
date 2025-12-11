# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager v.24 LTE.
- Docker desktop - [Download & Install Docker desktop](https://www.docker.com/products/docker-desktop/).

## Downloading

```
git clone https://github.com/Legat14/nodejs2025Q4.git
```

## Docker

Start the Docker desktop before running the app

## Environment

Create `.env` file with next content

```
PORT=4000

CRYPT_SALT=10
JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

# Database configuration
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=home_library
NODE_ENV=development
```

## Start app

### Build docker container

The server will start automatically after the container is built

```
npm run docker:build
```

### Start the Docker container if it has already been built

```
npm run docker:up
```

## Migrations

After container is up and the server is running the first time, generate and apply migrations

### Generate and run migrations

```
npm run migration:generate-and-run
```

### Reset all settings

If something is wrong, please enter this command and start from building of containers

```
npm run docker:down:v
```

To check if containers built and up correctly, enter

```
docker ps
```

and you should see two docker containers: with DB and app

To check if migrations applied correctly, enter

```
docker exec -it postgres_db psql -U {DB_USER} -d {DB_NAME}
```

then `\dt` to list the tables. You should see all entity tables.

enter `\q` to exit

To check volumes

```
docker volume ls
```

## To check containers restart

```
docker exec rest_service_app kill 1
docker exec postgres_db kill 1
docker ps
```

You'll see the both containers running

## To check user-defined bridge

```
docker network ls
```

You'll see mycustomhandmadenet bridge in the list

Use the full name of the bridge in the next command

```
docker network inspect nodejs2025q4_mycustomhandmadenet
```

And you'll see both containers, connected to the bridge

[Docker image on Docker Hub](https://hub.docker.com/r/legat14/rest-service)

```
docker pull legat14/rest-service
```

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

To run all test with authorization

```
npm run test:auth
```

To run only specific test suite with authorization

```
npm run test:auth -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

### API

- /user - GET, POST
- /user/:id - GET, PUT, DELETE
- /artist - GET, POST
- /artist/:id - GET, PUT, DELETE
- /track - GET, POST
- /track/:id - GET, PUT, DELETE
- /album - GET, POST
- /album/:id - GET, PUT, DELETE
- /favs - GET
- /favs/track/:id - POST, DELETE
- /favs/album/:id - POST, DELETE
- /favs/artist/:id - POST, DELETE
