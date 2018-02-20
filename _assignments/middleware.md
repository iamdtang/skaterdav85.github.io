---
layout: assignment
title: Middleware
date: 2018-02-19
---

This assignment will use Laravel and the [chinook SQLite database](http://www.sqlitetutorial.net/sqlite-sample-database/).

All Laravel assignments, labs, and class demos will build on the same installation.

## Maintenance Mode Middleware

You are going to create middleware that directs users to a maintenance mode page (that you create - have fun and be creative with it) with the URL `/maintenance`, if there is a record in the `settings` table with an `id` of `maintenance_mode` and its `value` set to 1. If that record's `value` is 0, don't modify the request. Name the middleware `MaintenanceMode`.

## Toggling Maintenance Mode Page

In the admin section, create a page at `/settings`. This page will have a form with one checkbox that will toggle the `settings` record with an `id` of `maintenance_mode`. You can use Eloquent or the Query Build for this. This page should be protected by authentication.

## Submission

Please push up your code including the database to GitHub to the same repository as last week (__itp405-laravel-assignments__). You should already have connected your GitHub repository to Heroku for automatic deployments. If you haven't, [follow these instructions](/tutorials/deploying-laravel-with-sqlite-to-heroku). Verify that your app has been deployed and it works on Heroku. Send an email to me and the TA with the repository URL and the URL to the live site on Heroku.
