---
layout: assignment
title: Laravel 1
---

This assignment will use Laravel and the [chinook SQLite database](http://www.sqlitetutorial.net/sqlite-sample-database/).

All Laravel assignments, labs, and class demos will build on the same installation. Start this assignment from the same installation we did in class.

## The Genres Page

Create a page with the route `/genres` that displays all genres from the `genres` table. Define a route that maps to a controller called `GenresController`.

Each genre should be an anchor that links to `/tracks?genre=GENRE_NAME`, where `GENRE_NAME` is replaced with each genre, i.e. Rock, Blues, Reggae, etc.

## The Tracks by Genre Page

Next, create a page with the route `/tracks`. This page should display all tracks for the `genre` query string parameter. For each track, display the following information:

* track name
* album title
* artist name
* price

The `/tracks` route should map to a controller called `TracksController`.

To access the `genre` query string parameter value, use the `query()` method off of the request object. Check out the "Retrieving Input From The Query String" documentation to [see an example](https://laravel.com/docs/5.7/requests#retrieving-input).

## Other Requirements

* Use [Laravel's Blade templating](https://laravel.com/docs/5.7/blade).
* All database queries should use [Laravel's query builder](https://laravel.com/docs/5.7/queries)
* All routes should map to a controller

## Tips

* You can create a controller using the artisan command: `php artisan make:controller GenresController`.

## Submission

* Please push up your code including the database to GitHub to a repository named EXACTLY __itp405-laravel__. You will be using this repository for all Laravel assignments, labs, and class lectures.
* Deploy your app to Heroku by [following these instructions](/tutorials/deploying-laravel-with-sqlite-to-heroku). Verify that your app has been deployed and it works on Heroku.
* Send an email to me and the TA with the repository URL and the URL to the live site on Heroku.
