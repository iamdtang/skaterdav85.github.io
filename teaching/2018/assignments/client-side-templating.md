---
layout: assignment
title: Client-Side Templating
date: 2018-09-04
---

This assignment will build off of [assignment 1](/teaching/2018/assignments/ajax). Copy the files from assignment 1 into a new folder for assignment 2. Make sure you are not copying the `.git` folder. This should be a brand new repo.

In this assignment, you will update the Reddit search app so that all rendering of the search results is done through the Handlebars client-side templating library.

## Rendering with Handlebars

Display a div for each subreddit post containing the following fields:

* `title` that links to `url` in a new tab
* `score`
* `subreddit_subscribers` formatted with commas. Use a helper for this. To format a number, check out [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).
* If `num_comments` > 0, show the number of comments, also formatted with commas. Otherwise, show "No comments". Use the Handlebars `if` helper. In Handlebars, 0 is treated as falsey.

## Handling Errors

If the user typed in an invalid subreddit name, the Reddit API will respond with a 404 HTTP response. This means that the subreddit can't be found. When 400 or 500 level HTTP responses are returned, the error handler in the `then()` of a promise is invoked. For example:

```js
$.getJSON('https://www.reddit.com/r/{subreddit}.json').then(function() {
  // won't be called
}, function() {
  // this will be called because a subreddit named "{subreddit}" doesn't exist
  console.error('an error occurred');
});
```

If a user types an invalid subreddit into the search box and submits the form, display "Oops! Something went wrong!" on the page.

## Submission

Create a repo on Github called __itp404-assignment2__ and upload your files. Send an email to the TA and myself with the Github URL. As always, assignments are due the following Tuesday at midnight.
