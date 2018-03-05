---
layout: assignment
title: PDO
date: 2018-01-15
---

This assignment will use the [`chinook` SQLite database](http://www.sqlitetutorial.net/sqlite-sample-database/).

## Listing Genres

Create a page `genres.php` that displays all genres from the `genres` table using PDO.

For each genre, make it an anchor that links to `tracks.php?genre=GENRE_NAME`, where `GENRE_NAME` is replaced with each genre, i.e. Rock, Blues, Reggae, etc.

## Listing Tracks by Genre

Next, create `tracks.php`. This page should display all tracks for the `genre` query string parameter. For each track, display the following information:

* track name
* album title
* artist name
* price

## Submission

Please push up your code including the database to GitHub to a repository named EXACTLY __itp405-assignment1__. Send an email to me at dtang@usc.edu with the repository URL.
