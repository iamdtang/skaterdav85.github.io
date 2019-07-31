---
layout: assignment
title: Client-Side Templating
---

This assignment will build off of [assignment 1](/teaching/2019/assignments/ajax). Copy the files from assignment 1 into a new folder for assignment 2. __DO NOT COPY THE FOLDER__ as this will copy over the `.git` folder and tie this project to the GitHub repo associated with assignment 1. This should be a brand new repo.

In this assignment, you will update the Reddit search app so that all rendering of the search results is done through the Handlebars client-side templating library.

## Rendering with Handlebars

Display a div for each subreddit post containing the following fields:

* `title` that links to `url` in a new tab
* `score`
* `subreddit_subscribers` formatted with commas. Use a helper for this. To format a number, check out [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).
* If `num_comments` > 0, show the number of comments, also formatted with commas. Otherwise, show "No comments". Use the Handlebars `if` helper. In Handlebars, 0 is treated as falsey.

## Handling Errors

If the user typed in an invalid subreddit name, the Reddit API will respond with a [404 HTTP response status code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/404). This means that the subreddit can't be found. If a user types an invalid subreddit into the search box and submits the form, display "Oops! Something went wrong!" on the page in red.

## Submission

Create a repo on Github called __itp404-assignment2-client-side-templating__ and upload your files. Send an email to the TA and myself with the Github URL. Failure to submit by the deadline will result in a 0.
