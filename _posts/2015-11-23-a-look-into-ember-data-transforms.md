---
layout: post
title:  "A Look Into Ember Data Transforms"
date:   2015-11-23
description: Ember Data has a feature called transforms that allow you to transform values before they are set on a model or sent back to the server. If you've been working with Ember Data, then you have already been using transforms and may not have known it.
keywords: Ember Data, Transforms, tutorial, DS.Transform, custom transform, transform tutorial
---

Ember Data has a feature called transforms that allow you to transform values before they are set on a model or sent back to the server. A transform has two functions: `serialize` and `deserialize`. Deserialization converts a value to a format that the client expects. Serialization does the reverse and converts a value to the format expected by the backend. If you've been working with Ember Data, then you have already been using transforms and may not have known it. The built in transforms include:

* string
* number
* boolean
* date

These transforms are used when model attributes are declared using `DS.attr()`. For example:

```js
// models/person.js
export default DS.Model.extend({
  name: DS.attr('string'),
  age: DS.attr('number'),
  admin: DS.attr('boolean'),
  lastLogin: DS.attr('date'),
  phone: DS.attr()
});
```

When the model is created, the attributes are transformed to the types specified in the corresponding `DS.attr()` call. Behind the scenes, each of these `DS.attr()` calls map to a specific transform class that extends from `DS.Transform`. If you don't pass anything to `DS.attr()`, like the `phone` attribute in the model above, the value will be passed through:

<table border="1" cellspacing="0" cellpadding="10">
  <thead>
    <tr>
      <th>DS.attr()</th>
      <th>Transform Class</th>
    </tr>
  </thead>
  <tbody style="font-family: Courier New;">
    <tr>
      <td>DS.attr('boolean')</td>
      <td>DS.BooleanTransform</td>
    </tr>
    <tr>
      <td>DS.attr('number')</td>
      <td>DS.NumberTransform</td>
    </tr>
    <tr>
      <td>DS.attr('string')</td>
      <td>DS.StringTransform</td>
    </tr>
    <tr>
      <td>DS.attr('date')</td>
      <td>DS.DateTransform</td>
    </tr>
  </tbody>
</table>

So what's going on behind each of these `Transform` classes? Let's take a look at the [Ember Data source code](http://builds.emberjs.com/release/ember-data.prod.js).

When you search for `NumberTransform`, you'll see it points to this:

```js
ember$data$lib$transforms$base$$default.extend({
  deserialize: function (serialized) {
    var transformed;

    if (ember$data$lib$transforms$number$$empty(serialized)) {
      return null;
    } else {
      transformed = Number(serialized);

      return ember$data$lib$transforms$number$$isNumber(transformed) ? transformed : null;
    }
  },

  serialize: function (deserialized) {
    var transformed;

    if (ember$data$lib$transforms$number$$empty(deserialized)) {
      return null;
    } else {
      transformed = Number(deserialized);

      return ember$data$lib$transforms$number$$isNumber(transformed) ? transformed : null;
    }
  }
});
```

If you remove the long prefix `ember$data$lib$transforms$number$$`, the class reads a little easier:

```js
ember$data$lib$transforms$base$$default.extend({
  deserialize: function (serialized) {
    var transformed;

    if (empty(serialized)) {
      return null;
    } else {
      transformed = Number(serialized);

      return isNumber(transformed) ? transformed : null;
    }
  },

  serialize: function (deserialized) {
    var transformed;

    if (empty(deserialized)) {
      return null;
    } else {
      transformed = Number(deserialized);

      return isNumber(transformed) ? transformed : null;
    }
  }
});
```

You can see that it uses the `Number` function to convert the value back and forth. If the attribute is not a number, `null` is returned. `StringTransform` is similar and pretty self explanatory, using the `String` function.

```js
ember$data$lib$transforms$base$$default.extend({
  deserialize: function (serialized) {
    return none(serialized) ? null : String(serialized);
  },
  serialize: function (deserialized) {
    return none(deserialized) ? null : String(deserialized);
  }
});
```

I found the `BooleanTransform` interesting because it deserializes value types other than `Boolean`:

* The strings "true" or "t" in any casing, or "1" will coerce to `true`, and `false` otherwise
* The number 1 will coerce to `true`, and `false` otherwise
* Anything other than boolean, string, or number will coerce to `false`

Here is the implementation:

```js
ember$data$lib$transforms$base$$default.extend({
  deserialize: function (serialized) {
    var type = typeof serialized;

    if (type === "boolean") {
      return serialized;
    } else if (type === "string") {
      return serialized.match(/^true$|^t$|^1$/i) !== null;
    } else if (type === "number") {
      return serialized === 1;
    } else {
      return false;
    }
  },

  serialize: function (deserialized) {
    return Boolean(deserialized);
  }
});
```

And lastly, the `DateTransform`:

```js
ember$data$lib$transforms$base$$default.extend({
  deserialize: function (serialized) {
    var type = typeof serialized;

    if (type === "string") {
      return new Date(Ember.Date.parse(serialized));
    } else if (type === "number") {
      return new Date(serialized);
    } else if (serialized === null || serialized === undefined) {
      // if the value is null return null
      // if the value is not present in the data return undefined
      return serialized;
    } else {
      return null;
    }
  },

  serialize: function (date) {
    if (date instanceof Date) {
      return date.toISOString();
    } else {
      return null;
    }
  }
});
```

The `DateTransform` is interesting because it also deserializes a few different values. If the date is a string, it should be in a format recognized by [`Date.parse()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse). According to MDN, that date format should be either RFC2822 or ISO 8601.

The ISO 8601 format looks like this: YYYY-MM-DDTHH:mm:ss.sssZ. More information on that can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString).

Because `Date.parse()` in some browsers does not support simplified ISO 8601 dates, like Safari 5-, IE 8-, Firefox 3.6-, Ember uses a [shim](https://github.com/csnover/js-iso8601).

Alternatively, a number can be passed that represents the number of milliseconds since 1 January 1970 00:00:00 UTC (Unix Epoch). Otherwise, `null` or `undefined` is returned.

The `DateTransform` serialization process converts it to the ISO 8601 string format if the model property is an instance of `Date`. Otherwise `null` is sent.

## Creating Custom Transforms

You can also create custom transforms. Here is a simple transform that converts values in cents (maybe the database stores everything in cents) to US dollars.

```
ember g transform dollars
```

```js
import DS from 'ember-data';

export default DS.Transform.extend({
  deserialize: function(serialized) {
    return serialized / 100; // returns dollars
  },
  serialize: function(deserialized) {
    return deserialized * 100; // returns cents
  }
});
```

Then, simply use `DS.attr('dollars')` in the model:

```js
// models/person.js
export default DS.Model.extend({
  name: DS.attr('string'),
  age: DS.attr('number'),
  admin: DS.attr('boolean'),
  lastLogin: DS.attr('date'),
  phone: DS.attr(),
  spent: DS.attr('dollars')
});
```

What custom transforms have you made? Thanks for reading!
