---
layout: assignment
title: Laravel 1
---

This assignment will use Laravel and the [chinook SQLite database](http://www.sqlitetutorial.net/sqlite-sample-database/).

All Laravel assignments, labs, and class demos will build on the same installation. Start this assignment from the same installation we did in class.

## Listing Playlists

Create a page at `/playlists` that displays all playlists from the `playlists` table.

Each playlist should be an anchor that links to `/playlists/{id}`, where `{id}` is replaced with the ID of each playlist.

When a user clicks on a playlist link, they should be taken to a page that displays all tracks for that `playlist`. Display the following information for each track:

* Track name
* Album title
* Artist name
* Media type name
* Genre name

Display the name of the playlist at the top of the page.

Display the total number of tracks in the playlist on the playlist page.

If a playlist doesn't have any tracks, display "No tracks found.".

If there is no playlist with the ID in the URL, display "Playlist not found".

## Page Layout

* Add a link to the playlists page to the navigation
* All pages should contain the full HTML skeleton
* The playlists page should have a document title (the `title` tag) of "Playlists"
* A playlist page should have a document title in the format of "Playlists: NAME" where NAME is replaced with the name of the playlist

## Other Requirements

* Use Laravel's Blade templating
* All database queries should use Laravel's Query Builder
* All routes should map to a controller

## Tips

* You can create a controller using the artisan command: `php artisan make:controller PlaylistsController`.

## Deploy to Heroku

[Deploy your Laravel app to Heroku](/tutorials/deploying-laravel-with-sqlite-to-heroku) and verify that it works. Create a `README.md` Add your Heroku link to the top of the app's `README.md`.

## Submission

[https://classroom.github.com/a/vofdisIa](https://classroom.github.com/a/vofdisIa)

