---
layout: assignment
title: Laravel 2
---

This assignment will use Laravel and the [chinook SQLite database](http://www.sqlitetutorial.net/sqlite-sample-database/).

This assignment will build on the same installation that we did in Week 4.

## Create a Playlist (without tracks)

On the `/playlists` page that you created in [Assignment 2 - Laravel 1](/teaching/2020/assignments/laravel-1), add a link in the upper right corner with the text "New Playlist" and an `href` of `/playlists/new`. This page should have a form that allows a user to create a playlist. The playlist name is required, should contain a maximum of 30 characters, and validation should occur on the server-side. If validation fails, display an error message underneath the playlist name input and prepopulate the input with what the user typed in. When a playlist name is successfully created, redirect the user to `/playlists`. Display some kind of [success alert](https://getbootstrap.com/docs/4.4/components/alerts/) on `/playlists` with the text "Playlist X was successfully created" (where X is the name of the new playlist) using [Flashed Session Data](https://laravel.com/docs/6.x/redirects#redirecting-with-flashed-session-data).

## Adding Tracks to a Playlist

Create a `/tracks` page that displays all tracks. Show the following fields:

* track name
* album title
* artist name

Sort the tracks by artist name, then by album title, and then by the track name.

Next to each track, add a link with an `href` of `/tracks/{id}/add-to-playlist` with the text "Add to Playlist". This page should display a form with a select menu that has all playlists sorted alphabetically as options. This form should `POST` to `/tracks/{id}/add-to-playlist` where the track will get added to the selected playlist. The user should then be redirected to the `/playlists/{id}` page that you created in [Assignment 2 - Laravel 1](/teaching/2020/assignments/laravel-1). Be sure to validate that a playlist was submitted and that the playlist exists in the database (the `exists` rule) and show an error message underneath the select menu if validation fails. Display some kind of [success alert](https://getbootstrap.com/docs/4.4/components/alerts/) on `/playlists/{id}` with the text "Track X was successfully added to Playlist Y" (where X is the name of the track and Y is the name of the playlist) using [Flashed Session Data](https://laravel.com/docs/6.x/redirects#redirecting-with-flashed-session-data).

Lastly, add the `/tracks` link to the main navigation with the text "Library".

## Renaming a Playlist

On the `/playlists` page, display a link next to each playlist with the text "Edit". This link should take the user to `/playlists/{id}/edit` where the user can change the name of the playlist. Display a text input on this page that is prepopulated with the name of the playlist. The playlist name is required, should contain a maximum of 30 characters, and validation should occur on the server-side. If validation fails, display an error message underneath the playlist name input and prepopulate the input with what the user typed in. When a playlist is successfully renamed, redirect the user to `/playlists` and display some kind of [success alert](https://getbootstrap.com/docs/4.4/components/alerts/) on `/playlists` with the text "Playlist X was successfully renamed to Y" (where X is the old playlist name and Y is the new playlist name) using [Flashed Session Data](https://laravel.com/docs/6.x/redirects#redirecting-with-flashed-session-data).

## Deleting a Playlist 

On the `/playlists` page, display a link next to each playlist with the text "Delete" (next to the Edit link). Clicking the Delete link should take the user to a delete playlist confirmation page with the URL `/playlists/{id}/delete` that says "Are you sure you want to delete PLAYLIST_NAME?" where "PLAYLIST_NAME" is the name of the playlist. There should be two buttons: Cancel and Delete. If the user clicks Cancel, they should be taken back to `/playlists`. If the user clicks Delete, the playlist should be deleted and the user should be redirected to `/playlists`. Make the delete happen through a POST request to `/playlists/{id}/delete` via a form.

Note, a playlist can't simply be deleted by deleting it from the `playlists` table. The related records in `playlist_track` need to be deleted first before deleting the playlist in the `playlists` table.

## Submission

Make a commit with the commit message "Assignment 3 - Laravel 2 completed". Push your code up to GitHub and verify that it was deployed to Heroku.
