# HMPPS Interventions UI

## Quickstart 

### Requirements 

- nvm (optional)
- Node.js >= 14
- npm >= 6
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

- To log in as a service provider user, use HMPPS Auth dev credentials e.g. `AUTH_ADM/password123456`
- To log in as a probation practitioner user, use [Community API dev credentials](https://github.com/ministryofjustice/community-api/blob/main/src/main/resources/schema.ldif) e.g. `bernard.beaks/secret`.

### Mocking out the interventions service

In development mode, you might want to selectively mock out some calls to the
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
