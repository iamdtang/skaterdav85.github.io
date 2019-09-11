---
layout: assignment
title: Introduction to Components
---

In this assignment, you will build a page in React using Create React App that fetches data for a subreddit from the Reddit API and displays it on the page. Choose whatever subreddit you'd like.

## Requirements

* Display a div for each subreddit post containing the following fields:
  * `title` that links to `url` in a new tab
  * `score`
  * `ups` formatted with commas. To format a number, check out [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).
  * If `num_comments` > 0, show the number of comments, also formatted with commas. Otherwise, show "No comments".
  * Display `banner_background_image` in some way if it exists.
* While the Ajax request is pending, show a loading indicator on the screen using [one of these CSS spinners](https://projects.lukehaas.me/css-loaders/). This loading indicator should be its own component.
* Display `subreddit_subscribers` at the top of the page before the list. This value is the same for every subreddit post in the JSON.

## Submission

Create a repo on GitHub called __itp404-assignment3-introduction-to-components__ and upload your files. Also, deploy your app to Surge. Send an email to the TA and me with the title "ITP 404 - Assignment 3" with the GitHub and Surge URLs in the body. Failure to submit by the deadline will result in a 0.
