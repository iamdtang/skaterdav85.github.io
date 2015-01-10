---
layout: post
title:  "Writing Testable JavaScript - Part 1"
date:   2015-01-07
categories: JavaScript, Testing
keywords: Writing Testable JavaScript, JavaScript testing, JavaScript Unit Testing, How to unit test JavaScript, Jasmine unit testing
---

Getting started with unit testing is difficult. I know that when I first got into it, I had a hard time going from the tutorial and documentation examples to testing real code I was writing. I continually asked myself, how do I unit test this? For those who feel stuck on how to go about unit testing your JavaScript, I'd like to help fix that through a series of blog posts on how to write unit testable JavaScript. Hopefully as you read these posts, you can incorporate these techniques and improve your code base.

## Abstract DOM code from logic

Imagine you have something written like this:

```js
$('')
```

