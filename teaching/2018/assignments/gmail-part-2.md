---
layout: assignment
title: Recreating Gmail - Part 2
date: 2018-10-16
---

In this assignment, you will be working off of the same repo as [the last assignment](/teaching/2018/assignments/gmail-part-1) where you are recreating a simplified version of the Gmail interface.

## A `truncate-text` Helper

Instead of truncating the text via CSS, create a helper to do this. This way, the full message won't be in the DOM in the email list. Name the helper `truncate-text`.

## A `StarButton` Component

Create a component with the following API:

```hbs
{% raw %}
<StarButton
  @starred={{starred}}
  @onClick={{action "star"}} />
{% endraw %}
```

Next, implement this on the email list view so that emails can be quickly starred.

Add an attribute called `starred` to the `email` model. When the star button is clicked, each email instance should update and persist to the backend.

## Displaying Starred Emails

Update the email list view to display starred emails at the top in a section titled "Starred". The section below should contain all of the other emails. As part of this requirement, create a component for displaying a single email in the list and use it in both the starred and unstarred sections.

## Styling

You don't have to make it look exactly like Gmail, but try and get the placement of things to be similar.

## Deployment

Deploy your app to Surge as you did in the previous assignment.

## Submission

Push your code up to the same repo, which should be called __itp404-gmail__. Send an email with the GitHub repo URL and the Surge URL to the TA and myself.
