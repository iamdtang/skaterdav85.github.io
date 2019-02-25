---
layout: assignment
title: Node 2
---

Create the following endpoints in your Express application using the Sequelize ORM. Test out your endpoints using [Postman](https://www.getpostman.com/).

## DELETE /tracks/:id

This endpoint should delete a track by the `id` parameter. If the deletion is successful, respond with a 204 status code and an empty response body. The 204 status code stands for "No Content" and means that "the server has fulfilled the request but does not need to return an entity-body". [See a full list of HTTP status codes](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html). 

If the track is not found, return a response with a 404 status code. The response should be an object with a key `error` that has some message indicating that the track wasn't found.

## PATCH /tracks/:id

This endpoint should update a track by the `id` parameter. This endpoint should have the following validations:

* the name can't be empty
* milliseconds must be numeric
* unit price must be numeric

If the update fails validation, return a JSON response in the following format, where each object contains the attribute that failed validation and a user freindly error message.

```json
{
  "errors": [
    {
      "attribute": "name",
      "message": "..."
    }
  ]
}
```

If the track isn't found, return a response with a 404 status code. The response should be an object with a key `error` that has some message indicating that the track wasn't found.

For your `Track` model, alias the column names to their camelCased version. For example, the column `UnitPrice` should be `unitPrice` on your model. Also, alias your primary key `TrackId` to just `id`.

## Submission

* Deploy your app to Heroku. Verify that your app has been deployed and it works on Heroku.
* Send an email to me and the TA with the GitHub URL and the Heroku URL. Please use the subject line __ITP 405 Lab Submission - Node 2: ORM__.
