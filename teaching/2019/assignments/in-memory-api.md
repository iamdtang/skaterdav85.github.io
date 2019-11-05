---
layout: assignment
title: Testing React Components
---

For this assignment, you will extend the [in-memory API](https://github.com/itp404-fall-2019/in-memory-express-api) we built in class with new endpoints relating to comments.

Currently, our "database" looks like the following:

```js
const db = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      body: 'something here...'
    },
    {
      id: 2,
      title: 'Post 2',
      body: 'something else here...'
    }
  ]
};
```

## `POST /api/comments`

This endpoint will create a new comment for a post. For example, let's say we want to create a comment for the post with an `id` of 2. The request payload should look like the following:

```json
{
  "post": 2,
  "body": "The body of the comment..."
}
```

The response status code should be 200 with the following content:

```json
{
  "id": 1,
  "post": 2,
  "body": "The body of the comment..."
}
```

Assuming this is the first comment created in our "database", the `id` would be 1. This can just be an autoincrementing number.

## Validation on `POST /api/comments`

Add the following validation to the `POST /api/comments` endpoint:

### `post` is required

`post` must be present in the request payload. If it is missing, send a response with a 400 status code and the following content:

```json
{
  "errors": {
    "post": "post is required"
  }
}
```

### `post` must be valid

If the value in `post` doesn't match one of the post `id`s in our "database", respond with a 404 status code.

## `GET /api/posts/:id/comments`

This endpoint should return all the comments for the post with an id of `:id`. The response should be an array. If there are no comments for the post, return an empty array.

## `DELETE /api/comments/:id`

This endpoint should delete a comment from the post it belongs to. If the comment was successfully deleted, respond with a 204 status code. If the comment doesn't exist, respond with a 404 status code.

Note, you are welcome to change how `db` stores posts and comments in order to find the comment to delete more efficiently, but you don't have to.

## `PUT /api/comments/:id`

This endpoint should update a comment with an `id` of `:id`. The request payload should be of the structure:

```json
{
  "id": 1,
  "body": "Updated comment..."
}
```

If the update is successful, return a 204 status code. If the comment doesn't exist, return a 404 status code.

## Submission

[https://classroom.github.com/a/KT7XsdD6](https://classroom.github.com/a/KT7XsdD6)