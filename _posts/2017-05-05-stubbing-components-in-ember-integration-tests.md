---
layout: post
title: Stubbing Components in Ember Integration Tests
date: 2017-05-05
description: TBA
excerpt_separator: ""
keywords: stub, component, integration test, test double, spy on components, stub components, testing charts, chart components, c3, tests, d3
---

Imagine you have the following component:

```html
{% raw %}{{student-grades-donut grades=grades}}{% endraw %}
```

```html
<!-- app/templates/components/student-grades-donut.hbs -->
{% raw %}{{donut-chart data=gradeData}}{% endraw %}
```

The `student-grades-donut` component is a light wrapper around the `donut-chart` component to handle the specifics of manipulating a student's grades into the format `donut-chart` expects.

So, how do you test the `student-grades-donut` component?

## A Few Approaches

1. One approach is to write assertions against the generated SVG from `donut-cart`. I don't like this approach for a couple reasons. First, writing assertions against the SVG doesn't really verify that the `donut-chart` rendered correctly. A visual check would be more helpful. Second, if the resulting DOM from `donut-chart` changes, then our test could break, especially if `donut-chart` is a third-party component or a wrapper around a library like [C3.js](http://c3js.org) or [D3.js](https://d3js.org).

2. Another approach is to write a __unit__ test for the `student-grades-donut` component verifying that the computed property `gradeData` is in the correct format. Component tests are integration tests by default in Ember CLI, but you can also generate a unit test for a component with: `ember g component-test student-grades-donut --unit`. I also don't like this approach because the `gradeData` computed property would be exposed in the test and treated like a public property. When I think of a component's public API, I think of the attributes passed to the component like `grades` or anything that the component `yield`s, and `gradeData` is neither one of those. If the implementation of how this grade data is formatted changes and the property name changes, the test will also have to update. Not a big deal, but still not ideal.

3. A third option is not to test this component and chalk it up to one of those areas in an app that isn't tested. 😛

## Solution

What would make me feel confident that this feature works correctly is to test that the grade data is formatted correctly and passed into the `donut-chart` component, and ideally not have to reference the `gradeData` computed property explicitly in our test since it is more like a private property. This approach could treat `donut-chart` like a spy and record the arguments (component attributes) that it was called with. It turns out we can easily do this without a test double library like Sinon.js, thanks to Ember's container.

```js
// tests/integration/student-grades-donut-test.js
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('student-grades-donut', 'Integration | Component | student grades donut', {
  integration: true
});

test('the donut-chart is invoked with the grade data properly formatted', function(assert) {
  this.register('component:donut-chart', Ember.Component.extend({
    didReceiveAttrs() {
      assert.deepEqual(this.get('data'), {
        columns: [
          [ 'A', 3 ],
          [ 'B', 3 ],
          [ 'C', 1 ],
          [ 'D', 1 ],
          [ 'F', 0 ]
        ]
      });
    }
  }));

  this.set('grades', [ 'A', 'A', 'C', 'A', 'B', 'D', 'B', 'B' ]);
  {% raw %}this.render(hbs`{{student-grades-donut grades=grades}}`);{% endraw %}
});
```

Components are resolved out of Ember's container. In integration tests, we can register things with the container via `this.register()`. You may have used this before to stub out a service that gets injected into a component. Instead of registering a stub service, we can register a stub component. When the `student-grades-donut` component is rendered, the `donut-chart` component will get invoked from the template, and our stubbed `Ember.Component` class for `donut-chart` will get resolved out of the container and instantiated. The `didReceiveAttrs()` hook will get called, at which point we can assert against the `data` attribute for `donut-chart`. With this approach, we can check the value of `gradeData` and verify that it was passed into `donut-chart` under the `data` attribute without ever having to explicitly reference the `gradeData` computed property! Our test now only relies on public API.

## Conclusion

In integration tests, not only can we stub services, but we can also stub components. I've found this technique useful when a component processes some data and passes that data along to a more generic/reusable component that might be harder to test, like a chart or a map.

[Full example code here](https://github.com/skaterdav85/stubbing-components-in-ember-integration-tests)
