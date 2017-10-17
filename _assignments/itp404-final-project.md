---
layout: assignment
title: ITP 404 Final Project
date: 2017-10-17
---

For the final project, you will develop a single page application with Ember and Loopback on a topic of your choice. If you are familiar with developing APIs and don't wish to use Loopback, you are welcome to build out an API in whatever technology you wish as long as you can host it.

Here are the project requirements:

* At least 3 client side routes
* At least 1 GET, 1 POST, 1 PUT or PATCH, and 1 DELETE AJAX request
* Use of a CSS loading indicator for when AJAX requests are processing
* Each page has a unique title using [this addon](https://www.npmjs.com/package/ember-cli-document-title)
* 3 practical acceptance tests
* 3 practical integration tests
* Cleanly formatted code. Don't just make the code work. Make it also easy to read. This includes proper indentation, consistent casing (camelCase is the JavaScript convention), consistent spacing, and readable variable and function names.
* Your project should be styled so that it presents a good user experience and looks organized and professional.
* Frontend and API are deployed to Heroku
* Travis CI integration with all tests passing
* Notifications using Toastr
  * a success notification when something is successfully updated, deleted, or created
  * an error notification when an AJAX call fails

Projects will be graded based on overall complexity and user experience.

Some extras that you may want to use or that may spark some ideas:

* Google Maps integration
* Geolocation API
* Google Charting - https://developers.google.com/chart/
* Using modals with [ember-modal-dialog](https://github.com/yapplabs/ember-modal-dialog)
* Integration with 3rd party APIs. You can search for APIs on https://www.programmableweb.com. Many require an authentication process, which you can get to work but requires some extra learning, or you may find some that are publicly open, like some of the Reddit endpoints.
* [tracking.js](https://trackingjs.com/examples/face_hello_world.html) (face and shape detection in images)

Send a single email containing the following to the TA and myself on the project due date:

* A link to your frontend repo and a link to your API repo
* A link to your hosted Ember app
* A list that explains where you fulfilled each requirement. I will use this as my basis for grading.
