---
layout: post
title: Testing with Relative Dates and Timezones in Ember
date: 2017-10-29
description: In this post, I cover how to test with relative dates and timezones in an Ember application.
keywords: mock today, stub today, Ember, testing, dates, mockdate, timezone, ember.js
---

Imagine you have a component that allows users to select a date range. The component might also have a list of date range presets such as Last 7 days, Last 14 days, Last 3 months, etc.

The component's API might look like the following, where `onchange` is invoked with the "from" and "to" dates of the date range:

```hbs
{% raw %}{{date-range-picker onchange=(action "setRange")}}{% endraw %}
```

Because these date range presets are relative to today, writing assertions that verify `onchange` is invoked with the correct "from" and "to" dates becomes a challenge. The following test passes today, which at the time of this writing is October 29th, 2017, but it will fail tomorrow:

```js
// tests/integration/components/date-range-picker.js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { click } from 'ember-native-dom-helpers';

moduleForComponent('date-range-picker', 'Integration | Component | date range picker', {
  integration: true
});

test('onchange is invoked with the "from" and "to" dates when Last 7 days is clicked', function(assert) {
  let handleChange = this.set('handleChange', sinon.spy());
  {% raw %}this.render(hbs`{{date-range-picker onchange=handleChange}}`);{% endraw %}
  click('#last-7-days');
  let [ from, to ] = handleChange.getCall(0).args;
  assert.equal(from, '2017-10-22');
  assert.equal(to, '2017-10-28');
});
```

And the implementation:

```js
// app/components/date-range-picker.js
import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  actions: {
    selectLast7Days() {
      let from = moment().subtract(7, 'days').format('YYYY-MM-DD');
      let to = moment().subtract(1, 'day').format('YYYY-MM-DD');
      this.get('onchange')(from, to);
    }
  }
});
```

Ideally we want to freeze today to October 29th, 2017 so that our assertions will pass today and in the future. Thankfully, there is a library for this called [MockDate](https://github.com/boblauer/MockDate), and an Ember addon for it called [ember-mockdate-shim](https://github.com/Ticketfly/ember-mockdate-shim). MockDate essentially overrides the native `Date` class. Note that this shim renames a couple methods in MockDate for more clarity.

We can install the addon:

```
ember install ember-mockdate-shim
```

Then we can update `moduleForComponent` in our test to look like this:

```js
// tests/integration/components/date-range-picker.js
// ...
import { freezeDateAt, unfreezeDate } from 'ember-mockdate-shim';

moduleForComponent('date-range-picker', 'Integration | Component | date range picker', {
  integration: true,
  beforeEach() {
    // October 29th, 2017 5:14:36
    // The month integer begins with 0 for January
    freezeDateAt(new Date(2017, 9, 29, 5, 14, 36));
  },
  afterEach() {
    unfreezeDate();
  }
});

// ...
```

We've frozen today to always be October 29th, 2017 at 5:14:36 for whenever these tests run. Our tests pass today and will pass in the future.

Now let's say we want `onchange` invoked with the "from" and "to" dates as ISO 8601 strings in UTC.

```js
// tests/integration/components/date-range-picker.js
test('onchange is invoked with "from" and "to" as ISO 8601 strings in UTC when Last 7 days is clicked', function(assert) {
  let handleChange = this.set('handleChange', sinon.spy());
  {% raw %}this.render(hbs`{{date-range-picker onchange=handleChange}}`);{% endraw %}
  click('#last-7-days');
  let [ from, to ] = handleChange.getCall(0).args;
  assert.equal(from, '2017-10-22T07:00:00.000Z');
  assert.equal(to, '2017-10-29T06:59:59.999Z');
});
```

I currently live in Los Angeles and today is October 29th, 2017. The UTC offset for today is UTC-7h (today is in the daylight savings period which is March 12th - November 5th for 2017). Hence, the "from" and "to" ISO 8601 UTC timestamps for the last 7 days are _2017-10-22T07:00:00.000Z_ and _2017-10-29T06:59:59.999Z_.

We can update our implementation:

```js
// app/components/date-range-picker.js
import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  actions: {
    selectLast7Days() {
      let from = moment().subtract(7, 'days').startOf('day').toISOString();
      let to = moment().subtract(1, 'day').endOf('day').toISOString();
      this.get('onchange')(from, to);
    }
  }
});
```

Note that both `moment().toISOString()` and `Date.prototype.toISOString()` return an ISO 8601 timestamp in UTC.

Great, tests pass!

There is still a problem though. Even after getting the tests to pass locally, the tests fail on CI because my CI server is using a different timezone. We need to change the timezone on CI to America/Los_Angeles.

For Ember apps using Travis CI, you can set the timezone by adding the following to `testem.js`:

```js
// testem.js
process.env.TZ = 'America/Los_Angeles';
```

You can also set the timezone in your `.travis.yml` like this:

```
# .travis.yml
before_install:
  - export TZ=America/Los_Angeles
```

However, setting the timezone in `.travis.yml` will only apply it to CI, so if you have teammates working in different timezones, their tests won't execute locally with the same timezone, so I recommend putting this configuration in `testem.js`. This way, the timezone is fixed locally and in CI for everyone.

You can find the [code for this post here](https://github.com/skaterdav85/testing-with-dates-and-timezones-in-ember).
