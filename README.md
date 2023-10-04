# tracker

Repository for tracking app.

## To use

```sh
$ yarn install
$ yarn start
```

And visit <http://localhost:3000/>.

## Using DB

It's gonna run following list of commands automatically for you, this is for the explanation for you to understand what individual steps are performed

- `yarn` - regenerates prisma types in your node_modules based on the the current scheme.prisma file (needs to be done every time this file changes)
- `yarn db:push` - creates db tables based on the current scheme.prisma file (needs to be run whenever this file changes)
- `yarn db:seed` - populates db tables with predefined data from the ./prisma/data folder
