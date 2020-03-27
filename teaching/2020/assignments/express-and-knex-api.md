---
layout: assignment
title: Express and Knex API
---

For this assignment, build the following API endpoints with Express and Knex. The responses for each endpoint should match the example structures _exactly_. The JSON keys should be the same. The only thing that will vary is the data.

## GET /api/artists

This endpoint should return all artists sorted by the artist name (A-Z). Map the results returned from the database so that the response looks like the following:

```js
[
  { "id": "1", "name": "AC/DC" },
  { "id": "2", "name": "Accept" },
  // ...
]
```

You might find [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) helpful.

## GET /api/artists?filter=a

Modify `GET /api/artists` so that it accepts a query string parameter called `filter`. If this query string param is present in the request, only return the artists where the name contains that value. This should be case insensitive and also sorted by the artist name (A-Z). If the query string param isn't present in the request, return all artists.

You might find the following links helpful:

* [Accessing query params in Express](https://expressjs.com/en/4x/api.html#req.query)
* ["like" in Knex](http://knexjs.org/#Builder-where)

## `GET /api/artists/:id`

This endpoint should return the artist with an `ArtistId` of `:id` and the albums for that artist.

```js
{
  "artist": {
    "id": 1,
    "name": "..."
  },
  "albums": [
    {
      "id": "...",
      "title": "..."
    }
    // ...
  ]
}
```

If the artist isn't found, return a 404 response with an empty response body.

## Submission

[https://classroom.github.com/a/kCx1WINc](https://classroom.github.com/a/kCx1WINc)

Next, deploy your API to Heroku. Follow the same steps you've done in the past to deploy to Heroku. The only thing you will need to do is add `scripts.start` to your `package.json`:

```json
{
  "scripts": {
    "start": "node index.js"
  }
}
```

With the above code, you can run `npm start` from the command line, and it will run `node index.js`. Heroku will run `npm start` when it sees a `package.json` file. If your file isn't `index.js`, either change it to `index.js` or change the command.

Lastly, create a README.md file with links to all of your endpoints.