---
layout: post
title: Testing with Dates and Timezones in Ember
date: 2017-10-28
description: TBA
keywords: testing, dates, mockdate, timezone, mock, stub, test, ember, ember.js, declare now
---

Imagine you have a component that allows users to select a date range from a list of date range presets such as:

* Last 7 days
* Last 14 days
* Last 3 months

The component's API might look like this:

```hbs
{% raw %}
{{date-range-picker onchange=(action "setRange")}}
{% endraw %}
```

where `onchange` is invoked with the from and to dates.

Because these date range presets are relative to today, writing assertions that verify `onchange` is invoked with the correct from and to dates becomes a challenge. The following test passes today, but will fail tomorrow:

```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { click } from 'ember-native-dom-helpers';

moduleForComponent('date-range-picker', 'Integration | Component | date range picker', {
  integration: true
});

test('onchange is invoked with the from and to dates when Last 7 days is clicked', function(assert) {
  let handleChange = this.set('handleChange', sinon.spy());
  this.render(hbs`{{date-range-picker onchange=handleChange}}`);
  click('#last-7-days');
  let [ from, to ] = handleChange.getCall(0).args;
  assert.equal(from, '2017-10-22');
  assert.equal(to, '2017-10-28');
});
```

Ideally we want to freeze today at a certain date so that our assertions will pass today and in the future. Thankfully, there is a library for this called [`MockDate`](https://github.com/boblauer/MockDate), and an Ember addon for it called [ember-mockdate-shim](https://github.com/Ticketfly/ember-mockdate-shim). Note that this Ember shim renames a couple methods for more clarity.

```
ember install ember-mockdate-shim
```

Now, `moduleForComponent` looks like this:

```js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import sinon from 'sinon';
import { click } from 'ember-native-dom-helpers';
import { freezeDateAt, unfreezeDate } from 'ember-mockdate-shim';

moduleForComponent('date-range-picker', 'Integration | Component | date range picker', {
  integration: true,
  beforeEach() {
    freezeDateAt(new Date(2017, 9, 29, 5, 14, 36)); // Oct 29th, 2017 5:14:36
  },
  afterEach() {
    unfreezeDate();
  }
});
```

We've frozen today to always be October 29th, 2017 at 5:14:36 for whenever these tests run. Our tests pass today and will pass in the future.

Now let's say we want `onchange` invoked with the from and to dates as ISO 8601 strings and in UTC. Note that both `moment().toISOString()` and `Date.prototype.toISOString()` return an ISO 8601 timestamp in UTC.

```js
test('onchange is invoked with the from and to dates in UTC when Last 7 days is clicked', function(assert) {
  let handleChange = this.set('handleChange', sinon.spy());
  this.render(hbs`{{date-range-picker onchange=handleChange}}`);
  click('#last-7-days');
  let [ from, to ] = handleChange.getCall(0).args;
  assert.equal(from, '2017-10-22T07:00:00.000Z');
  assert.equal(to, '2017-10-29T06:59:59.999Z');
});
```

I am currently in Los Angeles and today is October 29th, 2017. The UTC offset for today is UTC-7h (today is in the daylight savings period which is March 12th - November 5th for 2017). Hence, the from and to ISO 8601 UTC timestamps for the last 7 days are _2017-10-22T07:00:00.000Z_ and _2017-10-29T06:59:59.999Z_.

There is still a problem though. Even after getting my tests to pass locally, the tests fail on CI because my CI server is using a different timezone. We need to set the timezone on CI.

On Travis CI, you can set the timezone with the following:

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

However, if you have teammates working in different timezones, their tests won't execute locally with the same timezone since `.travis.yml` is only used on Travis CI, so I recommend putting this configuration in `testem.js`.


It is still a good idea to

Great, tests are passing!

---- keep the rest? check if we can remove timezoneOffsetMinutes in core-styles-forms

Now let's say we add a "Today" option to the list.


```js
import { freezeDateAt, unfreezeDate } from 'ember-mockdate-shim';

moduleForComponent('date-range-picker', 'Integration | Component | date range picker', {
  integration: true,
  beforeEach() {
    let timezoneOffsetMinutes = 60 * 7;
    freezeDateAt(new Date(2017, 8, 12, 5, 14, 36), timezoneOffsetMinutes);
  },
  afterEach() {
    unfreezeDate();
  }
});
```


`timezoneOffsetMinutes` is the value that should be returned by [`Date.prototype.getTimezoneOffset`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset), which moment.js uses under the hood.

https://github.com/boblauer/MockDate/issues/9

doesnt work in acceptance tests?
