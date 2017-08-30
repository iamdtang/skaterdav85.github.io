---
layout: assignment
title: Client-side Templating
date: 2017-08-29
---

For this assignment, you will build a page where the user can search for a subreddit and see the results rendered via the Handlebars.js client-side templating library. Start by making a text input and a button at the top of the page. When the user presses search, an AJAX request should be made to the Reddit API for the subreddit typed into the search box. See [assignment 1](/assignments/ajax-and-the-reddit-api) for details on the Reddit API.

Display a div for each subreddit post containing the following fields:

* post title that links to the post - `title` and `url` properties
* the score - the `score` property
* If `num_comments` > 0, show the number of comments. Otherwise, show "No comments.". Hint: Use the Handlebars `if` helper. Also, in Handlebars, 0 is treated as falsey.

This part should use the Handlebars client-side templating library. Start by creating a template defined in a `<script type="text/handlebars">` tag.

## Handling Errors

If the user typed in an invalid subreddit name, you will get a 404 HTTP response. This means that the subreddit can't be found. When 400 or 500 level HTTP responses are returned, the error handler in the `then()` of a promise is invoked. For example:

```js
$.getJSON('https://www.reddit.com/r/{subreddit}.json').then(function() {
  // won't be called
}, function() {
  // this will be called because a subreddit named "{subreddit}" doesn't exist
  console.log('an error occurred');
});
```

If a user types an invalid subreddit into the search box and presses the search button, display on the page "Oops! Something went wrong!".

## A Loading Indicator (Optional)

While the results are being fetched, display some sort of loading indicator. This could be as simple as "Loading..." or [one of these cool CSS spinners](https://projects.lukehaas.me/css-loaders/).

## Submission

Create a repo on Github called __itp404-assignment2__ and upload your files. Send an email to the TA and myself with the Github URL.
