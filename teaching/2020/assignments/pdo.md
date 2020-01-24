---
layout: assignment
title: PDO
---

In this assignment, you will build two pages that pull data from the [chinook SQLite database](http://www.sqlitetutorial.net/sqlite-sample-database/). All queries should use the PDO class.

## Listing Playists

Create `index.php` that displays all playlist names.

Each playlist should link to `tracks.php?playlist=PLAYLIST_NAME`, where `PLAYLIST_NAME` is replaced by the name of the playlist.

## Listing Tracks by Playist

Next, create `tracks.php`. This page should display all tracks for the `playlist` query string parameter. For each track, display the following information:

* Track name
* Album title
* Artist name
* Price
* Media type name
* Genre name

If there is no `playlist` query string parameter, redirect back to `index.php`.

If a playlist doesn't have any tracks, display "No tracks found for PLAYLIST_NAME" where `PLAYLIST_NAME` is the name of the playlist.

## Deploy to Heroku

Deploy your pages and database to Heroku. Create a `README.md` file and add your Heroku link to it.

## Submission

[https://classroom.github.com/a/KCIIQXNa](https://classroom.github.com/a/KCIIQXNa)