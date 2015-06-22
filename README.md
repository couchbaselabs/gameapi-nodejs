# Game Server API for NodeJS and Couchbase

## Requirements

* NodeJS
* NPM
* Couchbase Server

## Instructions

Clone this repository to your desktop or any preferred location.

Using the command prompt (Windows) or Terminal (Mac / Linux) navigate to the cloned directory and run:

```sh
npm install
```

This will install all the required application dependencies such as the Couchbase SDK and Express framework.

Open **config.json** at the root of the project and validate that the default global configuration settings look accurate.

When ready to test the application, using the command prompt (Windows) or Terminal (Mac / Linux), run:

```
node app.js
```

This will make the application accessible at http://localhost:3000

## API Endpoints

### POST /api/user

Create a new user account on the server

#### Headers

None

#### Parameters

| parameter | description                        |
|-----------|------------------------------------|
| username  | username to access the account     |
| password  | password for accessing the account |
| name      | account owners name                |

### GET /api/user/me

Get user information about the currently signed in user

#### Headers

| header        | description  |
|---------------|--------------|
| authorization | bearer token |

#### Parameters

None

### GET /api/auth

Trade user credentials for a session id to be used with further requests against protected endpoints

#### Headers

None

#### Parameters

| parameter | description                        |
|-----------|------------------------------------|
| username  | username to access the account     |
| password  | password for accessing the account |

## Project Structure

| file / folder   | parent | description                                         |
|-----------------|--------|-----------------------------------------------------|
| routes          | root   | all application endpoint routes will end up in here |
| routes.js       | routes | all endpoint routes                                 |
| models          | root   | all database classes will end up in here            |
| accountmodel.js | models | class for crud operations on user accounts          |
| sessionmodel.js | models | class for crud operations on user sessions          |
| app.js          | root   | server initialization code                          |
| config.json     | root   | server and database configuration information       |

## Resources

[Couchbase NodeJS API Reference](http://docs.couchbase.com/sdk-api/couchbase-node-client-2.0.8/)
