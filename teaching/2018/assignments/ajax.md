---
layout: assignment
title: Ajax
date: 2018-08-28
---

In this assignment, you will interact with the Reddit API using Ajax. The Reddit API endpoint you'll be working with looks like this:

`https://www.reddit.com/r/{subreddit}.json`

To get data for the "javascript" subreddit, swap `{subreddit}` with "javascript":

[https://www.reddit.com/r/javascript.json](https://www.reddit.com/r/javascript.json)

## The Ajax Request

Write a function named `fetchPostsForSubreddit(subreddit)`. This function will receive a subreddit name as the only parameter, and will make an Ajax request to the Reddit API for the passed in subreddit. This function can either uses jQuery's Ajax functions, `fetch`, or `XMLHttpRequest`.

## Rendering

When the Ajax request comes back successfully, render an unordered list of all the post titles. Each post can be found in `data.children`. Render the following attributes: `title`, `score`, and `author`.

## A Loading Spinner

While the Ajax request is pending, show some sort of loading indicator on the screen. This could be as simple as "Loading..." or [one of these cool CSS spinners](https://projects.lukehaas.me/css-loaders/).

## Submission

Create a repo on Github called __itp404-assignment1__ and upload your files. Send an email to the TA and myself with the Github URL.
