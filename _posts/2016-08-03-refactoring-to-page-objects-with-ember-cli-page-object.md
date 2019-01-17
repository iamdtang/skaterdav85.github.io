---
layout: post
title: Refactoring to Page Objects with ember-cli-page-object
date: 2016-08-03
description: The Page Object design pattern is used to isolate HTML structure and CSS selectors from your tests. In this post and video tutorial, I'll refactor an acceptance and integration test in Ember to use a page object with the ember-cli-page-object addon.
keywords: ember testing, page objects, ember-cli-page-object, tutorial, introduction to ember-cli-page-object, page objects in ember, readable tests, page objects in acceptance tests, page objects in integration tests, emberjs, EmberJS, ember.js, page object example
image: ember
---

The [Page Object design pattern](http://martinfowler.com/bliki/PageObject.html) is used to isolate HTML structure and CSS selectors from your tests. One of the main benefits from the page object pattern is test readability, and this really starts to shine as your acceptance and integration (component) tests get more complicated. Not only do page objects greatly improve test readability, they also make your tests more DRY. When HTML structure and CSS selectors change, you can make a change in a single place in your page object as opposed to going through and updating multiple, repeated selectors in your tests. Personally, I have also found that tests have become easier to write as my page objects get more defined.

Luckily for us Ember developers, there is a fantastic addon called [ember-cli-page-object](http://ember-cli-page-object.js.org/) that helps us create page objects. I've created a screencast where I walk through a simple Ember application with an acceptance and integration test, and we'll refactor these tests to use a page object with the [ember-cli-page-object](http://ember-cli-page-object.js.org/) addon. All of the code can be found at  [https://github.com/skaterdav85/refactoring-to-page-objects](https://github.com/skaterdav85/refactoring-to-page-objects). For those that just want to see the tests before and after the refactor side by side, I have included them below the video.

<iframe width="853" height="480" src="https://www.youtube.com/embed/jWy_0zW-k0g" frameborder="0" allowfullscreen></iframe>

## Creating a Page Object

A page object can be created with the generate command:

```
ember g page-object contacts
```

Here is the page object used in the screencast above:

```js
// tests/pages/contacts.js
import {
  create,
  visitable,
  collection,
  fillable,
  text,
  clickable,
  isVisible,
  isHidden
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/contacts'),
  contacts: collection({
    itemScope: '[data-test="contact"]',
    item: {
      fullName: text('h3'),
      title: text('[data-test="title"]'),
      job: text('[data-test="job"]'),
      jobDescription: text('[data-test="job-description"]'),
      clickOnName: clickable('h3'),
      detailsShown: isVisible('[data-test="details"]'),
      detailsHidden: isHidden('[data-test="details"]')
    }
  }),
  fillInSearchInputWith: fillable('#contact-search')
});
```

## Accepting Testing with a Page Object

```js
// tests/acceptance/contacts.js

// Before
test('visiting /contacts shows 10 contacts', function(assert) {
  visit('/contacts');
  andThen(() => {
    assert.equal(find('[data-test="contact"]').length, 3);
  });
});

// After
test('visiting /contacts shows 10 contacts', function(assert) {
  page.visit();
  andThen(() => {
    assert.equal(page.contacts().count, 3);
  });
});
```

```js
// tests/acceptance/contacts.js

// Before
test('typing into the search box filters the list of contacts', function(assert) {
  visit('/contacts');
  fillIn('#contact-search', 'Eric');
  andThen(() => {
    assert.equal(find('[data-test="contact"]').length, 2);
    assert.equal(find('[data-test="contact"]:eq(0) h3').text().trim(), 'Erica Johnson');
    assert.equal(find('[data-test="contact"]:eq(1) h3').text().trim(), 'Eric Koston');
  });
});

// After
test('typing into the search box filters the list of contacts', function(assert) {
  page
    .visit()
    .fillInSearchInputWith('Eric');

  andThen(() => {
    assert.equal(page.contacts().count, 2);
    assert.equal(page.contacts(0).fullName, 'Erica Johnson');
    assert.equal(page.contacts(1).fullName, 'Eric Koston');
  });
});
```

## Integration Testing with a Page Object

```js
// tests/integration/contact-details.js

// Before
test('it renders the contact', function(assert) {
  {% raw %}this.render(hbs`{{contact-details contact=contact}}`);{% endraw %}
  assert.equal(this.$('h3').text().trim(), 'Dwayne Johnson');
  assert.equal(this.$('[data-test="details"]').length, 0);
  this.$('h3').click();
  assert.equal(this.$('[data-test="details"]').length, 1);
  assert.equal(this.$('[data-test="title"]').text().trim(), 'The Rock');
  assert.equal(this.$('[data-test="job"]').text().trim(), 'Actor');
  assert.equal(this.$('[data-test="job-description"]').text().trim(), 'some job description');
});

// After
test('it renders the contact', function(assert) {
  {% raw %}page.render(hbs`{{contact-details contact=contact}}`);{% endraw %}
  assert.equal(page.contacts(0).fullName, 'Dwayne Johnson');
  assert.ok(page.contacts(0).detailsHidden);
  page.contacts(0).clickOnName();
  assert.ok(page.contacts(0).detailsShown);
  assert.equal(page.contacts(0).title, 'The Rock');
  assert.equal(page.contacts(0).job, 'Actor');
  assert.equal(page.contacts(0).jobDescription, 'some job description');
});
```
