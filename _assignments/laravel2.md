---
layout: assignment
title: Laravel 2
date: 2018-02-05
---

This assignment will use Laravel and the [chinook SQLite database](http://www.sqlitetutorial.net/sqlite-sample-database/).

All Laravel assignments, labs, and class demos will build on the same installation.

## Editing a Playlist Name

Next to each playlist on the `/playlists` page, display an "Edit" link. When this link clicked, it will take you to `/playlists/{id}/edit`, where the user is presented with a form prepopulated with the name of the playlist that was clicked.

When the user hits the "Save" button, the following should happen:

* validate the data to ensure the playlist name is present and at least 3 characters long
* if the name is valid, the playlist name is updated in the database and the user is redirected back to the `/playlists` page
* if the name is invalid, error messages are displayed at the top of the screen and the user can see their invalid input in the text field (which is flash data)

Check out the [Laravel documentation on how to update records using Laravel's Query Builder](https://laravel.com/docs/5.5/queries#updates).

## Deleting a Playlist

Next to each playlist on the `/playlists` page, also display a "Delete" link. When this is clicked, the playlist will be deleted and the user is redirected back to the `/playlists` page. You shouldn't see the playlist on the page anymore.

Check out the [Laravel documentation on how to delete records using Laravel's Query Builder](https://laravel.com/docs/5.5/queries#deletes).

## Other Requirements

* use Laravel's Validator class for validating the playlist name
* error messages should be flash data

## Submission

Please push up your code including the database to GitHub to the same repository as last week (__itp405-laravel-assignments__). You should already have connected your GitHub repository to Heroku for automatic deployments. If you haven't, [follow these instructions](/tutorials/deploying-laravel-with-sqlite-to-heroku). Verify that your app has been deployed and it works on Heroku. Send an email to me and the TA with the repository URL and the URL to the live site on Heroku.
