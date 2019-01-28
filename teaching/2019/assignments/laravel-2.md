---
layout: assignment
title: Laravel 2
---

This assignment will use Laravel and the [chinook SQLite database](http://www.sqlitetutorial.net/sqlite-sample-database/).

All Laravel assignments, labs, and class demos will build on the same installation.

## Navigation

Create a navigation that is accessible on all pages via a Blade layout. In this navigation, create links for:

* `/genres` with the label "Genres"
* `/tracks` with the label "Tracks"

If your assignments are using a separate installation than what we did in class, create an empty page for the `/` URL. This page should use your layout template so that the navigation shows up on it.

## Creating a Track

On the `/tracks` page, put a button with the label "Add Track" at the top of the screen. Clicking this button should take you to `/tracks/new`. This page should display a form for adding a track. The form should contain:

* a text input for name
* a select menu populated with all available albums
* a select menu populated with all available media types
* a select menu populated with all available genres
* a text input for composer
* a number input for milliseconds
* a number input for bytes
* a number input for the unit price

When the user hits the "Save" button, the following should happen:

* Server-side validation using the `Validator` class with the following validation rules:
  * All fields are required
  * Milliseconds, bytes, and unit price are numbers
* If the form is valid, the track is added in the database and the user is redirected back to `/tracks`
* If the form is invalid, display an error message next to the corresponding form control. The form should also contain the user's invalid form data. For the select menu options, you will want to conditionally add the [`selected` attribute](https://www.w3schools.com/tags/tag_option.asp) in order to preserve what the user had previously selected.

## Editing a Genre Name

Next to each genre on the `/genres` page that you did in Assignment 1, display an "Edit" link. When this link clicked, it will take you to `/genres/{id}/edit`, where the user is presented with a form populated with the name of the genre that was clicked.

When the user hits the "Save" button, the following should happen:

* Server-side validation using the `Validator` class with the following validation rules:
  * The genre name is required
  * The genre name is at least 3 characters long
  * The genre name doesn't already exist in the `genres` table. (see the `unique` rule)
* If the name is valid, the genre name is updated in the database and the user is redirected back to the `/genres` page
* If the name is invalid, the error message from the validation is shown underneath the genre name text input.

Check out the [Laravel documentation on how to update records using Laravel's Query Builder](https://laravel.com/docs/5.7/queries#updates).

## Submission

* Please push up your code to your repository __itp405-laravel__.
* Deploy your app to Heroku. Verify that your app has been deployed and it works on Heroku.
* Send an email to me and the TA with the repository URL and the URL to the live site on Heroku. Please use the subject line __ITP 405 Assignment Submission - Laravel 2__.