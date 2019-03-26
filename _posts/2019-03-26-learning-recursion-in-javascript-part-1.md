---
layout: post
title: Learning Recursion in JavaScript Part 1 - The Obligatory Factorial Function
date: 2019-03-26
description: Does recursion make your head spin? Haven't used it in awhile and want a refresher? If so, this series is for you.
keywords: recursion, JavaScript, call stack, RangeError, factorial
image: javascript
twitter_image: javascript.png
twitter_image_alt: JavaScript logo
card_style: summary
---

Ah, recursion, one of those topics that makes many developers' heads spin 🤯 . Recursion is something I don't end up using too often, but when I do, I find it to be a powerful technique to have under my programming belt. It is a skill that is also worth learning since it may come up in interviews.

So what is recursion? Recursion occurs when a function keeps calling itself until some condition is met. This condition is often referred to as the base case. Without the base case, the function would never stop calling itself resulting in what's known as a stack overflow error. The base case is really important and returns a value to end the recursive process.

Let's look at an example. The "Hello World" of recursion is a factorial function, so let's start with that.

In math, the factorial of a positive integer `n`, denoted by `n!`, is the product of all positive integers less than or equal to `n`. For example, 5 factorial, denoted as `5!`, is `5 x 4 x 3 x 2 x 1` which equals 120. It's also worth noting that `0!` is 1.

We can write a factorial function using a `for` loop as such:

```js
function factorial(n) {
  let product = 1;

  for (let i = n; i > 0; i--) {
    product = product * i;
  }

  return product;
}

factorial(5); // 120
factorial(1); // 1
factorial(0); // 1
```

The implementation above uses a `for` loop that iterates from `n` down to 1, building up the product.

One interesting thing about code written using loops is that they can also be written recursively. [In fact, some languages such as Elixir don't even have looping constructs and rely completely on recursion.](/2019/01/13/learning-how-to-loop-in-elixir-through-recursion.html) Let's look at what the factorial function looks like when implemented using recursion:

```js
function factorial(n) {
  if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

factorial(5); // 120
factorial(1); // 1
factorial(0); // 1
```

In this implementation, the recursion happens in the `else` block, where the `factorial` function is calling itself. If we were to expand this call stack out, it would look like this:

```js
factorial(5) = 5 * factorial(4)
factorial(5) = 5 * (4 * factorial(3))
factorial(5) = 5 * (4 * (3 * factorial(2)))
factorial(5) = 5 * (4 * (3 * (2 * factorial(1))))
factorial(5) = 5 * (4 * (3 * (2 * (1 * factorial(0)))))
factorial(5) = 5 * (4 * (3 * (2 * (1 * 1))))
```

Here, the base case is when `n === 0`, in which `factorial` isn't called again and `1` is simply returned. Without this base case, a stack overflow error would occur, which looks like the following in JavaScript:

> RangeError: Maximum call stack size exceeded

I hope you found this post useful. This isn't the most practical application of recursion, but I find it to be a great, basic example to illustrate how recursion works. Stay tuned for the next post in my series on recursion, as we'll continue to look at more examples and facets of recursion.
