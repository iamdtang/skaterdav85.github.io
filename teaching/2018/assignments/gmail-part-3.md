---
layout: assignment
title: Testing Gmail
date: 2018-10-30
---

In this assignment, you will be working off of the same repo as [the last assignment](/teaching/2018/assignments/gmail-part-2), where you will be writing tests for your Gmail application.

## Testing the `truncate-text` Helper

Write tests with the following descriptions:

* the text is truncated to the number of characters passed in
* the text is not truncated when the length is too short

## Testing the `StarButton` Component

Write tests with the following descriptions:

* the star is filled when `starred` is `true`
* the star is empty when `starred` is `false`
* `onClick` is called with the new starred value when clicked
  * Use `assert.step` and `assert.verifySteps`

## Application Tests

Write tests with the following descriptions:

* the inbox displays starred and unstarred emails
  * Seed Mirage with 2 starred emails and 3 unstarred emails. Verify that 2 emails were rendered in the starred section and 3 were rendered in the unstarred section.
* viewing a single email
  * Verify that all of the email attributes were rendered.
* deleting a single email
  * Seed Mirage with 2 unstarred emails. Verify that when the trash icon is clicked for either of the emails, the unstarred list contains 1 email and the current URL is `/`.
* creating an email
  * Seed Mirage with 0 emails. Verify that when a user fills out the new email form and clicks the submit button, the number of emails in the unstarred section is 1.
  * Verify that the current URL is `/`.
  * Verify that all of the data was sent to the server by inspecting Mirage's `server.db.emails[0]`.

## Travis CI

* Setup your repo to have Travis CI integration and add the Travis CI badge to your repo's README.md.

## Submission

Push your code up to the same repo, which should be called __itp404-gmail__. Send an email with the GitHub repo URL to the TA and myself.
