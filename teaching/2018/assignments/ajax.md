---
layout: assignment
title: Ajax
date: 2018-08-28
---

In this assignment, you will create a search and results page using Ajax and the Reddit API. The Reddit API endpoint you'll be working with looks like this:

`https://www.reddit.com/r/{subreddit}.json`

To get data for the "javascript" subreddit, swap `{subreddit}` with "javascript":

[https://www.reddit.com/r/javascript.json](https://www.reddit.com/r/javascript.json)

## The Search Form

At the top of the page, create a form with a single search input and a submit button. When the user submits the form, fire off an Ajax request (using jQuery, `fetch`, or `XMLHttpRequest`)  to get all the threads for the subreddit that was typed into the search box.

Note: Bind to the submit event on the form element instead of binding to the click event on the button.

## Rendering the Results

When the Ajax request responds successfully, render the `title`, `score`, and `author` of each post. Each post can be found in `data.children`.

## A Loading Spinner

While the Ajax request is pending, show some sort of loading indicator on the screen. This could be as simple as "Loading..." or [one of these cool CSS spinners](https://projects.lukehaas.me/css-loaders/).

## Submission

Create a repo on Github called __itp404-assignment1__ and upload your files. Send an email to the TA and myself with the Github URL.
