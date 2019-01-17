---
layout: post
title: Conditional Validations with ember-changeset-validations
date: 2018-02-11
description: TBA
keywords: ember changeset, conditional validations
image: ember
---

I was recently working on a feature that required lots of conditional validation. I used [ember-changeset](https://github.com/poteto/ember-changeset) and [ember-changeset-validations](https://github.com/poteto/ember-changeset-validations), as I love how you can buffer changes on your model and declaratively specify validation rules.

As I was looking through [ember-changeset-validations](https://github.com/poteto/ember-changeset-validations), it didn't seem like the addon addressed conditional validation. I wanted to run validation checks against a field only if another field was present.

One way I could achieve this was to [write my own validator](https://github.com/poteto/ember-changeset-validations#writing-your-own-validators) for each field that required conditional validation. However, this wasn't as declarative as I'd like, and I'd have to repeat this for every field that needed conditional validation.

I turned to Laravel's `Validator` class for [complex conditional validation](https://laravel.com/docs/5.6/validation#conditionally-adding-rules) for some inspiration, as I've always appreciated how intuitive the APIs are in Laravel. If you haven't used Laravel before, and the `Validator` class in particular, here is a simple example:

```php
$validator = Validator::make($data, [
  'paymentMethod' => 'required'
]);

$validator->sometimes('creditCardNumber', 'required|size:16', function ($input) {
  return $input->paymentMethod === PaymentMethod::CREDIT_CARD;
});
```

So here is what I came up with for ember-changeset:

```js
import { get } from '@ember/object';
import { validatePresence, validateLength } from 'ember-changeset-validations/validators';
import validateSometimes from 'ember-changeset-conditional-validations/validators/sometimes';

export default {
  creditCardNumber: validateSometimes([
    validatePresence(true),
    validateLength({ is: 16 })
  ], function(changes, content) {
    return get(changes, 'paymentMethod.isCreditCard') || get(content, 'paymentMethod.isCreditCard');
  })
};
```

The way this works is that you can specify any number of validation rules for a property, and they will only be applied if the callback function to `validateSometimes()` returns `true`. In this example, `paymentMethod` would be some kind of model with a computed property `isCreditCard`. The callback function is invoked with the changeset's `changes` and the original `content` object.

This works, but I didn't like having to check both the `changes` and the `content` object for the same property, so I added a `this.get(property)` method that essentially is a more terse version of the above.

```js
import { validatePresence, validateLength } from 'ember-changeset-validations/validators';
import validateSometimes from 'ember-changeset-conditional-validations/validators/sometimes';

export default {
  creditCardNumber: validateSometimes([
    validatePresence(true),
    validateLength({ is: 16 })
  ], function(changes, content) {
    return this.get('paymentMethod.isCreditCard');
  })
};
```

I have made this available as an addon called [ember-changeset-conditional-validations](https://github.com/skaterdav85/ember-changeset-conditional-validations) if you're interested in using it. If you've handled conditional validation differently, let me know how you did it in the comments!
