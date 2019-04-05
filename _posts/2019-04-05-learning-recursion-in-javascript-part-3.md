---
layout: post
title: Learning Recursion in JavaScript Part 3 - Flattening Arrays
date: 2019-04-05
description: Does recursion make your head spin? Haven't used it in awhile and want a refresher? If so, this series is for you.
keywords: recursion, tutorial, JavaScript, flatten array, flat, infinitely nested array
image: javascript
twitter_image: javascript.png
twitter_image_alt: JavaScript logo
card_style: summary
---

In this post, we're going to look at writing a function to flatten a nested array with an arbitrary depth. For example, let's say we have the following array:

```js
let array = [[1, 2], 3, [4, [5]]];
```

Let's write a function to flatten it as such:

```js
flat(array); // [1, 2, 3, 4, 5];
```

So before we get into writing this function, it is worth noting that as of ES2019, there is a new `Array.prototype.flat()` method for flattening arrays. I wrote a post about it called [Flattening Arrays in JavaScript with flat() and flatMap()](/2019/03/09/flattening-arrays-in-javascript-with-flat-and-flatMap.html) if you'd like to learn more about it. The `flat()` function that we will write in this post will behave a little bit differently, as it will completely flatten an array with any depth.

## Our `flat()` Function

So to start off, how would you go about flattening an array that is only one level deep? For example:

```js
let array = [[1, 2], 3, [4, 5]];
```

One way you could do it is using `Array.prototype.reduce()`:

```js
function flat(array) {
  return array.reduce((acc, item) => {
    return acc.concat(item);
  }, []);
}

let array = [[1, 2], 3, [4, 5]];
flat(array); // [1, 2, 3, 4, 5]
```

So how can we expand this implementation to flatten for an arbitrary depth? Let's look at the following array:

```js
let array = [
  [/* might have nesting */],
  100
];
```

The values in this array are in two possible states that we care about. That is, a value can either contain an array or not. If a value is an array, we want to keep flattening. If the value isn't an array, then there is nothing to flatten. This condition is our base case! The base case can be expressed in code as such:

```js
Array.isArray(item) ? flat(item) : item
```

Here we are using the ternary operator. If the item is an array, call the `flat()` function again. Otherwise, don't, which will stop the recursion. When we add this to our `flat()` function, it looks like this:

```js
function flat(array) {
  return array.reduce((acc, item) => {
    return acc.concat(
      Array.isArray(item) ? flat(item) : item
    );
  }, []);
}
```

## Flattening Arrays with an Arbitrary Depth

Our function works great, but let's take it a step further and allow for a specified depth to be passed in as an argument, similar to `Array.prototype.flat(depth)`.

Here is the implementation and an example of how to use it with and without a depth argument:

```js
function flat(array, depth, currentDepth = 0) {
  if (currentDepth === depth) {
    return array;
  }

  return array.reduce((acc, item) => {    
    return acc.concat(
      Array.isArray(item) ? flat(item, depth, currentDepth + 1) : item
    );
  }, []);
}

let array = [[1, 2], 3, [4, [5]]];

flat(array, 1); // [1, 2, 3, 4, [5]]
flat(array); // [1, 2, 3, 4, 5]
```

We've added 2 more parameters: `depth` and `currentDepth` which has a default value of 0. The `currentDepth` parameter is used to keep track of how deep we are recursing. Every time we recurse, we increment that number. Then, at the top of `flat()`, we do a check to see if `currentDepth` equals `depth`. If those values are equal, we stop the recursion. Otherwise, we keep going. If a `depth` argument isn't passed into `flat()`, `depth` will be `undefined`. Thus, `currentDepth`, which starts off at 0, will never equal `undefined`, and our function will flatten the array for however deep it is.

## Conclusion

Data that has some arbitrary level of nesting can often times be elegantly solved with recursion, such as the infinitely nested array in this post. When learning recursion, I have found that if often helps to look at the problem as if it weren't infinitely nested. For example, we first looked at the array in this post and solved it as if it had a depth of 1. Then, we determined what the condition was to recurse and when to stop (the base case).

Stay tuned for the next post in my series on recursion, as we'll continue to look at more examples and facets of recursion.
