---
layout: post
title: Flattening Arrays in JavaScript with flat() and flatMap()
date: 2019-03-09
description: This post covers two new methods in ES2019 for flattening JavaScript arrays, flat and flatMap.
keywords: flat vs flatMap, flat, flatMap, map, JavaScript, ES2019, functional programming
image: javascript
twitter_image: javascript.png
twitter_image_alt: JavaScript logo
card_style: summary
---

As of ES2019, there are two new methods on arrays:  [`Array.prototype.flat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) and [`Array.prototype.flatMap()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap).

## The `Array.prototype.flat()` Method

The `flat()` method can flatten a multidimensional array. For example:

```js
[[1, 2], [3, 4, 5], [6]].flat();
// [1, 2, 3, 4, 5, 6]
```

You can even flatten multiple levels deep by passing a depth argument to `flat()`:

```js
[[1, 2], [3, [4, 5]], [6]].flat(2);
// [1, 2, 3, 4, 5, 6]
```

Here, the depth is 2 since the array at index 1 contains the array `[4, 5]`.

## The `Array.prototype.flatMap()` Method

The `flatMap()` method is like calling `map()` followed by calling `flat(1)`. For example:

```js
['Hello', 'World'].flatMap(word => word.split(''));
// ['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd']
```

If we were to first call `map` on this array, this is what we'd get:

```js
['Hello', 'World'].map(word => word.split(''));
// [['H', 'e', 'l', 'l', 'o'], ['W', 'o', 'r', 'l', 'd']]
```

Then, if we call `flat(1)` on this resulting array, we'd get the same result as when we called `flatMap()`:

```js
[['H', 'e', 'l', 'l', 'o'], ['W', 'o', 'r', 'l', 'd']].flat(1);
// ['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd']
```

So, `flatMap()` is like calling `map` followed by `flat(1)`.

## Writing Your Own `flatMap()` Function

Prior to the addition of `flatMap()` to JavaScript, I had a `flatMap()` utility function in one of my projects. The following was my implementation:

```js
function flatMap(array, callback) {
  return array.reduce((accumulator, item) => {
    return accumulator.concat(callback(item));
  }, []);
}
```

And you could use it as such:

```js
flatMap(['Hello', 'World'], word => word.split(''));
// ['H', 'e', 'l', 'l', 'o', 'W', 'o', 'r', 'l', 'd']
```

You could also use [`flatMap()` in Lodash](https://lodash.com/docs/4.17.11#flatMap), which I imagine is more robust and faster.

## A Practical Example of `flatMap()`

One situation I have found `flatMap()` to be useful is when dealing with time series data. For example, imagine you get the following JSON from an API:

```json
[
  {
    "timestamp": "2019-01-15",
    "purchases": [
      {"product": "Product 1", "total": 20, "time": "09:00"},
      {"product": "Product 1", "total": 60, "time": "12:00"}
    ]
  },
  {
    "timestamp": "2019-01-16",
    "purchases": [
      {"product": "Product 1", "total": 40, "time": "10:00"},
      {"product": "Product 2", "total": 30, "time": "11:00"}
    ]
  },
  {
    "timestamp": "2019-01-17",
    "purchases": [
      {"product": "Product 1", "total": 10, "time": "14:00"},
      {"product": "Product 2", "total": 20, "time": "17:00"}
    ]
  }
]
```

If I wanted to plot this data on a chart, I might need to sum the `total` for each day and collect those values into an array, depending on the charting library. For the JSON above, that array would be `[80, 70, 30]`. With `flatMap()`, we can produce that!

```js
json.flatMap(({ purchases }) => {
  return purchases.reduce((sum, { total }) => sum + total, 0);
});
// [80, 70, 30]
```
