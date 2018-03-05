---
layout: assignment
title: Ajax and the Reddit API
date: 2017-08-28
---

In this assignment, you will interact with the Reddit API using Ajax through jQuery. You will work with both callbacks and promises. The Reddit API endpoint you'll be working with looks like this:

`https://www.reddit.com/r/{subreddit}.json`

To get data for the javascript subreddit, swap `{subreddit}` with "javascript":

[https://www.reddit.com/r/javascript.json](https://www.reddit.com/r/javascript.json)

Start by creating 2 files: _callbacks.html_ and _promises.html_.

## Callbacks

In _callbacks.html_, reference jQuery followed by a script block. Write a function named `fetchPostsForSubreddit(subreddit, callback)`. This function will receive a subreddit name as the first parameter. This function should make an Ajax request to the Reddit API for the passed in subreddit. When the results come back, the callback function passed in as the second parameter should be invoked with the results. In other words, I should be able to do the following:

```js
fetchPostsForSubreddit('javascript', function(results) {
  console.log(results);
});
```

## Promises

In _promises.html_, reference jQuery followed by a script block. Write a function named `fetchPostsForSubreddit(subreddit)`. This function will receive a subreddit name as the only parameter. This function should make an Ajax request to the Reddit API for the passed in subreddit. This function should return a promise. In other words, I should be able to do the following:

```js
fetchPostsForSubreddit('javascript').then(function(results) {
  console.log(results);
});
```

## Rendering

In both files, when the Ajax request comes back successfully, render an unordered list of all the post titles. Each post can be found in `data.children` and a post has a `title` attribute.

## An extra challenge if you're up for it ... (Optional)

While the Ajax request is pending, show some sort of loading indicator on the screen. This could be as simple as "Loading..." or [one of these cool CSS spinners](https://projects.lukehaas.me/css-loaders/).

## Submission

Create a repo on Github called __itp404-assignment1__ and upload your files. Send an email to the TA and myself with the Github URL.
