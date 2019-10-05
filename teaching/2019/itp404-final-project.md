---
layout: assignment
title: Final Project
---

The final project is due on __12/8 at 11:59pm__. Points will be deducted if you turn it in late. Turning it in 1 day late is -10 points, and each subsequent day will be -5 points.

For the final project, you will develop a single page application (SPA) on a topic of your choice with React for the frontend. For the backend, you are welcome to build your own or use an API mocking library like Mirage.

## Application Requirements

* At least 4 routes. At least one of these routes should be a nested route.
* At least one AJAX request for each of the following request types: GET, POST, PUT/PATCH, and DELETE
* If you are using Mirage, change the `timing` property to 1000 milliseconds, except for the `test` environment so that tests don't take longer to run. Add loading indicators of some sort for things that take time.
* There should be some sort of feedback to the user when forms are processing. For example, a save button could have its display text change from "Save" to "Saving..." and then back to "Save". Another example is having a "Save" button show a loading indicator on the button while the form is processing. Check out other sites that you use and see what they do.
* Custom form validation (don't use HTML5 form validation). If a form is invalid, there should be unique error messages next to each field.
* At least one reusable/generic component designed by you. This should not be any of the components we did together in class.
* Each page should have a unique document title.

__Projects will be graded based on overall complexity.__

## Code Quality Requirements

* At least 15 tests
* Travis CI integration with all tests passing and a status badge on your project's README.md
* Cleanly formatted code. I recommend using Prettier. 
* Don't just make the code work. Make it also easy to read. Write readable variable and function names.

## User Experience Requirements

Your project should be styled so that it presents a good user experience and looks organized and professional. You are welcome to use libraries like Bootstrap, Foundation, etc.

## Deployment

Your project should be deployed to a public URL. I suggest using [Surge.sh](https://surge.sh/) like we did in class.

## Submission

Include the following in the README.md of your repo:

* The URL to your deployed app
* A YouTube link to a screencast where you demo your project and explain where you fulfilled each requirement. This video should have audio. Please keep this video under 10 minutes long.

Submit your project [here](https://classroom.github.com/a/0BG6xmuP) on our GitHub classroom. You are done! 👏
