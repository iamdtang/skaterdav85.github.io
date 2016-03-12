---
layout: post
title: Promises and Closure Actions in Ember
date: 2016-03-12
description: TL;DR - If both resolve and rejection handlers are executing unintentionally, you might be forgetting to throw after you catch.
keywords: ember, promises, RSVP, closure actions, catch, error, reject, throw, both resolve and reject are executing, Promises/A+, RSVP vs jQuery promises
---

Recently I was working with closure actions and learned something new about promises in the process. So you're probably familiar with this:

```js
promise.then(() => {
  console.log('success');
}, () => {
  console.log('error');
}).finally(() => {
  console.log('finally');
});
```

If the promise resolves, "success" and "finally" are logged. If the promise rejects, "error" and "finally" are logged.

Now what about this?

```js
promise.catch(() => {
  console.log('catch');
}).then(() => {
  console.log('success');
}, () => {
  console.log('error');
}).finally(() => {
  console.log('finally');
});
```

If you aren't familiar with `catch()`, it is syntactic sugar for `then(undefined, onRejection)`.

Similarly, if the promise resolves, "success" and "finally" are logged. However, if the promise rejects, "catch", "success", and "finally" are logged. This threw me off for a bit. Why is the success handler still getting called when the promise rejects? If you've worked with jQuery promises either by themselves or with a library like Backbone, it doesn't work like this. If a promise rejects, each rejection handler gets called. <a href="http://jsbin.com/wujahutazu/edit?js,console" target="_blank">Try it yourself here</a>. This is because jQuery promises are not compliant with the Promise/A+ standard whereas RSVP is, and the standard states:

<div>
  <blockquote>
  2.2.7.1 If either onFulfilled or onRejected returns a value x, run the Promise Resolution Procedure [[Resolve]](promise2, x).
  </blockquote>

  <blockquote>
  2.2.7.2 If either onFulfilled or onRejected throws an exception e, promise2 must be rejected with e as the reason.
  </blockquote>
</div>

You can <a href="https://promisesaplus.com/" target="_blank">read more about the Promises/A+ standard here</a>.

So how do you make subsequent rejection handlers get called in the promise chain? Simply throw the error.

```js
promise.catch((error) => {
  console.log('catch');
  throw error;
}).then(() => {
  console.log('success');
}, () => {
  console.log('error');
}).finally(() => {
  console.log('finally');
});
```

Now what gets logged is "catch", "error", and "finally". <a href="http://jsbin.com/tugibehuja/edit?js,console" target="_blank">Try it yourself here</a>

So you might be wondering, when would you be in a situation where rejection handlers are specified before any resolve handlers in the promise chain? Recently I found myself in this situation when I was using closure actions.

```js
// app/controllers/new-post.js
export default Ember.Controller.extend({
  actions: {
    createPost(postData) {
      let post = this.store.createRecord('post', postData);
      return post.save().catch((error) => {
        let controller = this.get('controller');
        controller.set('error', 'Oops, something went wrong!');
        throw error;
      });
    }
  }
});
```

Here I have a `createPost` action on the controller for the `new-post` route. In my template, I pass this action to the `post-form` component using a closure action.

{% raw %}
```html
<!-- app/templates/new-post.hbs -->
<h1>Create Post</h1>
{{post-form submit=(action 'createPost')}}
```
{% endraw %}

In my `post-form` component template, an action named `save` is called when the form is submitted.

{% raw %}
```html
<!-- app/templates/components/post-form.hbs -->
<form onsubmit={{action 'save'}}>
  ...
</form>
```
{% endraw %}

The `save` action on the component then calls the `submit` closure action.

```js
// app/components/post-form.js
export default Ember.Component.extend({
  actions: {
    save() {
      let postData = this.get('postData');
      return this.get('submit')(postData).then(() => {
        // do stuff like clear out the form
      }, () => {
        // do stuff like highlight invalid fields
      });
    }
  }
});
```

In this example with a closure action, the promise chain executed in the following order:

```js
post.save()
  .catch((error) => {
    let controller = this.get('controller');
    controller.set('error', 'Oops, something went wrong!');
    throw error;
  }).then(() => {
    // do stuff like clear out the form
  }, () => {
    // do stuff like highlight invalid fields
  });
```

Without that `throw error` in the `catch`, both the catch handler and the success handler would run, which wasn't expected.

__TL;DR__ If both resolve and rejection handlers are executing unintentionally, you might be forgetting to throw after you catch.
