---
layout: assignment
title: Assignment 7
---

For this assignment, you will enhance the `StarRating` component that [we built together in class last week (see the `class` branch)](https://github.com/ITP-404-Fall-2020-Demos/week9) and write tests for it.

First, update the component by adding a `starCount` prop that defaults to 5, so that users can render any number of stars.

Next, write the following tests.

```js
test('rendering 5 stars by default', () => {});

test('rendering a specified number of stars', () => {
  // set the starCount prop to a value that isn't the default 5
  // and verify that many stars were rendered
});

test('rendering 5 empty stars', () => {});

test('rendering 5 filled stars', () => {
  // verify that the number of filled stars rendered equals the number in the "value" prop
  // when the "value" prop is greater than 0
});

test('rendering 3 filled stars and 2 empty stars', () => {
  // verify that the number of filled stars rendered equals the number in the "value" prop
  // when the "value" prop is greater than 0
});

test('clicking on an empty star', () => {});

test('clicking on a filled star', () => {});
```

## GitHub Classroom Repo

[https://classroom.github.com/a/fP9LJCYC](https://classroom.github.com/a/fP9LJCYC)

## Continuous Integration

Lastly, hook your repo up with GitHub Actions and add a status badge to the top of the README file.
