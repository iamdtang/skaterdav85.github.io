---
layout: post
title: Conditional Default Values for Ember Data Model Attributes
date: 2018-05-26
updated: 2020-01-18
description: This post covers how to access the instance of a model in the defaultValue function of an attribute to conditionally set a default value.
twitter_image: conditional-default-values-in-ember-data-model-attributes.png
twitter_image_alt: code screenshot of conditionally setting a default value in an Ember Data model attribute
keywords: ember data, model, attribute, conditional, default value, defaultValue
image: ember
---

When defining attributes on Ember Data models, you can specify a default value through the second argument to `attr()`:

```js
// models/metric-selection.js
import Model, { attr, belongsTo } from '@ember-data/model';

export default class MetricSelectionModel extends Model {
  @attr('string', { defaultValue: 'GB' }) unit;
  @belongsTo('metric', { async: false }) metric;
}
```

The `defaultValue` option can also be a function. This can be useful for when you want the default value of an attribute to be an object.

```js
// models/user.js
import Model, { attr } from '@ember-data/model';

export default class UserModel extends Model {
  @attr({
    defaultValue() {
      return {};
    }
  }) preferences;
}
```

If we didn't use a function here for `defaultValue`, all user instances would reference the same object, which usually isn't the desired behavior.

Using a function for `defaultValue` can also be useful to conditionally set a default value. [Although not documented at the time of this writing](https://api.emberjs.com/ember-data/3.15/functions/@ember-data%2Fmodel/attr), I recently discovered that the first parameter passed to the `defaultValue` function is the instance of a model. This can be used to conditionally set the default value based on other attributes or relationships. For example:

```js
// models/metric-selection.js
import Model, { attr, belongsTo } from '@ember-data/model';

export default class MetricSelection extends Model {
  @attr('string', {
    defaultValue(metricSelection) {
      if (metricSelection.get('metric.type') === 'usage') {
        return 'GB';
      } else {
        return null;
      }
    }
  }) unit;

  @belongsTo('metric', { async: false }) metric;
}
```

In an analytics reporting application I am working on, users can select multiple metrics and specify a unit for some of those metrics for how they want to see the data in their report. In the code above, there is a model called `metric-selection`, which has a `unit` string attribute and a `metric` relationship. The default value of `unit` is determined based on `metric`, which can be accessed off of `metricSelection`, the `metric-selection` instance, passed to the `defaultValue` function.

Thanks to [@runspired](https://twitter.com/Runspired) for confirming that it is part of public API that the `defaultValue` function receives an instance of the model as its first parameter.
