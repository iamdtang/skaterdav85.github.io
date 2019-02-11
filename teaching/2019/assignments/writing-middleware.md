---
layout: assignment
title: Writing Middleware
---

This assignment will build off the authentication demo we do in class, so you will want to use that code base.

## Create a `configurations` Table

In your database, create a table named `configurations` with columns for `id`, `name` (text), and `value` (text). See [this page](/tutorials/sqlite) for how to create tables in SQLite.

Insert a records into this table `name` set to "maintenance" and `value` set to "off".

## The Home Page

Modify the `/` route so that it directs users to `/genres`.

## Maintenance Mode Middleware

You are going to create middleware that redirects users to a maintenance mode page at the path `/maintenance` if there is a record in the `configurations` table with a `name` of "maintenance" and its `value` is "on". If that record's `value` is "off", users should not be redirected to that page. Name the middleware `MaintenanceMode`. This middleware should only apply to public routes (the ones without the `protected` middleware), but exclude the following so that certain users can login even if the site is in maintenance mode.

```php
Route::get('/login', 'LoginController@index');
Route::post('/login', 'LoginController@login');
Route::get('/logout', 'LoginController@logout');
```

## Toggling Maintenance Mode

Create a `/settings` page that is protected by authentication. This page will have a form with one checkbox that will toggle the `configurations` record with a `name` of `maintenance`.

## Submission

* Please push up your code to your repository __itp405-laravel__.
* Deploy your app to Heroku. Verify that your app has been deployed and it works on Heroku.
* Send an email to me and the TA with the repository URL and the URL to the live site on Heroku. Please use the subject line __ITP 405 Assignment Submission - Writing Middleware__.