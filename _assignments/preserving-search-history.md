---
layout: assignment
title: Preserving Search History
date: 2017-09-19
---

## Searching for Github Repos

Create a page where you can search repos for a Github user. At the top of the page should be a search input and button. When you click the button, make a request to the Github API for the repos for a given user. Try searching for Github usernames `wycats` and `skaterdav85` (me). The endpoint is structured like:

```
https://api.github.com/users/{username}/repos
```

Use Handlebars to render the list of repos.

## Preserving Search History

Whenever a search is made, the search term history should be saved via a REST API. Start by creating an API using Loopback with a resource called `searches`. This resource should have 2 attributes: `term` (string) and `createdAt` (date). When you click the search button, hit the `POST /api/searches` endpoint. Somewhere on the page (maybe the sidebar), display a list of all search terms via the `GET /api/searches` endpoint. Whenever a search is made, this list of searches should be updated using one of the approaches we went over in class. This list should also be rendered using Handlebars, and each item in the list should show both the search term and the date the search was made.

## Folder Structure

Please structure your assignment like the following:

- /itp404-assignment4
  - /client
    - index.html
    - /css
      - main.css
    - /src
      - main.js
      - jquery script
      - handlebars script
  - /api (created by Loopback)

## Submission

Create a repo on Github called __itp404-assignment4__ and upload your files. Send an email to the TA and myself with the Github URL. As always, assignments are due the following Tuesday at midnight.
