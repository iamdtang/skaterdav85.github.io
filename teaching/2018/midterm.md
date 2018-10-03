---
layout: assignment
title: Midterm
date: 2018-09-29
---

## Part 1 - Client-side Templating

Download the [starter files](/teaching/2018/labs/midterm-starter.zip).

Make an Ajax request to [this endpoint](/teaching/2018/api/v2/restaurants.json) and render each restaurant using client-side templating with Handlebars.js.

* Display `name` and `city`
* `owners` should be rendered as an unordered list
* `yelp` should be rendered as a link that opens in a new tab with the text "Check us out on Yelp"
* Use a Handlebars helper to build a link to Instagram using the `instagram` property. The full URL will be something like `https://www.instagram.com/{instagram}`. See the last example in the section "HTML Escaping" on the [Handlebars documentation](https://handlebarsjs.com/#html-escaping).
* If `caters` is `true`, display "Caters". Otherwise, display "Does not cater".
* While the response is loading, display "Loading..."

## Part 2 - Ember.js

Create a new Ember app and install [`ember-cli-mirage`](http://www.ember-cli-mirage.com/docs/v0.4.x/).

Build a mock REST API with Mirage for a `product` resource for the following operations:

* listing all products
* viewing a single product's details

This API should have a namespace of `api/v1`.

Use a Mirage factory and create randomized values for the following attributes using [faker.js](https://github.com/marak/Faker.js/).

* `price`: use `price` under `faker.commerce`
* `name`: use `productName` under `faker.commerce`
* `color`: use `color` under `faker.commerce`
* `material`: use `productMaterial` under `faker.commerce`

Also add a `slug` property as follows:

```js
slug() {
  return faker.helpers.slugify(this.productName);
}
```

This will build a URL slug from `productName`. For example, if `productName` is "Incredible Soft Soap", `slug` would end up being `Incredible-Soft-Soap`.

Next, build out the functionality for listing all products and viewing more details about a product.

The URLs for each page should be:

* product list - /
* product details - /products/:slug

The product list page should only show `name` and `price`. The product detail page should show `name`, `price`, `color`, and `material`.

Lastly, add a simple header and footer that displays on all pages without duplicating code on every route template.

## Submission

For part 1, zip up your folder and name it "part1.zip".

For part 2, zip up your folder and put it in Google Drive or Dropbox. Give me the proper permissions or make it a public link.

Email me both links.
