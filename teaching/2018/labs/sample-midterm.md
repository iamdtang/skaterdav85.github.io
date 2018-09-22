---
layout: assignment
title: Sample Midterm
date: 2018-09-21
---

### Client-side Templating

Download the [starter files](/teaching/2018/labs/midterm-starter.zip).

Make an Ajax request to [this endpoint](https://thejsguy.com/teaching/2018/api/restaurants.json) and render the array of restaurants in the `data` attribute using client-side templating with Handlebars.js. Display all attributes of each restaurant. The `ownedBy` attribute should be rendered as an unordered list. The `yelpPage` attribute should be rendered as a link that opens in a new tab. The text of this link should say "Check us out on Yelp". If the restaurant accepts Apple Pay, display an Apple icon. Otherwise, display the text "No Apple Pay". While the response is loading, display "Loading...".

Push this code up to a repo named `itp404-lab2-part1`.

### Ember.js

Create a new Ember app and install [`ember-cli-mirage`](http://www.ember-cli-mirage.com/docs/v0.4.x/). Next, replace the contents of `mirage/config.js` with the following:

```js
import { Response } from 'ember-cli-mirage';

export default function() {
  this.namespace = 'api';

  let profile = {
    name: 'Ed Winters',
    instagram: 'earthinged'
  };

  this.get('/profile', () => {
    return new Response(200, {}, profile);
  });

  this.patch('/profile', (schema, request) => {
    let body = request.requestBody.split('&').reduce((hash, pair) => {
      let [ key, value ] = pair.split('=');
      hash[key] = value;
      return hash;
    }, {});

    Object.assign(profile, body);
    return new Response(200, {}, profile);
  });
}
```

You don't have to look at this in much detail. Just know that this creates 2 API endpoints: `GET /api/profile` and `PATCH /api/profile`.

Next, create a route named `profile`. This page should display all attributes from `GET /api/profile`. On this page, display a link that says "Edit Profile". Clicking this link should take users to a nested route named `profile.edit`.

The `profile.edit` page should display a form populated with the profile data. There should be text fields for `name` and `instagram`. When the form is submitted, make the Ajax request `PATCH /api/profile`. On success, transition back to the `profile` route where we can the updated profile. There should be no page refreshes.

Make sure that when the user navigates to the `profile.edit` page, the template from the `profile` route doesn't change as the user fills out the form. It should only update when the user saves the changes.

Push this code up to a repo named `itp404-lab2-part2`.

Email both repo links to the TA and myself.
