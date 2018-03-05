---
layout: assignment
title: Ember and Reddit 3 - Helpers, Computed Properties, and Components
date: 2017-10-23
---

Create a branch off of assignment 6 called `assignment7`:

```
git checkout -b assignment7
```

## Display Each Post's Date with a Helper

Display the date of each post in a relative time using the [moment.js](https://momentjs.com/#relative-time) library, i.e.

* 6 years ago
* a day ago
* an hour ago

Start by creating a helper that can be used like the following:

```hbs
{% raw %}
{{relative-time post.created}}
{% endraw %}
```

The post date can be found in the `created` property. To convert this property to a relative time using moment.js:

```js
// post.created is a unix timestamp in seconds
// moment() expects a timestamp in milliseconds
moment(post.created * 1000).calendar();
```

## Sorting the List of Posts

Display the list of posts sorted in descending order by their `score` property using a computed property (CP). Be sure that when new searches are made, they are always sorted in descending order.

Hint: Check out [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)

## A `reddit-post` Component

In the `each` loop in your template to render out each post, take the template code and make it its own component, like the following:

```hbs
{% raw %}
{{reddit-post post=post}}
{% endraw %}
```

This will modularize our template a little bit.

## Scoring a Post with a Reusable `vote-control` Component

You know the up and down arrows with the score in the middle that you see on the left of each post for a given subreddit? You will be creating that as a reusable Ember component that can be used like the following:

```hbs
{% raw %}
{{vote-control score=post.score onvote=(action "changeScore")}}
{% endraw %}
```

This component is designed to work with anything, not just Reddit posts. This component will take in the score and display it. When the up arrow is clicked, it will invoke the `onvote` function with the new score. Define a `changeScore` action in `reddit-post`. This action will take the new score and set it on the post. You should see the score update. Likewise, do the same for when the down arrow is clicked.

Lastly, add some logic to the component so that if a user clicks the up arrow, they can only click the down arrow. If they click the down arrow, then they can only click the up arrow. This will prevent users from up-voting or down-voting for a given post more than once.

## Submission

```
git add --all
git commit -m 'your commit message here'
git push origin assignment7
```

Send an email to the TA and myself with a link to this branch.
