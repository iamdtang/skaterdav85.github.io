---
layout: assignment
title: Testing and Continuous Integration
---

Revisit your [Sequelize ORM lab](/teaching/2019/labs/sequelize-orm), write some tests for it, and hook it up with Travis CI.

## API Tests

Write API tests for the `PATCH /tracks/:id` endpoint.

### Test 1: Track Does Not Exist

Assert that a 404 status code is returned when a track isn't found.

### Test 2: Updating a Track Successfully

When updating a track succeeds, assert that a 200 status code is returned and the track in the response body contains the updated attributes.

### Test 3: Validation Errors

Create a test with a request body of:

```json
{"name": "", "milliseconds": "a", "unitPrice": "b"}
```

Your test should assert that a 422 status code is returned.

Also write assertion(s) verifying that the API responds with the correct validation error messages. The `name` attribute should fail because it is empty. The `milliseconds` and `unitPrice` attributes should fail because they aren't numeric.

## Unit Tests

Write unit tests for the `Track` model that assert the following:

### Test 1: Milliseconds isn't numeric

Write a test that asserts validation fails when milliseconds isn't numeric.

### Test 2: Milliseconds is numeric

Write a test that asserts validation passes when milliseconds is numeric.

## Travis CI

Enable Travis CI for your repository. Create a new branch and make a pull request (PR) to the master branch. You should see Travis tests running for your PR. All of your tests should pass in order to get full credit.

Lastly, in your PR, create a `README.md` file if you don't already have one and add the Travis CI status badge to it.

## Submission

Send an email to the TA and myself with the subject line __Assignment 5: Testing and Continuous Integration__ containing the link to your PR.
