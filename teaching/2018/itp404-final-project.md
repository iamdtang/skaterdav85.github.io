---
layout: assignment
title: Final Project
date: 2018-10-09
---

For the final project, you will develop a single page application with Ember and [ember-cli-mirage](https://www.ember-cli-mirage.com/) on a topic of your choice. Here are the project requirements:

* At least 4 routes
* At least 1 GET, 1 POST, 1 PUT or PATCH, and 1 DELETE AJAX request. You don't have to use Ember Data, but it is highly recommended.
* Use of Ember's loading and error substates. Change the `timing` property in Mirage to 1000 milliseconds (only for the `development` environment so that your tests don't take longer to run) so that I can easily see the loading states of your app.
* There should be some sort of feedback to the user when forms are processing. For example, a Save button could change its display text from Save to Saving and then back to Save, similar to what we did in class. It doesn't have to following that user experience though.
* Form validation. If a form is invalid, there should be error messages next to each field.
* At least 1 reusable/generic component designed by you that adheres to the Data Down, Actions Up paradigm. This should not be any of the components we did together in class.
* Each page has a unique title using [ember-cli-document-title](https://www.npmjs.com/package/ember-cli-document-title)
* Use of at least 1 addon of your choice that isn't one of the ones listed in these requirements
* At least 5 application tests that cover all types of CRUD operations
* At least 5 rendering tests. These should be a mixture of tests for helpers and components.  
* Cleanly formatted code. Don't just make the code work. Make it also easy to read. This includes proper indentation, consistent casing (camelCase is the JavaScript convention), consistent spacing, and readable variable and function names.
* Your project should be styled so that it presents a good user experience and looks organized and professional. You are welcome to use libraries like Bootstrap. In fact, there is an addon that integrates Ember and Bootstrap together called [`ember-bootstrap`](https://www.ember-bootstrap.com/).
* Deployed to [Surge.sh](https://surge.sh/) with [ember-cli-surge](https://www.npmjs.com/package/ember-cli-surge)
* Travis CI integration with all tests passing and a status badge on your project's README

__Projects will be graded based on overall complexity and user experience.__

Some addons you may want to consider using include:

* [ember-cli-notifications](http://stonecircle.github.io/ember-cli-notifications/)
* [ember-moment](https://github.com/stefanpenner/ember-moment)
* [ember-modal-dialog](https://github.com/yapplabs/ember-modal-dialog)
* [liquid-fire](https://github.com/ember-animation/liquid-fire)
* [ember-leaflet](https://github.com/miguelcobain/ember-leaflet)
* [ember-burger-menu](https://offirgolan.github.io/ember-burger-menu/)

Explore more addons on [Ember Observer](https://www.emberobserver.com/).

## Submission

Send a single email to the TA and myself on the project due date containing the following:

* A link to your Ember repo on Github
* The URL to your deployed Ember app on Surge
* A YouTube link to a screencast where you demo your project and explain where you fulfilled each requirement. This video should have audio. Please keep this video under 10 minutes.
