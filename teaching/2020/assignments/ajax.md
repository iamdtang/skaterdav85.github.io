---
layout: assignment
title: Ajax and the Reddit API
---

In this assignment, you will create a search and results page using Ajax and the Reddit API. The Reddit API endpoint you'll be working with looks like this:

`GET` `https://www.reddit.com/r/{subreddit}.json`

To get data for the "javascript" subreddit, swap `{subreddit}` with "javascript":

[https://www.reddit.com/r/javascript.json](https://www.reddit.com/r/javascript.json)

## The Search Form

At the top of the page, create a form with a single search input and a submit button. When the user submits the form, fire off an Ajax request to get all the threads for the subreddit that was typed into the search box.

Note: Bind to the submit event on the form element instead of binding to the click event on the button.

## Rendering the Results

When the Ajax request responds with the data, render the `title`, `score`, and `author` of each post. Each post can be found in `data.children`. The `title` should be an anchor tag that links to `url` and opens in a new tab/window. Make sure that you are taking measures to protect against XSS attacks either by using DOMPurify or creating fragments and nodes.

## A Loading Spinner

While the Ajax request is pending, show a loading indicator on the screen using [one of these CSS spinners](https://projects.lukehaas.me/css-loaders/).

## Submission

[https://classroom.github.com/a/9vNaiKSr](https://classroom.github.com/a/9vNaiKSr)
