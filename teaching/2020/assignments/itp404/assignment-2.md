---
layout: assignment
title: Assignment 2
---

In this assignment, you will build a Reddit search application that consumes two Reddit APIs and renders the data using client-side templating with Handlebars.

## Subreddit Search and Results

At the top of the page, create a form with a single search input and a submit button. When the user **submits** the form (bind to the submit event of the form instead of a click event on the button), fire off an Ajax request to `GET https://www.reddit.com/r/{subreddit}.json` to retrieve all of the posts for the subreddit that was typed into the search box.

Display a div for each subreddit post containing the following fields:

- `title` that links to `url` in a new tab
- `score`
- `subreddit_subscribers` formatted with commas. To format a number, check out [`Number.prototype.toLocaleString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString). You can implement this two ways. The first approach is to format this data before passing it to the template to be rendered. A second approach is to use a [custom Handlebars helper](https://handlebarsjs.com/guide/#custom-helpers). Choose whichever one you feel comfortable with.
- If `num_comments` > 0, show the number of comments, also formatted with commas. Otherwise, show "No comments". Use the Handlebars `if` helper. In Handlebars, 0 is treated as falsey.

## Subreddit Details

Next, use the endpoint `GET https://www.reddit.com/api/info.json?id=<subreddit_id>` to fetch and render details about the given subreddit. For example, [`GET https://www.reddit.com/api/info.json?id=t5_2qhta`](https://www.reddit.com/api/info.json?id=t5_2qhta) returns details for the `cats` subreddit. Now you may be wondering where the `subreddit_id` value in the `id` query string parameter comes from. This value can be found in the response of the first API endpoint under the key `subreddit_id` in each `post` resource.

Display the following fields:

- `title`
- `description`
- `display_name_prefixed`
- `subscribers`

## A Loading Spinner

While Ajax requests are pending, show a loading indicator on the screen using [one of these CSS spinners](https://projects.lukehaas.me/css-loaders/).

## Deploy to Surge

- Create a `README.md` file
- Deploy your code to [Surge](https://surge.sh/) and paste the URL on your `README.md`. See this [Markdown guide](https://www.markdownguide.org/cheat-sheet/) to learn how to create a link in Markdown.

## Submission

[https://classroom.github.com/a/Cl-Y8coa](https://classroom.github.com/a/Cl-Y8coa)
