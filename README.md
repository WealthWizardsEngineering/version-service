# Version Service

A simple service for storing information about the version history of deployed microservice.

## Build

```
make install lint unit-test component-test dependency-check
```

## Running

```
docker run -p 80 -e MONGODB_URL=mongodb://mongodb/version_service quay.io/wealthwizards/version-service
```

## Usage

Endpoints:

* GET, POST - /version-service/v1/version - the version records
* GET - /version-service/v1/environment - a list of "environment that have version records against them"
* GET - /version-service/v1/environment/[environment] - a list of applications and their versions recorded as of today's date
* GET - /version-service/v1/environment/[environment]?date=2018-02-24T14:37:38.613Z - a list of applications and their versions recorded as of the given date
* GET - /version-service/v1/environment/[environment]?product=[product] - a list of applications and their versions for the given product

Version object:

```
{
    "environment": "my-environment",
    "application_name": "my-application",
    "version": "0.1.1",
    "product": "my-product"
}
```
