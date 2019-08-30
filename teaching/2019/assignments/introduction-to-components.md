---
layout: assignment
title: Introduction to Components
---

In this assignment, you will build a page in React using Create React App that fetches data for a subreddit from the Reddit API and displays it on the page. Choose whatever subreddit you'd like.

## Requirements

* Display a div for each subreddit post containing the following fields:
  * `title` that links to `url` in a new tab
  * `description`
  * `score`
  * `subreddit_subscribers` formatted with commas. Use a helper for this. To format a number, check out [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).
  * If `num_comments` > 0, show the number of comments, also formatted with commas. Otherwise, show "No comments".
  * Display `banner_background_image` in some way if it exists.
* While the Ajax request is pending, show a loading indicator on the screen using [one of these CSS spinners](https://projects.lukehaas.me/css-loaders/). This loading indicator should be its own component.

## Submission

Create a repo on GitHub called __itp404-assignment3-introduction-to-components__ and upload your files. Also, deploy your app to Surge. Send an email to the TA and myself with the GitHub and Surge URLs. Failure to submit by the deadline will result in a 0.
