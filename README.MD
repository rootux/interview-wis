# Wisdo exercise
## Run
`docker-compose up -d`
`docker-compose run api npm run seed` To seed the database with data
Then the server would be up on http://localhost:3000

## Alternative local debug
```bash
npm i -g nodemon
npm i
docker-compose up -d db
npm run start:dev
```

Dockerfile - uses multi-stage build - has dev and production envs

hooks - allows any update to post / create to trigger an email if content is in watchlist_words
(Optimizing watchlist_words can be done if we load this into memory)

## DB Schema
![Db Schema](docs/db_diagram.png)


## Comments
1. This is my first production like Typescript project. I may error on the side of types and where to put declarations -
I wanted to try typescript as recommended but this may not be the most well-structured typescript
2. I've used post reactions with reaction type to support different reaction in the future (Love, Cry,...)
3. Given more time, I would use an "input validation framework" instead of validating data.
4. Some race condition that might happen - if a user scrolls the system, and now we are on the 3 hours window - 
trying to fetch next would result inaccurate data.
5. For production - I'll probably use redis for caching instead of node-cache (CacheService)
6. I've seperated UserService.create and UserService.createWithRole to keep things secure - so it would be clear what does what

## Alternative Designs
1. An alternative to `sequelize` would be [prisma](https://www.prisma.io/) which is a raising star -
I don't have enough experience with it - given more time - I might consider it
