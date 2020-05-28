# API Documentation

## Authentication

Authentication is achieved by using JWT tokens. A token is created by calling
the approriate login api endpoint (see below). The token should be embedded
inside the "Authorization" header of every http request like so:

```http
Authorization: Bearer <token>
```

The token will contain a claim detailing its login name, as well as any roles
the user is in.

### PUT /auth/user

Creates a new user with given login and password
Returns 200 on success, else see error code.

Example json payload:

```json
{
    "login": "test_user",
    "password": "password_2019"
}
```

### POST /auth

Attempts to login a user using its password.
Returns a JWT token to be used in authentication on success.

Example json payload:

```json
{
    "login": "test_user",
    "password": "password_2019"
}
```

Example response if successful:

```json
{
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2dpbiI6InRlc3RfdXNlciIsImV4cCI6MTUxNjIzOTAyMiwicm9sZSI6IlJFUE9SVEVSIn0.VjtwCsj_pxL3qZrEXpikwJZyR7_WPrMKAaxPWRxK-ok"
}
```

## Employee

Example json Employee:

```json
{
    "id": 1,
    "firstName": "Testnamn",
    "lastName": "Testefternamn",
    "cardUid": 180000
}
```

### GET /employee

Returns an array containing all employees.

### GET /employee/{id}

Returns the Employee with id `id`

### PUT /employee

Creates a new Employee and returns the newly created Employee

Example json payload:

```json
{
    "firstName": "Testnamn",
    "lastName": "Testefternamn",
    "cardUid": 180000
}
```

## EsdCheck

Example json EsdCheck:

```json
{
    "id": 1,

    // employeeId refers to the Employee who performed the check
    "employeeId": 2,
    "passed": true,

    // Note that date is a unix epoch timestamp given in seconds
    "date": 1570449960.396
}
```

### GET /esdcheck

Returns an array of all EsdChecks

### GET /esdcheck/{id}

Returns the EsdCheck with id `id`

### GET /esdcheck/by_employee/{employee_id}

Returns an array of all EsdChecks belonging to Employee with id `id`

### PUT /esdcheck

Creates a new EsdCheck and returns the newly created EsdCheck

Example json payload:

```json
{
    "employeeId": 2,
    "passed": true,
}
```
