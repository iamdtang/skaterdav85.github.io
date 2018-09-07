---
layout: post
title: Custom QUnit Assertions in Ember
date: 2018-09-06
description: This post covers creating custom QUnit assertions in Ember.
image: custom-assertions.png
image_alt: Screenshot of a test with a custom QUnit assertion
keywords: ember, qunit, custom assertion, testing, multiple assertions, test
---

Recently I was working on a feature to display different toastr notifications based on what the user filled out in a form. I wrote some acceptance tests with assertions like the following:

```js
assert.dom('#toast-container', document).hasText(
  'Your settings will take effect within 5 minutes.'
);

assert.dom('.toast-info', document).exists();
```

The first assertion verifies that the message is correct. The second assertion verifies that the correct notification type is shown (success, error, info, etc).

Because toastr notifications are rendered outside of `#ember-testing-container`, I had to change the scope of qunit-dom by passing in `document` as the second argument for each assertion.

These assertions were fine, but I wanted to roll them into a single logical assertion that tucked away those toastr selectors. Plus, my future self might forget about having to scope qunit-dom to the document. I wanted an assertion more like this:

```js
assert.hasToast('info', 'Your settings will take effect within 5 minutes.');
```

To create this assertion, I installed [ember-cli-custom-assertions](https://github.com/DockYard/ember-cli-custom-assertions), which helps with adding custom QUnit assertions in Ember.

```
ember install ember-cli-custom-assertions
```

Don't forget to follow the [setup instructions](https://github.com/DockYard/ember-cli-custom-assertions#setup).

Then, I created the `hasToast` assertion in `tests/assertions/has-toast.js`:

```js
export default function(context, toastrType, expectedToastrMessage) {
  let container = document.getElementById('toast-container');

  if (!container.querySelector(`.toast-${toastrType}`)) {
    throw new Error(`A toast of type "${toastrType}" does not exist`);
  }

  let actualToastrMessage = container.textContent.trim();

  this.pushResult({
    result: actualToastrMessage === expectedToastrMessage,
    actual: actualToastrMessage,
    expected: expectedToastrMessage
  });
}
```

This file should export a default function. This function will receive the arguments from when the assertion is invoked starting with the second argument, as a `context` object is always injected as the first argument. In this example, `toastrType` will be "info" and `expectedToastrMessage` will be "Your settings will take effect within 5 minutes.".

[`this.pushResult`](https://api.qunitjs.com/assert/pushResult) is an API in QUnit to report the result of a custom assertion.

Now I have a clean API for testing toastr notifications.
