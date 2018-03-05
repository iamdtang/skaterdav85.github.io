---
layout: assignment
title: Final Project
date: 2018-03-05
---

For the final project, you will build a Laravel app and a Node API on whatever interests you. Here are the requirements:

## Database

Design and build a SQLite database with at least 3 tables having relationships (one to one, one to many, many to many, etc).

## Server-Rendered Web Application

Build a server-rendered application using Laravel and the database you have built. This application should have:

* At least 5 routes using both GET and POST
* Data validation with Laravel's Validator
* Error messages as flash data for when form submissions fail validation
* Form submissions that fail validation should repopulate the form with the user's invalid input
* Authentication
* Use of Blade templating and Blade layouts
* The title tag for each page should be unique
* Use of Eloquent or the Query Builder for database access
* Pages where user(s) can create, edit, and delete data. For example, maybe you have an admin section where the logged in user can create, edit, and delete data that regular users cannot.
* Consistent layout / theming. It doesn't have to be fancy, but the site/app should look organized and presentable. Feel free to use Bootstrap if you'd like.

## API

You will also build an API for your database using Node. This API should:

* Return JSON
* Have 5 different routes using the following HTTP methods
  * 2 GET endpoints (one endpoint for a collection of resources and another endpoint for a single resource)
  * 1 POST
  * 1 PATCH
  * 1 DELETE
* POST and PATCH requests should have validation. If validation fails, the response should return a 422 HTTP status code with the body containing the validation errors
* The GET request for a single resource and the DELETE request should respond with a 404 HTTP status code if the resource doesn't exist.

## Submission

Send a single email to the TA and myself on the project due date containing the following:

* A link to your Laravel repo
* A link to your Node API repo
* The URL to your deployed Laravel app
* The URL to your deployed Node API
* A YouTube link to a screencast where you demo your project and explain where you fulfilled each requirement. This video should have audio. Please keep this video under 10 minutes.
