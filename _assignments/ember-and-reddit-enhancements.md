---
layout: assignment
title: Ember and Reddit Enhancements
date: 2017-10-17
---

Create a branch off of assignment 5 called `assignment6`:

```
git checkout -b assignment6
```

In this assignment, you will enhance what you built in assignment 5.

## Pressing Enter to Search

Right now, a user can only perform a search by typing into the text field and clicking the search button. Let's change that so that the user can press enter, just like when submitting all other HTML forms.

## A Reddit Service

Imagine you want to make Reddit API calls in other parts of your application. Do you just copy the `$.ajax(...)` code all over the place? You can, but if you ever have to change how you interact with this API, such as adjusting the URL, you'll have to make this update in several places. Another approach is to create a dedicated service for interacting with the Reddit API.

Create a service called `reddit`. This service should have a method called `findAllForSubreddit(subreddit)` which takes in the subreddit as a parameter (i.e. "cats"). This method will return a promise that resolves with the array of posts for that subreddit (the `children` property).

Next, use this service in the `subreddit` route's model hook instead of making a raw AJAX call.

Now, we have a dedicated service for interacting with the Reddit API with a self explanatory method name for fetching a list of posts for a given subreddit.

## Display `thumbnail`

If a subreddit post has a value in the `thumbnail` property, display the image. If it doesn't, show some kind of placeholder image.
