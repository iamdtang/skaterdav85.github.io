---
layout: post
title: 5 Ways Unit Testing Can Help You
date: 2016-01-28
description: Have you ever been on a project where you make one change and later realize you broke something else? It feels like you're playing whack-a-mole. In today's post, I'd like to introduce you to some of the benefits of unit testing and why you should get started with it right now.
keywords: javascript unit testing, why should I unit test, reasons to unit test, mocha, karma, jasmine, chai
---

Have you ever been on a project where you make one change and later realize you broke something else? It feels like you're playing whack-a-mole. Working on a JavaScript project like this is no fun at all. I've worked on plenty of projects like this, some of which I wrote all code. That's when I learned about automated testing, and specifically unit testing. Once I got into unit testing and following the test driven development (TDD) methodology, it completely changed the way I wrote code. In today's post, I'd like to introduce you to some of the benefits of unit testing and why you should get started with it right now.

First, let me quickly define what is unit testing. Unit testing is a method of testing individual units of code, typically functions or classes, in isolation. They can be repeatedly run in seconds. I also mentioned test driven development, also known as TDD. TDD is an approach to writing unit tests first before any implementation code. The general workflow of TDD is:

1. Write a test and watch it fail
2. Write the minimal amount of code to make that test pass
3. Go back to step 1

Unit testing doesn't require you to follow TDD, but they often go hand in hand. The reasoning behind this is that if you write your tests first before any implementation code, you are guaranteed to have tests whereas if you try and write them after the fact, you might not write tests that cover every aspect of the unit at hand. For now, don't worry too much about TDD. We'll look at that again in a future post. Let's look at the advantages of unit testing.

## 1. Quick Feedback Loop

If you're not writing automated tests now, then you are probably testing your code manually. This works fine for small projects, but this approach doesn't scale very well for medium to larger applications. You end up having to test more use cases, more pages, and it is really easy to forget something, not to mention it can be very time consuming. Having unit tests in place helps offload a lot of this manual testing that can be error prone and you'll get feedback much quicker! Unit tests can run very quickly. To give you some perspective, at my last job I had written about 800 unit tests and these ran in under 2 seconds. Every time I made a change to a file, it would trigger the tests to run and show an OSX notification in the upper right hand corner of my screen telling me whether all the tests passed or not. If you made a change to your code base now, how confident are you that you won't break something without any tests in place? This brings us to the next advantage, developing without fear.

## 2. Develop Without Fear

At the beginning of this post I described a situation that you may have experienced yourself. That is, you try and fix one thing and realize you broke something else. Sometimes you don't even know you broke something until several days later. At that point, you don't know which change you made caused this new bug. This can be super frustrating! A benefit of having unit tests and high test coverage is that you can make a change to the code base and immediately get feedback if you broke something else or not. The higher test coverage you have, the more confident you can be that you didn't break something.

## 3. Modular and Readable Code

Unit testing also lends itself to having more modular and readable code. That is, functions and classes that do one thing really well. When you get into unit testing, you start thinking about the smallest building blocks of your application and begin by writing tests for those. These are things like models, services, and utility functions. Slowly you have more and more building blocks that become well tested and you can start assembling them together to form your application. This is as opposed to writing monolithic functions that do many things like making an AJAX request, manipulating the response, and rendering to the DOM. Something like this would be difficult to test because it does too many things. By trying to write tests for your logic immediately, you are forced to break things down a little bit so that they are easier to test. If you write your application first and try to write tests later, you'll find that many times this approach will not work. This is because the code wasn't written with testing in mind, and thus resulted in large chunks of code with many responsibilities.

## 4. Faster Bug Fixes

Imagine you are working on a function that receives data from a form and validates it. You have a few tests in place and need to write another test to handle some new data that will be added to the form. You've modified this function to handle this new scenario and your test passes, but then realize one of your other tests for this same function breaks. Would you rather have been notified immediately through a test suite like this, or would you rather have opened up the browser and filled out the form to find out whether your function worked as expected or not? I find doing the latter can get pretty tedious very quickly, and I'm sure you'll agree. By having unit tests in place, we can fix bugs like this much faster because of the quick feedback loop. Not only will you be a happier developer, but your boss will notice how quickly you are fixing bugs.

## 5. Documentation

Lastly, unit tests provide great documentation. Instead of maintaining long comments above each function that shows example usage, tests can often suffice as a form of documentation. You can easily see what the function / class is supposed to do along with a description. Writing code is much more fun in my opinion as opposed to maintaining comments or a README file.

## Conclusion

Hopefully I've convinced you of the benefits to writing unit tests. It can be a little tough getting started because of the shift in thinking, but it is something you can quickly learn and you'll grow to love. In the next post, we'll look at how to write your first unit test. Stay tuned!
