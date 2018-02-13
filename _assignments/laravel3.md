---
layout: assignment
title: Laravel 3
date: 2018-02-13
---

This assignment will use Laravel and the [chinook SQLite database](http://www.sqlitetutorial.net/sqlite-sample-database/).

All Laravel assignments, labs, and class demos will build on the same installation.

## Editing and Deleting a Playlist

Modify assignment 2 to use Eloquent instead of the query builder.

## The Tracks by Genre Page

Modify the queries on this page to use Eloquent instead of the Query Builder. When displaying the tracks, also display the Media Type.

## Listing Tracks without a Genre

On the /tracks page, if a genre query param isn't supplied, display 100 tracks to the user. (This part of the assignment doesn't have to Eloquent).

## Submission

Please push up your code including the database to GitHub to the same repository as last week (__itp405-laravel-assignments__). You should already have connected your GitHub repository to Heroku for automatic deployments. If you haven't, [follow these instructions](/tutorials/deploying-laravel-with-sqlite-to-heroku). Verify that your app has been deployed and it works on Heroku. Send an email to me and the TA with the repository URL and the URL to the live site on Heroku.
