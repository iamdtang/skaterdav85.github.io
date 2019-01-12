---
layout: assignment
title: PDO
---

In this assignment, you will build two pages that pulls data from a database using the PDO class.

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

## Deploy to Heroku

Once you've gotten it working, deploy your pages and database to Heroku.

## Submission

Please push up your code including the database to GitHub to a repository named EXACTLY __itp405-assignment1__. Send an email to the TA and myself with the repository URL and the Heroku URL.
