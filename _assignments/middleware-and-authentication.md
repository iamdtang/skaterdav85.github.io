---
layout: assignment
title: Middleware and Authentication
date: 2018-02-19
---

This assignment will use Laravel and the [chinook SQLite database](http://www.sqlitetutorial.net/sqlite-sample-database/).

All Laravel assignments, labs, and class demos will build on the same installation.

## The Home Page

Modify the `/` route so that it directs users to `/genres` instead of `/login`.

## Maintenance Mode Middleware

You are going to create middleware that redirects users to a maintenance mode page (that you create - have fun and be creative with it) with the URL `/maintenance` if there is a record in the `settings` table with an `id` of `maintenance_mode` and its `value` is 1. If that record's `value` is 0, users should not be redirected to that page. Name the middleware `MaintenanceMode`. This middleware should only apply to public routes (the ones without the `protected` middleware), but exclude the following:

```php
Route::get('/login', 'LoginController@index');
Route::post('/login', 'LoginController@login');
Route::get('/logout', 'LoginController@logout');
```

This is so that certain users can login even if the site is in maintenance mode.

## Toggling Maintenance Mode

Create a `/settings` page that is protected by authentication. This page will have a form with one checkbox that will toggle the `settings` record with an `id` of `maintenance_mode`. You can use Eloquent or the Query Builder for this.

Add a navigation link for this page, and make sure it only shows up if the user is logged in.

## Submission

Please push up your code including the database to GitHub to the same repository as last week (__itp405-laravel-assignments__). You should already have connected your GitHub repository to Heroku for automatic deployments. If you haven't, [follow these instructions](/tutorials/deploying-laravel-with-sqlite-to-heroku). Verify that your app has been deployed and it works on Heroku. Send an email to me and the TA with the repository URL and the URL to the live site on Heroku.
