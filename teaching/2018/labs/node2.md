---
layout: assignment
title: Node 2
date: 2018-03-19
---

## DELETE /tracks/:id

Create the endpoint `DELETE /tracks/:id` in your Express application. This endpoint should delete a track using the Bookshelf ORM by the `id` parameter in the URL. If the deleting is successful, respond with a 204 status code and an empty response body. The 204 status code stands for "No Content" and means that "the server has fulfilled the request but does not need to return an entity-body". [See a full list of HTTP status codes](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html). If the track is not found, return a response with a 404 status code. The response should be an object with a key `error` that has some message indicating that the track wasn't found.

Test out your endpoint using the Chrome extension [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en). This extension is useful for testing POST, PATCH, PUT, and DELETE requests.
