---
layout: post
title: When to use the @computed decorator in Ember
date: 2020-10-21
description: This post covers when to use the @computed decorator in Ember.
keywords: ember, @computed, decorator
image: ember
---

Let's say we have the following:

```js
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  firstName = 'David';
  lastName = 'Tang';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @action
  updateFullName() {
    this.setProperties({
      firstName: 'Kevin',
      lastName: 'Stenerson'
    });
  }
}
```

```hbs
{% raw %}
{{this.fullName}}
<button {{on "click" this.updateFullName}}>Click me</button>
{% endraw %}
```

When we click the button, `fullName` won't recompute. [Try it here](https://ember-twiddle.com/13f65868863d7fdde83d7016174b205f?openFiles=controllers.application%5C.js%2C).

We can fix this by adding the `@computed` decorator to `fullName`, as follows:

```js
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';

export default class ApplicationController extends Controller {
  firstName = 'David';
  lastName = 'Tang';

  @computed('firstName', 'lastName')
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @action
  updateFullName() {
    this.setProperties({
      firstName: 'Kevin',
      lastName: 'Stenerson'
    });
  }
}
```

Now when we click the button, `fullName` recomputes. [Try it here](https://ember-twiddle.com/263a6212c737569449f826072403b038?openFiles=controllers.application%5C.js%2C).

This is analogous to the following using Ember's classic classes:

```js
export default Controller.extend({
  firstName: 'David',
  lastName: 'Tang',

  fullName: computed('firstName', 'lastName', function () {
    return `${this.firstName} ${this.lastName}`;
  }),

  actions: {
    updateFullName() {
      this.setProperties({
        firstName: 'Kevin',
        lastName: 'Stenerson'
      });
    }
  }
});
```

We can remove the `@computed` decorator if we change `firstName` and `lastName` to be tracked properties via the `@tracked` decorator, as follows:

```js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked firstName = 'David';
  @tracked lastName = 'Tang';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @action
  updateFullName() {
    this.setProperties({
      firstName: 'Kevin',
      lastName: 'Stenerson'
    });
  }
}
```

[Try it here](https://ember-twiddle.com/5da4c53793769b7c243c8354a865e8aa?openFiles=controllers.application%5C.js%2C)

Now because we've changed `firstName` and `lastName` to be tracked properties, we no longer need `set()` or `setProperties()`. We can update `firstName` and `lastName` in our `updateFullName()` action to use standard JavaScript assignment as shown below:

```js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked firstName = 'David';
  @tracked lastName = 'Tang';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @action
  updateFullName() {
    this.firstName = 'Kevin';
    this.lastName = 'Stenerson';
  }
}
```

[Try it here](https://ember-twiddle.com/47464a630039e049efb6878ce9c71637?openFiles=controllers.application%5C.js%2C)

We can also create getters that depend on other getters, and they'll recompute whenever the dependent properties change. For example, let's create a `fullNameUpperCased` getter that reads `fullName`.

```js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked firstName = 'David';
  @tracked lastName = 'Tang';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get fullNameUpperCased() {
    return this.fullName.toUpperCase();
  }

  @action
  updateFullName() {
    this.firstName = 'Kevin';
    this.lastName = 'Stenerson';
  }
}
```

```hbs
{% raw %}
{{this.fullName}} - {{fullNameUpperCased}}
<button {{on "click" this.updateFullName}}>Click me</button>
{% endraw %}
```

We can see that the `fullNameUpperCased` getter recomputes when `fullName` changes. [Try it here](https://ember-twiddle.com/794aca5f89e6044397bb19d281da24b4?openFiles=controllers.application%5C.js%2C).

One last thing to mention is that computed properties can't rely on getters. For example, `fullNameUpperCased` can't be a computed property that depends on the `fullName` getter. The following won't work:

```js
import Controller from '@ember/controller';
import { action, computed } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ApplicationController extends Controller {
  @tracked firstName = 'David';
  @tracked lastName = 'Tang';

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  @computed('fullName')
  get fullNameUpperCased() {
    return this.fullName.toUpperCase();
  }

  @action
  updateFullName() {
    this.firstName = 'Kevin';
    this.lastName = 'Stenerson';
  }
}
```

[Try it here](https://ember-twiddle.com/42a242835a4daad39eeb070f173e752b?openFiles=controllers.application%5C.js%2C). We can see that `fullNameUpperCased` in the template doesn't update when we click the button, but `fullName` does.
