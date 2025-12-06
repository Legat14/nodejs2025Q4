# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager v.24 LTE.

## Downloading

```
git clone https://github.com/Legat14/nodejs2025Q4.git
```

## Installing NPM modules

```
npm install or yarn install
```

## Running application

```
npm start
```

## Environment

If you want to change the port number, you can copy the `.env.example` file, rename it to `.env`, and update the port value in it.

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

# ATTENTION, PLEASE!

If tests are failing with `TypeError: Cannot read properties of undefined (reading 'prototype')` or something alike, please delete node_modules folder and install dependencies again with `yarn install` command ([install yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable) if you don't have it).

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

## Docker

Install [https://www.docker.com/products/docker-desktop/](Docker Desktop) for your system and **start it before run app**

### Enter this command on the first run:

Build docker containers and connect

```
npm run docker:build
```

To start DB and app after containers were built run this command

```
npm run docker:up
```

Enter database

```
docker exec -it postgres_db psql -U {DB_USER} -d {DB_NAME}
```

Check containers in run

```
docker ps
```
