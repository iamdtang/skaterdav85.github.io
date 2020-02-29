---
layout: assignment
title: Laravel 4
---

## Create a `configurations` Table

In your database, create a table named `configurations` with columns `id` (primary key), `name` (string), and `value` (string). Create this table with [a migration](https://laravel.com/docs/6.x/migrations#generating-migrations).

Insert a record into this table with `name` set to "maintenance-mode" and `value` set to 0. You can do this a few different ways:

1. [Interact with your SQLite database directly](/tutorials/sqlite)
1. [Interact with your SQLite database with Tinker](https://laravel.com/docs/6.x/artisan#tinker). Currently there is a bug with PHP 7.3 (maybe 7.2 too) where Tinker doesn't work. A workaround is to set `pcre.jit=0` in `php.ini`. If you installed PHP on a Mac via [https://php-osx.liip.ch/](https://php-osx.liip.ch/), the `php.ini` is located in `/usr/local/php5/lib/php.ini`.
1. Create a dummy route where you insert the record, similar to what we were doing with `/eloquent` when we learning Eloquent.

## Maintenance Mode Middleware

You are going to create middleware that redirects users to a maintenance mode page (that you design yourself) at the URL path `/maintenance` if there is a record in the `configurations` table with a `name` of "maintenance-mode" and its `value` is 1. If that record's `value` is 0, users should not be redirected to that page. Name the middleware class `MaintenanceMode`. This middleware should only apply to unauthenticated routes, except for the following so that users can login and logout even if the site is in maintenance mode. To create middleware, use `php artisan make:middleware MaintenanceMode`.

```php
Route::get('/login', 'LoginController@index');
Route::post('/login', 'LoginController@login');
Route::get('/logout', 'LoginController@logout');
```

## A Settings Page

Create a settings page at `/admin/settings`. This page will have a form with one checkbox that will toggle the `configurations` record with a `name` of `maintenance-mode`.

Make sure that there is a registered account with an email of `admin@usc.edu` and a password of `laravel`.

Next, create a migration that adds a `role` column to the `users` table. 

For the `admin@usc.edu` user, set the `role` to `admin`.

Next, create an `admin` middleware that is attached to all admin routes. Only authenticated users with a role of admin should be allowed to visit the `/admin/settings` page. Otherwise, redirect to Laravel's 404 page using [`abort`](https://laravel.com/docs/6.x/errors#http-exceptions).

Lastly, if a user is authenticated and is an admin, show a link to the Settings page in the navigation.

## Submission

Make a commit with the commit message "Assignment 5 - Laravel 4 completed". Push your code up to GitHub and verify that it was deployed to Heroku.
