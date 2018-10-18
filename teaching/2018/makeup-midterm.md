---
layout: assignment
title: Makeup Midterm
date: 2018-10-18
---

## Part 1 - Client-side Templating

Download the [starter files](/teaching/2018/labs/midterm-starter.zip).

Make an Ajax request to [this endpoint](/teaching/2018/api/v3/bookmarks.json) and render each bookmarked restaurant using client-side templating with Handlebars.js.

* Display `name` and `city`
* `owners` should be rendered as an unordered list. If the owner has a first and last name, display the first and last name. Otherwise, display their nickname.
* `yelp` should be rendered as a link that opens in a new tab with the text "Check us out on Yelp"
* Use a Handlebars helper to build a link to Instagram using the `instagram` property. The full URL will be something like `https://www.instagram.com/{instagram}`. See the last example in the section "HTML Escaping" on the [Handlebars documentation](https://handlebarsjs.com/#html-escaping).
* While the response is loading, display "Loading..."

## Part 2 - Ember.js

Create a new Ember app and install [`ember-cli-mirage`](http://www.ember-cli-mirage.com/docs/v0.4.x/).

Build a mock REST API with Mirage for a `user` resource for the following operations:

* listing all users. This endpoint should return 20 users.
* viewing a user's details

This API should have a namespace of `0.0.1`.

Use a Mirage factory and create randomized values for the following attributes using [faker.js](https://github.com/marak/Faker.js/).

* `firstName`: use `firstName` under `faker.name`
* `lastName`: use `lastName` under `faker.name`
* `jobTitle`: use `jobTitle` under `faker.name`
* `phoneNumber`: use `phoneNumber` under `faker.phone`

Also add an `id` property as follows:

```js
id() {
  return faker.helpers.slugify(`${this.firstName} ${this.lastName}`);
}
```

This will build a URL slug from `firstName` and `lastName` for `id`, such as "David Tang".

Next, build out the functionality for listing all users and viewing more details about a user.

The URLs for each page should be:

* user list - /users
* user details - /users/:id

The user list page should only show the first and last name. The user detail page should show all attributes.

Create an About page with something unique. If you couldn't figure out anything in Part 1 or 2 of the midterm, explain yourself on the About page for partial credit.

Lastly, add a header, navigation, and footer that displays on all pages without duplicating code on every route template. The navigation should have links to the home page (the user list page) and the About page.

## Submission

For part 1, zip up your folder and name it "part1.zip".

For part 2, push it up to GitHub.

Email me both links.
