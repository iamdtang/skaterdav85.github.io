---
layout: post
title:  "End To End Testing with PhantomJS and CasperJS"
date:   2015-02-28
keywords: Phantom.js vs Casper.js, PhantomJS vs CasperJS, Phantom vs Casper, phantomjs vs casperjs, End to End testing Casper, e2e casper, end to end testing, e2e testing, functional testing, integration testing, testing with casper, casper vs phantom, casper.js vs phantom.js, casperjs vs phantomjs
image: casper
---

When it comes to testing in JavaScript, I would say that there are two types of tests: unit tests and end to end tests, which are also referred to as integration tests or functional tests depending on who you talk to and what articles you read. For me, I have found unit testing to be beneficial and relatively straightforward for code that does not involve the DOM much. Unit testing allows you to test modules in isolation and is great for (but not limited to) testing things like data structures, data manipulation, validation, etc. But how do you test JavaScript that heavily depends on the DOM and user interactions? How do you test that the different modules of your application work together? This is where end to end testing comes in. In this article we will look at how we can set up a simple end to end testing system using CasperJS, which sits on top of PhantomJS.

## PhantomJS vs CasperJS

First, what is the difference between PhantomJS and CasperJS? This was a question I had when I first started looking into end to end testing. In my typical unit test suite, I usually use Karma with PhantomJS. I knew that PhantomJS was being used and provided a headless browser, but that was the extent of my knowledge. Looking at the PhantomJS site, you will see script examples like:

```js
console.log('Loading a web page');
var page = require('webpage').create();
var url = 'http://www.phantomjs.org/';
page.open(url, function (status) {
  //Page is loaded!
  phantom.exit();
});
```

PhantomJS is a scriptable, headless browser with a JavaScript API. It can be used for things like web scraping like in this small example. What PhantomJS doesn't have is testing utilities. This is where CasperJS comes in and provides testing utilities like assertions, organizing tests, and keeping track of tests that fail and succeed.

## Installation

To start testing with CasperJS, you need to install Node, then PhantomJS, and lastly CasperJS.

#### Installing PhantomJS

```
sudo npm install phantomjs -g
```

You can verify that PhantomJS installed correctly by running `phantomjs --version` from the command line.

#### Installing CasperJS

```
sudo npm install casperjs -g
```

You can verify that CasperJS installed correctly by running `casperjs --version` from the command line.

## Example 1

Let's look at an example where we test Amazon's search and result pages. When a search is made from the Amazon home page, the title tag on the results page should be "Amazon.com: javascript". To start, create a file called `test1.js`.  In this file, paste the following:

```js
casper.test.begin('Testing Amazon Search and Results pages', 3, function(test) {
  casper.start('http://amazon.com', function() {
    this.fill('form#nav-searchbar', {
      'field-keywords': 'javascript'
    }, true);
  });

  casper.then(function() {
    test.assertTitle('Amazon.com: javascript', 'Amazon search results page doesnt have expected title');
  });

  casper.run(function() {
    test.done();
  });
});

```

Looking at this code by itself, you can probably figure out what is going on. There are a few things to point out though. `this.fill()` allows you to fill out a form and submit it. The API for this is:

`this.fill([String: Selector], [Object: Form Data], [Boolean: Form Submission])`

* __Selector__: This should be a selector to the form object
* __Form Data__: An object where the key is the form object's name and value is the value you want to fill in
* __Form Submission__: True if you want the form to submit, false if you don't

To run the test, simply run from the command line:

```
casperjs test test1.js
```

## Example 2

Let's do a little more in our test. Let's also assert that the text input is pre-populated with the user's search term and that 16 results are displayed at a time.

```js
casper.test.begin('Testing Amazon Search and Results pages', 3, function(test) {
  casper.start('http://amazon.com', function() {
    this.fill('form#nav-searchbar', {
      'field-keywords': 'javascript'
    }, true);
  });

  casper.then(function() {
    test.assertTitle('Amazon.com: javascript', 'Amazon search results page doesnt have expected title');
    test.assertField('field-keywords', 'javascript', 'Input doesnt repopulate with the search term');
    test.assertElementCount('.s-result-item', 16, 'There should be 16 results displayed at a time');
  });

  casper.run(function() {
    test.done();
  });
});
```

Here we put a few more assertions in the same test. You can find a list of all the different assertions that CasperJS offers in the [tester module documentation](http://docs.casperjs.org/en/latest/modules/tester.html).

When writing your tests, you may run into an error called a __dubious error__. I ran into this error when I added more assertions to my test. This error occurs when the number of planned tests doesn't match the number of executed tests. To fix this, simply change the number in the second argument of `casper.test.begin()` to match the number of assertions you have.

## Closing Thoughts

When it comes to unit testing in JavaScript, I typically like to have 1 assertion per test so that each test tests a single aspect of a function or method. When it comes to end to end testing, these types of tests are much slower. In this case, I think that multiple assertions per test is better so that your tests can run much faster.

CasperJS makes end to end testing pretty easy. However, these types of tests are naturally slow. Because they are slow, I think end to end tests are great for testing the critical paths, but I wouldn't attempt to write an end to end test for every aspect of my application. Instead, focussing more on unit testing will give you more bang for your buck, and you can write end to end tests for critical paths of a site like making sure a user is able to search for products and checkout successfully.

Lastly, end to end tests are brittle. In more complex applications with lots of JavaScript, you need to wait for the JavaScript to execute before working with the page and making assertions. To do this in CasperJS, you will have to add `casper.wait()` statements:

```js
casper.wait(1000, function() {
	// assume some JavaScript or AJAX has finished loading
});
```

Not a big deal, but sometimes things take longer to load than usual. If this is the case, your end to end tests might not always pass every single time. Hence, these tests aren't always consistent. Also, because end to end tests do rely on selectors and the HTML, if the UI changes slightly in your application, your tests might break, even if the functionality isn't broken.

End to end testing is essentially testing from the outside in. Unlike unit tests, if a test fails, it doesn't really tell you what broke. It just tells you that something broke and it is up to you to figure out what exactly broke. Still, being automatically notified that a critical path is broken is very valuable.

What type of testing do you do? Please let me know in the comments!

## References

* [tester module with the different CasperJS assertions](http://docs.casperjs.org/en/latest/modules/tester.html)
