---
layout: assignment
title: Final Project
---

The final project is due on __5/3 at 11:59pm__. Points will be deducted if you turn it in late. Turning it in 1 day late is -10 points, and each subsequent day will be -5 points.

## The Database

Design and build a SQLite database with at least 3 tables having relationships (one to one, one to many, many to many, etc). Please include a schema similar to [this one](http://www.sqlitetutorial.net/sqlite-sample-database/), where you specify the tables, their columns, and how columns relate. You can either draw this out on paper or a whiteboard and take a picture of it, or use some other software. Please put this pic on your README.md.

Once you have figured out what your database will look like, create it using Laravel migrations.

## Part 1: The Application

Build a server-rendered application using Laravel:

* At least 4 GET routes (excluding `GET /about` - more on this below)
* Create an about page at `/about` that explains the goal/mission of the site. Be sure to add this link to your main navigation.
* At least 3 POST routes
* Pages where users can create, edit, and delete data.
* Server-side validation with Laravel's validation rules
* Error messages as flashed session data for when form submissions fail validation. Your error messages should be specific to the fields that failed validation as opposed to showing a single generic error message on the page.
* Form submissions that fail validation should repopulate the form with the user's input
* Flashed session data for when inserts, updates, and deletions are successful
* Authentication - Sign up, Login, and Logout
* Blade templating with a layout that is used for all of your pages.
* The document title (the `title` tag) for each page should be unique and contain meaningful data. This includes pages with different data. For example, on Amazon, the document title of a product page is different for every product listed. 
* All queries should go through Eloquent or the Query Builder for database access
* Your site should look organized and have a consistent layout. Feel free to use Bootstrap if you'd like.

## Part 2: Additional Feature

Choose at least one of the following features to implement:

1. Add real-time features to your Laravel project via a Web Socket service built in Node
2. Build a "Reactions" feature (similar to Facebook/LinkedIn Reactions).
3. Build a commenting system from scratch for some resource in your application. The comments in your commenting system should at the very least contain the commenter's name, a comment body, and a time stamp. Comments should be displayed from the most recent to the oldest. Comments don't need to be commentable.
4. None of the above additional features interest you? Pitch your idea to me by sending me and the TA an email with your idea. I will respond back either approving the feature or give some suggestions.

There are a few ways you could build options 2 and 3. One way is to store all the comments or reactions in the same database that your Laravel app is using. Another approach is to have a Node API that has a separate database (your Node API won't be able to leverage the same SQLite database) and this database would be responsible for storing comments or reactions on records in your main database. Doing it this way will likely require a little front-end JavaScript (AJAX). Please reach out to me if this interests you and you aren't familiar with AJAX.

## Code Quality

All code should be nicely formatted. Points will be deducted for sloppy code.

Be sure to put all sensitive information (like API keys and credentials) in environment variables for both your Laravel and/or Node code. In Node, you can use [dotenv](https://www.npmjs.com/package/dotenv) to manage environment variables.

## Complexity

I will take into account your application's complexity. You will not get full credit by doing the bare minimum.

## Heroku Deployment

Deploy your project to Heroku and add the URL to your `README.md`.

## Video Walkthrough

Create a video where you demo all parts of your project and __explain where you fulfilled each requirement__. This video should have audio. Please keep this video under 10 minutes. Upload the video to YouTube (choose Unlisted if you don't want the video to come up in search results) and add the link to your `README.md`.

## Submission

[https://classroom.github.com/a/8iI9aQPT](https://classroom.github.com/a/8iI9aQPT)
