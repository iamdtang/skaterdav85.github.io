---
layout: assignment
title: Assignment 3
---

In this assignment, you will build a Reddit application with React and `fetch()`.

To start, create 3 buttons for your favorite subreddits. When each button is clicked, fire off an Ajax request to `GET https://www.reddit.com/r/{subreddit}.json` to retrieve all of the posts for the clicked subreddit.

Display a `div` for each subreddit post containing the following fields:

- `title` that links to `url` in a new tab
- `score`
- `subreddit_subscribers` formatted with commas. To format a number, check out [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).
- If `num_comments` > 0, show the number of comments, also formatted with commas. Otherwise, show "No comments".

Next, use the endpoint `GET https://www.reddit.com/api/info.json?id=<subreddit_id>` to fetch and render details about the given subreddit. For example, [`GET https://www.reddit.com/api/info.json?id=t5_2qhta`](https://www.reddit.com/api/info.json?id=t5_2qhta) returns details for the `cats` subreddit. Now you may be wondering where the `subreddit_id` value in the `id` query string parameter comes from. This value can be found in the response of the first API endpoint under the key `subreddit_id` in each `post` resource.

Display the following fields:

- `title`
- `description`
- `display_name_prefixed`
- `subscribers`

## A Loading Spinner

While Ajax requests are pending, show a loading indicator on the screen using [one of these CSS spinners](https://projects.lukehaas.me/css-loaders/).

## Components

Create at least 3 components in your application (the `App` component doesn't count as one of your components). It is up to you how you want break up your UI into components.

## Deploy to Netlify

- Create a `README.md` file
- Deploy your code to [Netlify](https://www.netlify.com/) and paste the URL on your `README.md`. See this [Markdown guide](https://www.markdownguide.org/cheat-sheet/) to learn how to create a link in Markdown.

## Submission

[https://classroom.github.com/a/C0Uw8An0](https://classroom.github.com/a/C0Uw8An0)
