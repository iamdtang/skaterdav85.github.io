---
layout: assignment
title: Final Project
---

For the final project, you will build a Laravel app and a Node API on whatever interests you. Here are the requirements:

## Database

Design and build a SQLite database with at least 3 tables having relationships (one to one, one to many, many to many, etc).

## Part 1: Server-Rendered Web Application with Laravel

Build a server-rendered application using Laravel and the database you have built. This application should have:

* At least 4 GET routes
* At least 2 POST routes
* Data validation with Laravel's Validator
* Error messages as flash data for when form submissions fail validation
* Form submissions that fail validation should repopulate the form with the user's input
* Authentication
* Use of Blade templating and Blade layouts
* The title tag for each page should be unique
* Use of Eloquent or the Query Builder for database access
* Pages where user(s) can create, edit, and delete data. For example, maybe you have an admin section where the logged in user can create, edit, and delete data that regular users cannot.
* Consistent layout / theming. It doesn't have to be fancy, but the site/app should look organized and presentable. Feel free to use Bootstrap if you'd like.

## Part 2: Node API

You will also build an API for your database using Node. This API should:

* Return JSON
* Have 5 different routes using the following HTTP methods
  * 2 GET endpoints (one endpoint for a collection of resources and another endpoint for a single resource)
  * 1 POST
  * 1 PATCH
  * 1 DELETE
* POST and PATCH requests should have validation. If validation fails, the response should return a 422 HTTP status code with the body containing the validation errors
* The GET request for a single resource and the DELETE request should respond with a 404 HTTP status code and an empty response body if the resource doesn't exist.
* Use an ORM for database access instead of building raw strings of SQL
* Use [dotenv](https://www.npmjs.com/package/dotenv) for sensitive data like API keys and credentials

## Part 3: Testing and Continuous Integration (CI)

TBD

## Other Things You Can Do

* If you'd like to add real-time functionality to your app with Web Sockets in Node.js, you can do that and skip out on the PATCH and DELETE API endpoints in Part 2. If you choose to do this, your feature shouldn't be the same as the class or lab example, unless extensively modified or implemented more robustly.
* You're welcome to use NoSQL and MongoDB for your database instead of SQLite. You will need to figure out how to host this though.

## Other Requirements

* All code should be nicely formatted. Points will be deducted for sloppy code.
* I will take into account your application's complexity. You will not get full credit by doing the bare minimum.

## Submission

Send a single email to the TA and myself on the project due date containing the following:

* A link to your Laravel repo and a link to your Node repo. These apps should not be in the same repo.
* The URL to your deployed Laravel app
* The URL to your deployed Node API
* A YouTube link to a screencast where you demo all parts of your project and __explain where you fulfilled each requirement__. This video should have audio. Please keep this video under 10 minutes.
