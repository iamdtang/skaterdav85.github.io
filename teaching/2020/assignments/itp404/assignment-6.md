---
layout: assignment
title: Assignment 6
---

## Rendering GitHub Members

Render members for a GitHub organization using the GitHub API [https://api.github.com/orgs/emberjs/members](https://api.github.com/orgs/emberjs/members). Feel free to use another GitHub organization instead of `emberjs`. Render an image for `avatar_url` and display `login`.

## A Member Profile Modal

When a member's image or login is clicked, show a modal with the following information for that member from the API contained in the `url` property. Choose at least 3 of these properties to render:

- `name`
- `company`
- `blog`
- `email`
- `location`
- `hireable`
- `bio`
- `twitter_username`
- `public_repos`
- `followers`
- `following`
- `public_gists`

## A Member Repos Modal

In the list of members, add a Repos button. When the button is clicked, open a modal that renders the repos for that member using the API contained in `repos_url`. Display `name` as a link to `html_url` and `description`. Make the link open in a new tab (`target="_blank"`).

## Following Members

In this section, you will build a JSON Server API for managing GitHub member resources. You'll need to figure out what API endpoints you'll need for the feature below.

For each member, display a Follow button. When the button is clicked, save this member to your JSON Server API. When a member is followed, display an Unfollow button. When the Unfollow button is clicked, remove this member from your JSON Server API. When loading the page for the first time or reloading the page, the Follow/Unfollow button for each member should be in the correct state.

## Deploy to Netlify

Deploy the React frontend to [Netlify](https://www.netlify.com/) and the API to Heroku [like we did in class](https://github.com/ITP-404-Fall-2020-Demos/week6/pull/9/files).

Add the deployed URL to your `README.md` using a Markdown link. See this [Markdown guide](https://www.markdownguide.org/cheat-sheet/) to learn how to create a link in Markdown.

## Submission

[https://classroom.github.com/a/LIRZAzr1](https://classroom.github.com/a/LIRZAzr1)
