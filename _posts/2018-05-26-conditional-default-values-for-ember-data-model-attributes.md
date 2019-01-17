---
layout: post
title: Conditional Default Values for Ember Data Model Attributes
date: 2018-05-26
description: This post covers how to access the instance of a model in the defaultValue function of an attribute to conditionally set a default value.
image: conditional-default-values-in-ember-data-model-attributes.png
image_alt: code screenshot of conditionally setting a default value in an Ember Data model attribute
keywords: ember data, model, attribute, conditional, default value, defaultValue
image: ember
---

When defining attributes on Ember Data models, you can specify a default value through the second argument to `DS.attr()`:

```js
// models/metric-selection.js
import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
  unit: attr('string', { defaultValue: 'GB' }),
  metric: belongsTo('metric', { async: false })
});
```

The `defaultValue` option can also be a function. This can be useful for when you want the default value of an attribute to be an object.

```js
// models/user.js
import DS from 'ember-data';

const { Model, attr } = DS;

export default Model.extend({
  preferences: attr({
    defaultValue() {
      return {};
    }
  })
});
```

If we didn't use a function here for `defaultValue`, all user instances would reference the same object, which usually isn't the desired behavior.

Using a function for `defaultValue` can also be useful to conditionally set a default value. [Although not documented at the time of this writing](https://www.emberjs.com/api/ember-data/3.1/classes/DS/methods/attr?anchor=attr), I recently discovered that the first parameter passed to the `defaultValue` function is the instance of a model. This can be used to conditionally set the default value based on other attributes or relationships. For example:

```js
// models/metric-selection.js
import DS from 'ember-data';

const { Model, attr, belongsTo } = DS;

export default Model.extend({
  unit: attr('string', {
    defaultValue(metricSelection) {
      if (metricSelection.get('metric.type') === 'usage') {
        return 'GB';
      } else {
        return null;
      }
    }
  }),
  metric: belongsTo('metric', { async: false })
});
```

In an analytics reporting application I am working on, users can select multiple metrics and specify a unit for some of those metrics for how they want to see the data in their report. In the code above, there is a model called `metric-selection`, which has a `unit` string attribute and a `metric` relationship. The default value of `unit` is determined based on `metric`, which can be accessed off of `metricSelection`, the `metric-selection` instance, passed to the `defaultValue` function.

Thanks to [@runspired](https://twitter.com/Runspired) for confirming that it is part of public API that the `defaultValue` function receives an instance of the model as its first parameter.
