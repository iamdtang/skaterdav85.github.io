---
layout: post
title: Learning Recursion in JavaScript Part 2 - Sum an Array of Numbers 3 Ways
date: 2019-03-31
description: Does recursion make your head spin? Haven't used it in awhile and want a refresher? If so, this series is for you.
keywords: recursion tutorial, JavaScript, sum array of numbers
image: javascript
twitter_image: javascript.png
twitter_image_alt: JavaScript logo
card_style: summary
---

In the last post, [Learning Recursion in JavaScript Part 1 - The Obligatory Factorial Function](/2019/03/26/learning-recursion-in-javascript-part-1.html), we learned that code implemented with loops can also be written with recursion. In this post, let's look at an interview problem I was given once. The problem was, "Write a function that sums an array of numbers".

My first implementation was using a standard `for` loop:

```js
function sum(array) {
  let sum = 0;

  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }

  return sum;
}

sum([1, 2, 3, 4, 5]); // 15
```

Right after, I was asked, "Can you think of another way to sum an array of numbers without a loop?". I solved it using `Array.prototype.reduce`:

```js
function sum(array) {
  return array.reduce((sum, num) => sum + num, 0);
}

sum([1, 2, 3, 4, 5]); // 15
```

After this implementation, I was asked, "Can you think of one more way to sum an array of numbers without a loop or reduce?". At the time, recursion hadn't occurred to me. After 30 seconds of silence of me trying to think of another way, the interviewer said, "Are you familiar with recursion?". I was, thankfully, and solved it with recursion:

```js
function sum(array) {
  if (array.length === 0) {
    return 0;
  } else {
    return array[0] + sum(array.slice(1));
  }
}

sum([1, 2, 3, 4, 5]); // 15
```

In this implementation, the recursion happens in the `else` block, where the `sum` function calls itself. Each time `sum` is called, its argument is an array that leaves off the first element (index 0) via the [`splice()` method on arrays](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice). Thus, the array passed to `sum` continually gets smaller and smaller until it hits the base case where the array is empty and 0 is returned.

If we were to expand this call stack out, it would look like this:

```js
sum([1, 2, 3, 4, 5]) = 1 + sum([2, 3, 4, 5])
sum([1, 2, 3, 4, 5]) = 1 + (2 + sum([3, 4, 5]))
sum([1, 2, 3, 4, 5]) = 1 + (2 + (3 + sum([4, 5])))
sum([1, 2, 3, 4, 5]) = 1 + (2 + (3 + (4 + sum([5]))))
sum([1, 2, 3, 4, 5]) = 1 + (2 + (3 + (4 + (5 + sum([])))))
sum([1, 2, 3, 4, 5]) = 1 + (2 + (3 + (4 + (5 + 0))))
```

We can also implement this without the `slice()` method and instead use destructuring and rest parameters:

```js
function sum(array) {
  if (array.length === 0) {
    return 0;
  } else {
    let [head, ...tail] = array;
    return head + sum(tail);
  }
}

sum([1, 2, 3, 4, 5]); // 15
```

## Conclusion

So there you have it, 3 ways to sum an array of numbers. I think most would agree that the simplest solution is using `Array.prototype.reduce`, but nevertheless this is another good exercise to illustrate how loops can implemented with recursion. Stay tuned for the next post in my series on recursion, as we'll continue to look at more examples and facets of recursion.
