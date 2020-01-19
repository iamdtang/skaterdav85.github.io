---
layout: post
title: Mocking Services in Ember Acceptance Tests
date: 2017-09-03
last_modified_at: 2020-01-19
description: This post explores a few approaches to mocking services in acceptance tests and shows an example that stubs window.confirm. 
keywords: mock, dependency, stub, fake, service, ember, ember.js, EmberJS, acceptance , test, testing, window, mock window, confirm, alert, stub confirm, mock confirm, mocking services in acceptance tests, stubbing services in acceptance tests
image: ember
---

Sometimes it can be useful to mock dependencies in acceptance tests in Ember. This isn't something I do frequently, as I like my acceptance tests to be as high level as possible and not know too many implementation details. Nevertheless, there are some situations where I find it useful. One example is when my application uses `window.confirm` which is blocking and can't be interacted with from an acceptance test via the `click` test helper.

`window.confirm` can be useful for when we want the user to confirm leaving a page without saving their changes. We might have a route like the following:

```js
// app/routes/settings.js
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class SettingsRoute extends Route {
  @action
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
```

One way to mock `window.confirm` is to override it in our test. This can easily be done with Sinon:

```js
// tests/acceptance/settings-test.js
import { module, test } from 'qunit';
import { visit, click, fillIn, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import sinon from 'sinon';

module('Acceptance | settings', function(hooks) {
  setupApplicationTest(hooks);

  test('the route does not change when the user cancels the confirmation', async function(assert) {
    sinon.stub(window, 'confirm').returns(false);

    await visit('/settings');
    await fillIn('[data-test-email-input]', 'test@gmail.com'); // make the form dirty
    await click('[data-test-contact-page-link]');

    assert.equal(currentURL(), '/settings');
    window.confirm.restore();
  });
});
```

The main issue with this is that a simple code style change can break our test. For example, say we later on destructured `window.confirm` in our route:

```js
// app/routes/settings.js
import Route from '@ember/routing/route';
import { action } from '@ember/object';

const { confirm } = window;

export default class SettingsRoute extends Route {
  @action
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
```

When our acceptance tests run, `window.confirm` will first get stubbed followed by the route's file getting resolved, which only happens once. Now the `confirm` function will always point to the first stub through the closure that is created for the route module. This will cause subsequent tests to break that depend on how the stub behaves.

Instead, we can create a service called `window`:

```js
// app/services/window.js
import Service from '@ember/service';

export default class WindowService extends Service {
  confirm(message) {
    return window.confirm(message);
  }
}
```

Then we can inject our `window` service into our route:

```js
// app/routes/settings.js
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SettingsRoute extends Route {
  @service window;

  @action
  willTransition(transition) {
    if (this.get('controller.model.hasDirtyAttributes')) {
      let confirmation = this.window.confirm(
        'Are you sure you want to leave without saving your changes?'
      );

      if (!confirmation) {
        transition.abort();
      }
    }
  }
}
```

In our acceptance test, we can mock out our `window` service with `this.owner.register`:

```js
// tests/acceptance/settings-test.js
import { module, test } from 'qunit';
import { visit, click, fillIn, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';

module('Acceptance | settings', function(hooks) {
  setupApplicationTest(hooks);

  test('the route does not change when the user cancels the confirmation', async function(assert) {
    this.owner.register('service:window', class MockService extends Service {
      confirm() {
        return false;
      }
    });

    await visit('/settings');
    await fillIn('[data-test-email-input]', 'test@gmail.com'); // make the form dirty
    await click('[data-test-contact-page-link]');

    assert.equal(currentURL(), '/settings');
  });
});
```

Check out the documentation for [`ApplicationInstance`](https://api.emberjs.com/ember/3.15/classes/ApplicationInstance/methods/register?anchor=register) to learn more about `this.owner`.

This example shows how we can mock out a `window` method without any libraries. There is an addon however that can help with mocking `window` called [ember-window-mock](https://github.com/kaliber5/ember-window-mock).