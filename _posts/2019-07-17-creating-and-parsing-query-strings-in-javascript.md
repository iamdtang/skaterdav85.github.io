---
layout: post
title: Creating and Parsing Query Strings in JavaScript
date: 2019-07-17
description: The URLSearchParams and URL classes can be used to create and parse query strings in JavaScript in both the browser and Node.
keywords: query string, javascript, browser, node, URLSearchParams, URL, search params
image: javascript
twitter_image: javascript.png
twitter_image_alt: JavaScript logo
card_style: summary
---

The [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) and [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL) classes can be used to create and parse query strings in JavaScript in both the browser and Node.

## Creating a Query String

Not too long ago, in order to create a query string we had to do messy string concatenation (although it got better much better with template literals) or rely on a library. Now, we can use the `URLSearchParams` class.

```js
let qs = new URLSearchParams();
qs.append('start', 'now-2m');
qs.append('end', 'now');
qs.toString(); // 'start=now-2m&end=now'
```

## Parsing a Query String

Now let's say we have a URL and we need to manually parse the query string. Instead of manually parsing the URL string, we can use the `URL` class.

```js
let url = new URL('https://mysite.com/results?page=1&page-size=10');
let qs = url.searchParams;
qs.get('page'); // 1
qs.get('page-size'); // '10'
```

The `searchParams` property on a `URL` instance is an instance of `URLSearchParams`.

One last thing to mention is browser support, which is pretty good for both of these classes. Check out their support on [Can I use](https://caniuse.com/).

* [Can I use: `URLSearchParams`](https://caniuse.com/#search=URLSearchParams).
* [Can I use: `URL`](https://caniuse.com/#search=URL).
