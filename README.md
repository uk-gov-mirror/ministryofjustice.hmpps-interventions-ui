# HMPPS Interventions UI

## Quickstart

### Requirements

- nvm (optional)
- Node.js >= 14
- npm >= 7.5
- Docker

### Initial setup

```
docker-compose pull
(nvm use)
npm install
```

You'll also need to add the following line to your `/etc/hosts` file:

```
127.0.0.1 hmpps-auth
```

### Running the app

```
docker-compose up -d
npm run start:dev
```

Navigate to `http://localhost:3000` and log in:

- To log in as a service provider user, use HMPPS Auth dev credentials e.g. `TEST_INTERVENTIONS_SP_1 / password123456` (and, this user has an email address of `test.interventions.sp.1@digital.justice.gov.uk` if you want to assign a referral to them)
- To log in as a probation practitioner user, use [Community API dev credentials](https://github.com/ministryofjustice/community-api/blob/main/src/main/resources/schema.ldif) e.g. `bernard.beaks/secret`.

If you need a service user’s CRN in local development, you can use anything from `CRN11` through to `CRN30`.

### How to use the local services

Sometimes you might find it useful to be able to view or change the data held in the local databases.

#### Interventions service

The interventions service comes already seeded with some referrals.

If you want to connect to the interventions service database, run

```
psql -h localhost -d interventions -U postgres
```

and enter a password of `password`. From there you can for example execute `\dt` to see all the tables, and run whatever SQL query you want.

#### HMPPS Auth

To connect to the local HMPPS Auth database, visit http://localhost:8090/auth/h2-console and enter a JDBC URL of `jdbc:h2:mem:authdb`, with empty username and password, then click Connect.

### Mocking out the interventions service locally

In local development mode, you might want to selectively mock out some calls to the
interventions service. For example, for endpoints that have not yet been built.

You can do this by configuring mocks in [`mocks.ts`](mocks.ts).

### Unit Test

`npm run test`

### Lint

`npm run lint`

### Integration Test

The integration tests require a different docker-compose stack and a different application configuration. Run each of the following commands in its own shell.

`docker-compose -f docker-compose-test.yml up`

`npm run start:test`

`npm run int-test(-ui)`

### Building a static page (designers)

To view the existing static pages, and for more instructions about how to edit them, go to `http://localhost:3000/static-pages`. If you get asked to log in when you try to go to this page, then you might need to re-enter this URL after logging in.

## Dependencies

- hmpps-auth - for authentication
- redis - session store and token caching
