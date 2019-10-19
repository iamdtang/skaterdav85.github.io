---
layout: assignment
title: Final Project
---

The final project is due on __12/8 at 11:59pm__. Points will be deducted if you turn it in late. Turning it in 1 day late is -10 points, and each subsequent day will be -5 points.

For the final project, you will develop a single page application (SPA) on a topic of your choice with React for the frontend. For the backend, you will build an in-memory API like we did in class. For those with more experience on the backend, you are welcome to use a database and whatever else you'd like.

## Application Requirements

* Client-side routing with React Router
  * At least 4 routes. You must have at least one nested route and one route with a URL parameter.
  * A 404 page if a user navigates to a route that doesn't exist
* At least one AJAX request for each of the following request types: GET, POST, PUT/PATCH, and DELETE.
* Custom form validation (don't use HTML5 form validation). If a form is invalid, there should be unique error messages next to each field. This can be done either client-side or server-side.
* At least one reusable/generic component designed by you. This should not be any of the components we did together in class.
* Each page should have a unique document title.
* Display notifications of some sort when a user has taken an action and it was successful, like deleting, creating, and updating something. 

__Projects will be graded based on overall complexity.__

## Code Quality Requirements

* At least 15 tests
* Travis CI integration with all tests passing and a status badge on your project's README.md
* Cleanly formatted code. I recommend using Prettier. 
* Don't just make the code work. Make it also easy to read. Write readable variable and function names.

## User Experience Requirements

Your project should be styled so that it presents a good user experience and looks organized and professional. You are welcome to use libraries like Bootstrap, Foundation, etc.

## Deployment

Your project should be deployed to a public URL. I suggest using [Surge.sh](https://surge.sh/).

[Deploying React Projects to Surge.sh](/2019/10/17/deploying-react-to-surge.html)

## Submission

Include the following in the README.md of your repo:

* The URL to your deployed app
* A YouTube link to a screencast where you demo your project and explain where you fulfilled each requirement. This video should have audio. Please keep this video under 10 minutes long.

Submit your project [here](https://classroom.github.com/a/0BG6xmuP) on our GitHub classroom. You are done! 👏
