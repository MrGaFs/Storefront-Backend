# Udacity StoreFront Backend

This is the backend for the Udacity StoreFront application.

The database schema and the api endpoints are described in the [REQUERMENTS.md](REQUIREMENTS.md) file.

## Running instructions

### Installing dependencies

To run the backend, you will need to install the dependencies:

to install dependencies:

```bash
yarn 
```

### setting up the database

this project uses postgres database on docker container.

* To run database in the docker container:

```bash
docker-compose -f docker-compose.yml up
```

* connect to the database:

```bash
psql -h 127.0.0.1 postgres
```

* create the Project database:

```sql
CREATE DATABASE store_front;
```

* create Testing database:

```sql
CREATE DATABASE store_front_test;
```

* to make the database looks like the schema in the migration file:

```bash
yarn global add db-migrate
db-migrate up
```

### Setting up env variables

you must make an `.env` file in the root of the project providing the following information.

```env
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=store_front
POSTGRES_TEST_DB=store_front_test
POSTGRES_USER=testuser
POSTGRES_PASSWORD=testpassword
BCRYPT_PASSWORD=testPassword
SALT_ROUNDS=10
JWT_SECRET=testPassword
ROOT_USERNAME=root
ROOT_PASSWORD=root
ENV=dev
```

## Statring the backend

to run the backend:

```bash
yarn watch
```

### Running ports

The server will start on port 3000.

### EndPoints

all endpoints are described in the [REQUIREMENTS.md](REQUIREMENTS.md) file.

## Authentication

tokens are generated using the [JWT](https://jwt.io/) library.

to provide authentication to the backend you must path the token to the header of the request as:

 ``` json
 {
 "Authorization": "Bearer <token>"
 }
 ```

and to get your token you must use the login endpoint as described in the [REQUIREMENTS.md](REQUIREMENTS.md) file.

## Testing instructions

to test the backend:

```bash
yarn test
```
