---
layout: post
title: Mocking Dependencies in Ember Acceptance Tests
date: 2017-09-03
description: Sometimes it can be useful to mock dependencies in Ember acceptance tests. This isn't something I do frequently, as I like my acceptance tests to be as high level as possible and not know too many implementation details. Nevertheless, there are some situations where you may need to. In this post, I will show you how.
keywords: mock, dependency, stub, fake, service, ember, ember.js, emberJS, acceptance , test, testing, window, mock window, confirm, alert, stub confirm, mock confirm, mocking services in acceptance tests, stubbing services in acceptance tests
---

Sometimes it can be useful to mock dependencies in your acceptance tests in Ember. This isn't something I do frequently, as I like my acceptance tests to be as high level as possible and not know too many implementation details. Nevertheless, there are some situations where you may need to. `XMLHttpRequest` is one example, and I use Mirage for that. Another example is `window.confirm` since that is blocking and can't be interacted with from an acceptane test. The browser's `window.confirm` can be useful for when you want the user to confirm leaving a page without saving their changes. In that example, you might have a route like the following:

```js
import Ember from 'ember';

const { Route } = Ember;

export default Route.extend({
  actions: {
    willTransition(transition) {
      if (this.get('controller.model.hasDirtyAttributes')) {
        let confirmation = window.confirm(
          'Are you sure you want to leave without saving your changes?'
        );

        if (!confirmation) {
          transition.abort();
        }
      }
    }
  }
});
```

Instead of using `window.confirm`, you could use a custom modal, which wouldn't require any mocking, but that can require a bit more work and design consideration.

One way to mock `window.confirm` is to override it in your test. This can easily be done with Sinon via the `ember-sinon` addon:

```js
import { test } from 'qunit';
import moduleForAcceptance from 'demo/tests/helpers/module-for-acceptance';
import Ember from 'ember';
import sinon from 'sinon';

moduleForAcceptance('Acceptance | settings');

test('the route does not change when the user cancels the confirm box', function(assert) {
  sinon.stub(window, 'confirm').returns(false);

  visit('/settings');
  // make the form dirty
  click('#contact-page-link');

  andThen(function() {
    assert.equal(currentURL(), '/settings');
    window.confirm.restore();
  });
});
```

The main issue with this is that a simple code style change can break some of your tests. For example, say you later on destructured `window.confirm` in your route:

```js
import Ember from 'ember';

const { Route } = Ember;
const { confirm } = window;

export default Route.extend({
  actions: {
    willTransition(transition) {
      if (this.get('controller.model.hasDirtyAttributes')) {
        let confirmation = confirm(
          'Are you sure you want to leave without saving your changes?'
        );

        if (!confirmation) {
          transition.abort();
        }
      }
    }
  }
});
```

When your acceptance tests run, `window.confirm` will first get stubbed followed by the route's file getting resolved, which only happens once. Now the `confirm` function will always point to the first stub through the closure that is created for the route module. This will cause subsequent tests to break that depend on how the stub behaves.

Instead, I like to create a service called `window`:

```js
// app/services/window.js
import Ember from 'ember';

const { Service } = Ember;
const { confirm } = window;

export default Service.extend({
  confirm(message) {
    return confirm(message);
  }
});
```

Then I can inject it into my route:

```js
import Ember from 'ember';

const { Route, inject: { service } } = Ember;

export default Route.extend({
  window: service(),
  actions: {
    willTransition(transition) {
      if (this.get('controller.model.hasDirtyAttributes')) {
        let confirmation = this.get('window').confirm(
          'Are you sure you want to leave without saving your changes?'
        );

        if (!confirmation) {
          transition.abort();
        }
      }
    }
  }
});
```

Then in my acceptance tests, I can mock out the `window` service dependency by replacing the factory in the registry with a stub.

```js
import { test } from 'qunit';
import moduleForAcceptance from 'demo/tests/helpers/module-for-acceptance';
import Ember from 'ember';

const { Object: EmberObject } = Ember;

moduleForAcceptance('Acceptance | settings');

test('the route does not change when the user cancels the confirm box', function(assert) {
  this.application.register('services:window', EmberObject.extend({
    confirm() {
      return false;
    }
  }));
  this.application.inject('route', 'window', 'services:window');

  visit('/settings');
  // make the form dirty
  click('#contact-page-link');

  andThen(function() {
    assert.equal(currentURL(), '/settings');
  });
});
```

You can interact with the registry with `this.application.register` and specify where you want your mocked dependency injected with `this.application.inject`, where `this.application` is an instance of `Ember.Application`. This gets set in `tests/helpers/module-for-acceptance.js` with the line `this.application = startApp();`.

I mock dependencies in acceptance tests sparingly in situations like I discussed above so that there aren't many implementation details exposed, which helps keep my acceptance tests focussed from the user perspective.
