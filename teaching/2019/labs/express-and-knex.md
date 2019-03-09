---
layout: assignment
title: Express and Knex
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

You might find the following link helpful:

* [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

## GET /api/artists?filter=a

Modify `GET /api/artists` so that it accepts a query string parameter called `filter`. If this query string param is present in the request, only return the artists where the name contains that value. This should be case insensitive. If the query string param isn't present in the request, return all artists.

You might find the following links helpful:

* [Accessing query params in Express](https://expressjs.com/en/4x/api.html#req.query)
* ["like" in Knex](http://knexjs.org/#Builder-where)

## Submission

* Deploy your app to Heroku. Verify that your app has been deployed and it works on Heroku.
* Send an email to me and the TA with the GitHub URL and the Heroku URL. Please use the subject line __ITP 405 Lab Submission - Node 1: Express and Knex__.
