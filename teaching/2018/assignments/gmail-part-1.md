---
layout: assignment
title: Recreating Gmail - Part 1
date: 2018-10-09
---

In this assignment, you will be recreating a simplified version of the Gmail interface.

To start, create the following APIs in Mirage:

* GET /api/emails
* GET /api/emails/:id
* POST /api/emails
* DELETE /api/emails/:id

Use a factory to create emails with the following attributes:

* id (numeric)
* from (an email string)
* to (an email string)
* subject (string)
* message (string)

Use faker.js to randomly create these values. Make sure the message is at least a paragraph long.

In the default scenario, set up the API to start with 20 emails.

## The Navigation

Create a navigation that is shown on all pages. The navigation should have the following links:

* Inbox
* Sent
* Trash

The Inbox navigation item should link to the `index` route. The Sent navigation item should link to the `sent` route. The Trash navigation item should link to the `trash` route. The Sent and Trash pages will be empty for now, but they should show the navigation on the left.

## Listing Emails

When you visit the `index` route, display a list of emails showing the `from` email and a preview of the message. Only show a portion of the message followed by ellipsis [using CSS](https://css-tricks.com/snippets/css/truncate-string-with-ellipsis/).

## Email Details

When you click on an email in the list, it should take you to an email detail page that displays all of the attributes. This page should have a back button at the top of the screen to link back to the list of emails similar to that on Gmail.

## Deleting a Single Email

At the top of the screen of the Email Details page, display a trash icon. When this icon is clicked, it should delete the email and redirect back to the `index` route without a page refresh.

## Creating an Email

Create a "Compose" link that is shown above the navigation. In Gmail, this opens in an overlay that is fixed to the bottom of the window. This requires learning a bit more, so for now, have this link take us to a page that shows a form for writing an email. This form should have fields for `from`, `to`, `subject`, and `message`. When the form is submitted, save the model, which will utilize the `POST /api/emails` endpoint. Redirect to the `index` route and you should see this email in the list. Normally, this list doesn't show emails that you have sent. We will address this in a future assignment.

## Styling

You don't have to make it look exactly like Gmail, but try and get the placement of things to be similar.

## Deployment

Deploy your app using [ember-cli-surge](https://github.com/kiwiupover/ember-cli-surge).

1. Install the addon: `ember install ember-cli-surge`
2. Modify the CNAME file so that the domain is `{usc email prefix}-gmail.surge.sh`. For example, mine would be `dtang-gmail.surge.sh`.
3. Enable Mirage in the production environment like we did in class
3. Deploy your project with: `ember surge`
4. Verify your project works on Surge

## Submission

Create a repo on GitHub called __itp404-gmail__ and upload your files. Send an email with the GitHub repo URL and the Surge URL to the TA and myself.
