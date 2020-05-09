---
layout: post
title: Learning Recursion in JavaScript Part 5 - A Factorial Function with Tail Recursion
date: 2020-05-09
description: Does recursion make your head spin? Haven't used it in awhile and want a refresher? If so, this series is for you.
keywords: recursion, JavaScript, call stack, RangeError, factorial, tco, tail call optimization, tail recursion, proper tail calls
image: javascript
twitter_image: javascript.png
twitter_image_alt: JavaScript logo
card_style: summary
---

{% include recursion-series-intro.md %}

In the first post, [The Obligatory Factorial Function](/2019/03/26/learning-recursion-in-javascript-part-1.html), we looked at writing a `factorial(n)` function implemented with recursion. In this post, I wanted to show what that same recursive function would look like if it used tail recursion.

## What is a Tail Call?

A tail call is a function call that occurs at the end of another function. In the following code, the `bar()` call is a tail call:

```js
function foo() {
  return bar();
}
```

## What is Tail Recursion?

Tail recursion occurs when the tail call is recursive. For example, the `foo()` call is a tail call that is recursive:

```js
function foo() {
  return foo();
}
```

## `factorial(n)` Without Tail Recursion

To refresh ourselves, here is the implementation of the `factorial` function from [The Obligatory Factorial Function](/2019/03/26/learning-recursion-in-javascript-part-1.html) without tail recursion:

```js
function factorial(n) {
  if (n === 0) {
    return 1;
  }
  
  return n * factorial(n - 1);
}
```

This function does not have tail recursion because the last line is `n * factorial(n - 1)` as opposed to `factorial(...)`.

## `factorial(n)` With Tail Recursion

Here is the implementation with tail recursion:

```js
function factorial(n, total = 1) {
  if (n === 0) {
    return total;
  }

  return factorial(n - 1, n * total);
}
```

## Why does Tail Recursion matter?

When a recursive function uses tail recursion, it _can_ be optimized by the JavaScript engine. This optimization is called Tail Call Optimization (TCO). The reason I say _can_ is because Tail Call Optimization is part of the JavaScript language specification but [it isn't supported by very many browsers at the time of this writing](https://kangax.github.io/compat-table/es6/#test-proper_tail_calls_(tail_call_optimisation)).

Every time we call a function, a stack frame is created, which is a frame of data that stores information about that function call. This stack frame gets pushed onto the call stack, which is a stack data structure that stores all active function invocations.

When a recursive function has Tail Call Optimization, the call stack won't continue to grow. To see this in action, visit the following two JSBin links in Safari with the Console open. Make sure your version of Safari is version 13 or higher.

* [`factorial(n)` with TCO](https://jsbin.com/baqecefofi/2/edit?js,console)
* [`factorial(n)` without TCO](https://jsbin.com/nuxavubetu/1/edit?js,console)

Click on "Run" in the upper right corner and compare the stack traces in each. Notice how in the example without TCO, the stack frames continue to grow? The call stack has a size limitation which depends on the JavaScript engine. If the call stack exceeds that size, then we get the error: `RangeError: Maximum call stack size exceeded`. The example with TCO ends up using less memory because the call stack doesn't continue to grow on each recursive call.

If you'd like to learn more about the details of TCO, check out these two posts that I found useful:

* [How to use Tail Call Optimizations in JavaScript](https://medium.com/javascript-in-plain-english/javascript-optimizations-tail-call-optimization-tco-471b4f8e4f37)
* [Tail call optimization in ECMAScript 6](https://2ality.com/2015/06/tail-call-optimization.html)


