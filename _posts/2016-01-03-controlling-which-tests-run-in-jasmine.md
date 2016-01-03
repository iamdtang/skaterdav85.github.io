---
layout: post
title: Controlling Which Tests Run In Jasmine
date: 2016-01-03
description: TBA
keywords: jasmine, single test, exclude tests, focus, focused, specs, fit, fdescribe, xit, xdescribe, karma
---

When working with Jasmine, you might find yourself wanting to control which
tests execute. One way to do this is to temporarily comment out tests that you
don't want to execute. This works, but it can be quite tedious if you have a
lot of tests, and you may forget to uncomment it back. There's a better way.
Let me show you.

## Excluding Tests / Specs

If you want to exclude a specific test, simply use `xit()` instead of `it()`.
The `x` means exclude.

```js
describe("description", function() {
  xit("description", function() {

  });
});
```

If you want to exclude an entire `describe` block, use `xdescribe()` instead
of `describe()`.

```js
xdescribe("description", function() {
  it("description", function() {

  });

  it("description", function() {

  });
});
```

When you exclude tests, these tests will be noted as "skipped". If you are
using Jasmine with Karma, the output on the terminal will look like this:

![skipped test](/images/skipped-test.png)

## Only Running Specific Tests / Specs

If you want to run a specific test, use `fit()` instead of `it()`. The `f`
stands for focused.

```js
describe("description", function() {
  fit("test 1", function() {

  });

  it("test 2", function() {

  });
});
```

In the example above, only test 1 will execute. You can use as many `fit()`
calls as you would like and only those tests will execute. Similar to when you
exclude tests, if you are using Jasmine with Karma, the output on the terminal
will note how many tests executed and how many were skipped.

What if you want to only run a specific `describe()` block? As you might guess,
use `fdescribe()` instead of `describe()`.

```js
fdescribe("description", function() {
  it("test 1", function() {

  });

  it("test 2", function() {

  });

  it("test 3", function() {

  });
});
```

It is also worth noting that you can have focused and unfocused tests/specs
inside nested `fdescribe()` blocks. When you do this, only the focused tests
will run. For example:

```js
fdescribe("description", function() {
  fdescribe("description", function() {
    it("test 1", function() {

    });

    fit("test 2", function() {

    });
  });

  fit("test 3", function() {

  });

  it("test 4", function() {

  });
});
```

In the example above, only test 2 and test 3 will run.

If your `fdescribe()` block only has a single test/spec, you can just use
`it()` and that test will execute.

```js
fdescribe("description", function() {
  fdescribe("description", function() {
    it("test 1", function() {

    });
  });

  fit("test 2", function() {

  });

  it("test 3", function() {

  });
});
```

In the example above, only test 1 and test 2 will execute.
