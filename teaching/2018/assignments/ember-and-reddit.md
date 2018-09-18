---
layout: assignment
title: Ember and Reddit
date: 2018-09-18
---

In this lab, you will build an Ember app where users can search for subreddits on Reddit using the Reddit API.

The Reddit API endpoint you'll be working with looks like this:

`https://www.reddit.com/r/{subreddit}.json`

To get data for the "javascript" subreddit, swap `{subreddit}` with "javascript":

[https://www.reddit.com/r/javascript.json](https://www.reddit.com/r/javascript.json)

## The Application Template

Create some sort of page header and footer in the application template.

## The Search Form

Create an `index` route. On this route's template, create a search form with a text input and a submit button.

Next, create a route called `r` with a dynamic segment called `subreddit`.

When the user submits the form, an action should be fired that transitions to this `r` route with the value from the text input as the the dynamic segment value. For example, if I search for "cats", I should be redirected to `/r/cats`.

## Rendering Results

On this route, fetch the data for the subreddit value in the dynamic segment in the model hook and display all of the items in `data.children`. Show the following fields in a presentable way:

* num_comments
* ups
* downs
* title
* domain

## Loading and Error Substates

While the Ajax request is pending, show some sort of loading indicator on the screen using Ember's loading substate template. This could be as simple as "Loading..." or [one of these cool CSS spinners](https://projects.lukehaas.me/css-loaders/). If an error happens, show some kind of error indicator using Ember's error substate template.

[Read more about loading and error substates in Ember](https://guides.emberjs.com/release/routing/loading-and-error-substates/)

## Submission

Create a repo on Github called __itp404-lab1__ and upload your files. Send an email to the TA and myself with the Github URL.
