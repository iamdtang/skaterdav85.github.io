---
layout: post
title: Testing Ember Components With Both Unit and Integration Tests
date: 2016-01-14
description: In this post, we'll look at how integration tests can be used in conjunction with unit tests to effectively test different aspects of your Ember components.
keywords: ember component, unit test, integration test, testing component computed properties, ember.js, emberJS, testing ember components, component unit tests, component computed properties
---

In this post, we'll look at how integration tests can be used in conjunction with unit tests to effectively test different aspects of your Ember components.

When you generate an Ember component, Ember CLI also creates a corresponding integration test. Integration tests allow you to invoke the component as you would in your templates with the necessary data and write assertions against the resulting DOM using jQuery.

Let's create a `cat-list` component:

```
ember g component cat-list
```

The template for this component looks like this:

```html
{% raw %}
{{#each cats as |cat|}}
  <div class="cat">
    <span>Name:</span>
    <span>{{cat.name}}</span>
    <span>Age:</span>
    <span>{{cat.age}}</span>
  </div>
{{/each}}
{% endraw %}
```

Here is an integration test for this component:

```js
// tests/integration/components/cat-list-test.js
{% raw %}
test('it renders all cats', function(assert) {
  this.set('cats', [
    { name: 'Tubby', age: 9 },
    { name: 'Spot', age: 8 },
    { name: 'Chester', age: 11 },
    { name: 'Frisky', age: 3 }
  ]);

  this.render(hbs`{{cat-list cats=cats}}`);
  assert.equal(this.$('.cat').length, 4);
});
{% endraw %}
```

This test simply asserts that all 4 cats were rendered. Now imagine in this `cat-list` component that you have a computed property called `sortedCats` that contains a list of cats sorted by their age. The template now changes to:

```html
{% raw %}
{{#each sortedCats as |cat|}}
  <div class="cat">
    <span>Name:</span>
    <span>{{cat.name}}</span>
    <span>Age:</span>
    <span>{{cat.age}}</span>
  </div>
{{/each}}
{% endraw %}
```

How would you go about testing that the cats are sorted by their age? One way to test this is through an integration test, where you write assertions against the DOM to verify that the cats are sorted. For example:

```js
// tests/integration/components/cat-list-test.js
{% raw %}
test('it renders all cats sorted by their age', function(assert) {
  this.set('cats', [
    { name: 'Tubby', age: 9 },
    { name: 'Spot', age: 8 },
    { name: 'Chester', age: 11 },
    { name: 'Frisky', age: 3 }
  ]);

  this.render(hbs`{{cat-list cats=cats}}`);
  let $cats = this.$('.cat');

  assert.equal($cats.eq(0).find('span').eq(1).text().trim(), 'Frisky');
  assert.equal($cats.eq(1).find('span').eq(1).text().trim(), 'Spot');
  assert.equal($cats.eq(2).find('span').eq(1).text().trim(), 'Tubby');
  assert.equal($cats.eq(3).find('span').eq(1).text().trim(), 'Chester');
});
{% endraw %}
```

As you can see, this can be quite cumbersome, especially when the HTML becomes more complicated. You basically have to go through the DOM and see what was rendered in order to verify that the computed property returns what is expected.

Instead, I prefer to test the computed property itself. This is where a unit test for a component becomes useful.

To generate a unit test for a component, run:

```
ember g component-test cat-list -unit
```

To unit test the `sortedCats` computed property, we can do the following:

```js
// tests/unit/components/cat-list-test.js

test('sortedCats contains the cats sorted by age', function(assert) {
  let component = this.subject();
  component.set('cats', [
    { name: 'Tubby', age: 9 },
    { name: 'Spot', age: 8 },
    { name: 'Chester', age: 11 },
    { name: 'Frisky', age: 3 }
  ]);

  assert.deepEqual(component.get('sortedCats'), [
    { name: 'Frisky', age: 3 },
    { name: 'Spot', age: 8 },
    { name: 'Tubby', age: 9 },
    { name: 'Chester', age: 11 }
  ]);
});
```

This test verifies that `sortedCats` is an array with the cats in the correct order. You'd probably agree that testing `sortedCats` this way is much easier to read and write than the integration test. Don't get me wrong, integration tests are extremely useful for testing components, but sometimes a unit test is better suited for testing a particular aspect, like a computed property that returns sorted or filtered data.

One thing to note about unit testing components is that the tests don't wire up dependencies for you. If you have nested components within your component, you will need to add those to the `needs` property in your setup, unlike with a component integration test. For example, if each cat were rendered in a `rescued-cat` component, `moduleForComponent` would need to look like this:

```js
moduleForComponent('cat-list', 'Unit | Component | cat list', {
  // Specify the other units that are required for this test
  needs: ['component:rescued-cat'],
  unit: true
});
```

## Conclusion

When it comes to testing components, I start off writing integration tests. When I want to test computed properties on the component, like those that return sorted or filtered data, then I often find myself writing a unit test as well.
