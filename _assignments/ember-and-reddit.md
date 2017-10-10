---
layout: assignment
title: Ember and Reddit
date: 2017-10-10
---

In this assignment, you will build an Ember app where users can search for subreddits on Reddit using the Reddit API.

The Reddit API endpoint you'll be working with looks like this:

`https://www.reddit.com/r/{subreddit}.json`

To get data for the "javascript" subreddit, swap `{subreddit}` with "javascript":

[https://www.reddit.com/r/javascript.json](https://www.reddit.com/r/javascript.json)

## The Search Form

Create a header in the application template containing a search form (a text field and a search button). Style the page a little bit with Bootstrap to make it presentable. When the user clicks on the search button, it should transition to a `subreddit` route with a path like `/subreddits/:subreddit`, where `:subreddit` is a dynamic segment for subreddit (i.e. `/subreddits/javascript`).

## The Subreddit Route

On this route, fetch the data for the subreddit in the dynamic segment of the URL path and display all of the threads. Show the following fields in a presentable way:

* num_comments
* ups
* downs
* title
* domain

## Loading and Error Substates

While the Ajax request is pending, show some sort of loading indicator on the screen using Ember's loading substate template. This could be as simple as "Loading..." or [one of these cool CSS spinners](https://projects.lukehaas.me/css-loaders/). If an error happens, show some kind of error indicator using Ember's error substate template.

https://guides.emberjs.com/v2.16.0/routing/loading-and-error-substates/

## Submission

Create a repo on Github called __itp404-assignment5__ and upload your files. Send an email to the TA and myself with the Github URL.
