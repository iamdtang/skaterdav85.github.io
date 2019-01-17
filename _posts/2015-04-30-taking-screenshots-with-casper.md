---
layout: post
title:  "Taking Screenshots with CasperJS"
date:   2015-04-30
keywords: screenshots with CasperJS, Casper screenshots, CasperJS screenshots, PhantomJS screenshots, screenshots with Phantom
image: casper
---

Lately I have been trying out more end-to-end / integration testing with CasperJS. Having these tests in place seems valuable for critical paths of an application but it can be pretty frustrating when sometimes tests pass and other times they fail. For me, the test results have not been consistent. Because CasperJS doesn't pop open a browser, it is difficult to know what exactly is going wrong. Many times I had a hunch that my tests were failing because of race conditions with the loading of the JavaScript of the pages under test. Then I discovered that CasperJS allows you take screenshots at any point during your test. This allows me to see if pages are fully rendering before assertions!

To take a screenshot in your test, simply use the `casper.capture()` method.

```js
casper.capture('screenshots/navigation.png');
```

So a full test with several screenshots might look something like this:

```js
casper.test.begin('Testing Amazon Search and Results pages', 1, function(test) {
  casper.start('http://amazon.com', function() {
    casper.capture('screenshots/amazon-search-1.png');
    this.fill('form#nav-searchbar', {
      'field-keywords': 'javascript'
    }, true);
    casper.capture('screenshots/amazon-search-2.png');
  });

  casper.then(function() {
    casper.capture('screenshots/amazon-search-3.png');
    test.assertTitle('Amazon.com: javascript');
  });

  casper.run(function() {
    test.done();
  });
});
```

In the test above, I am taking 3 screenshots. I like to name the images the same filename but suffixed with an incrementing number to identify the order that they were taken in.

One thing to note, if your screenshots look as if the pages under test were viewed on a mobile device, this is because PhantomJS ships with a default viewport of 400x300 and CasperJS does not override it, as mentioned in the [docs](http://casperjs.readthedocs.org/en/latest/modules/casper.html#viewportsize). To set the `viewportSize`, you can do the following at the top of your test script:

```js
casper.options.viewportSize = { width: 950, height: 950 };
```

Now CasperJS will render the pages under test on a browser that is 950x950, more like if you were viewing the site in a desktop browser.

Happy testing!

## Related Articles

* [End To End Testing with PhantomJS and CasperJS](2015/02/28/end-to-end-testing-with-phantomsjs-and-casperjs.html)
