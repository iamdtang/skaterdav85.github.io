---
layout: assignment
title: Node 1 - Express and Knex
date: 2018-03-05
---

## GET /api/artists

This endpoint should return all artists. Map the results returned from the SQLite database so that the response looks like the following:

```js
[
  { "id": "1", "name": "AC/DC" },
  { "id": "2", "name": "Accept" },
  // ...
]
```

You find the following links helpful:

* [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

## GET /api/artists?filter=a

Modify `GET /api/artists` so that it accepts a query string parameter called `filter`. If this query string param is present in the request, only return the artists where the name contains that value. This should be case insensitive. If the query string param isn't present in the request, return all artists.

You find the following links helpful:

* [Accessing query params in Express](https://expressjs.com/en/4x/api.html#req.query)
* ["like" in Knex](http://knexjs.org/#Builder-where)

## Submission

Push up your code including the SQLite database to a GitHub repository named (__itp405-express__). You should already have connected your GitHub repository to Heroku for automatic deployments in class. Verify that your app has been deployed and it works on Heroku. Send an email to me and the TA with the repository URL and the URL to the live site on Heroku.
