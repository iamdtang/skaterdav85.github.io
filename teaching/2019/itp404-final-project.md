---
layout: assignment
title: Final Project
---

The final project is due on __12/8 at midnight__. Points will be deducted if you turn it in late. Turning it in 1 day late is -10 points, and each subsequent day will be -5 points.

For the final project, you will develop a single page application (SPA) on a topic of your choice with either Ember or React for the frontend. For the backend, you are welcome to build your own or use a tool like Mirage. For those using Ember, use [ember-cli-mirage](https://www.ember-cli-mirage.com/) for the Mirage integration like we did in class. For those using React, you can use [Mirage](https://miragejs.com/) directly.

For those who would like to use React, there will be things that you will need to research yourself since we didn't cover all of the topics that we covered in Ember. These topics include routing, testing, continuous integration, and Mirage integration.

## Application Requirements

* At least 4 routes / "pages"
* At least one AJAX request for each of the following request types: GET, POST, PUT/PATCH, and DELETE
* If you are using Mirage, change the `timing` property to 1000 milliseconds, except for the `test` environment so that tests don't take longer to run. Add loading indicators of some sort for things that take time. In Ember, you may want to use [Loading Substates](https://guides.emberjs.com/release/routing/loading-and-error-substates/) in some cases.
* There should be some sort of feedback to the user when forms are processing. For example, a save button could have its display text change from "Save" to "Saving..." and then back to "Save". Another example is having a "Save" button show a loading indicator on the button while the form is processing. Check out other sites that you use and see what they do.
* Custom form validation (don't use HTML5 form validation). If a form is invalid, there should be unique error messages next to each field.
* At least one reusable/generic component designed by you that adheres to the Data Down, Actions Up / One-Way Data Flow paradigm. This should not be any of the components we did together in class.
* Each page should have a unique title. For Ember projects, check out [ember-cli-document-title](https://www.npmjs.com/package/ember-cli-document-title).

__Projects will be graded based on overall complexity.__

## Code Quality Requirements

### Ember Projects

* At least 5 application tests. There should be an application test for each CRUD operation.
* At least 5 rendering tests (component or helper tests)

### React Projects

* At least 15 component tests

### Both Ember and React Projects

* Travis CI integration with all tests passing and a status badge on your project's README
* Cleanly formatted code. Don't just make the code work. Make it also easy to read. This includes proper indentation and spacing, consistent casing (camelCase is the JavaScript convention), and readable variable and function names.

## User Experience Requirements

Your project should be styled so that it presents a good user experience and looks organized and professional. You are welcome to use libraries like Bootstrap, Foundation, etc.

## Deployment

Your project should be deployed to a public URL. I suggest using [Surge.sh](https://surge.sh/) like we did in class.

## Ember Extras

If you are using Ember, some addons you may want to use include:

* [ember-cli-notifications](http://stonecircle.github.io/ember-cli-notifications/)
* [ember-moment](https://github.com/stefanpenner/ember-moment)
* [ember-modal-dialog](https://github.com/yapplabs/ember-modal-dialog)
* [liquid-fire](https://github.com/ember-animation/liquid-fire)
* [ember-leaflet](https://github.com/miguelcobain/ember-leaflet)
* [ember-burger-menu](https://offirgolan.github.io/ember-burger-menu/)

Explore more addons on [Ember Observer](https://www.emberobserver.com/).

## Submission

Send a single email to the me and the TA with the subject "ITP 404 - Fall 2019 - Final Project Submission" on the project due date (or earlier) containing the following:

* A link to your repo on GitHub
* The URL to your deployed app
* A YouTube link to a screencast where you demo your project and explain where you fulfilled each requirement. This video should have audio. Please keep this video under 10 minutes long.
