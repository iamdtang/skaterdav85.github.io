---
layout: post
title: Extracting Metadata from a Custom API with Ember Data
date: 2018-04-06
description: In this post, we'll cover how to extract metadata from a customer API with Ember Data.
image: extracting-metadata.png?cache-bust
image_alt: screenshot of code from this blog post
keywords: ember data, metadata, meta, ember, custom, API, backend, non-standard
---

When querying an API, sometimes metadata is returned such as pagination information. For example:

```js
{
  post: [
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' },
    { id: 3, title: 'Post 3' }
  ],
  meta: {
    total: 100
  }
}
```

With the response above, we can access `meta` off of the result of our `store.query()` call:

```js
export default Route.extend({
  model() {
    return this.store.query('post', { page: 1 });
  },
  afterModel(posts) {
    console.log('Meta: ', posts.get('meta')); // { total: 100 }
  }
});
```

Great, but what if our API isn't structured like above? Let's say we have something like this instead:

```js
{
  total: 100,
  items: [
    { id: 1, title: 'Post 1' },
    { id: 2, title: 'Post 2' },
    { id: 3, title: 'Post 3' }
  ]
}
```

This response doesn't fit any of the expected serializer formats, but it can easily be normalized into either the `DS.JSONSerializer` or `DS.RESTSerializer` format. If you're not familiar with the different Ember Data serializer formats, check out my other post, [Which Ember Data Serializer Should I Use?](/2015/12/05/which-ember-data-serializer-should-i-use.html).

Let's try normalizing this response for `DS.JSONSerializer`:

```js
import DS from 'ember-data';

const { JSONSerializer } = DS;

export default JSONSerializer.extend({
  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    return this._super(store, primaryModelClass, payload.items, id, requestType);
  }
});
```

Cool, that works. Next, let's extract the metadata. Looking at the API documentation for `DS.JSONSerializer`, my first thought was to use the [`extractMeta(store, modelClass, payload)`](https://www.emberjs.com/api/ember-data/3.0/classes/DS.JSONSerializer/methods/extractMeta?anchor=extractMeta) method. I tried something like this:

```js
import DS from 'ember-data';

const { JSONSerializer } = DS;

export default JSONSerializer.extend({
  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    return this._super(store, primaryModelClass, payload.items, id, requestType);
  },
  extractMeta(store, modelClass, payload) {
    console.log('payload', payload);
  }
});
```

Unfortunately, the payload logged to the console in `extractMeta()` was the following:

```js
[
  { id: 1, title: 'Post 1' },
  { id: 2, title: 'Post 2' },
  { id: 3, title: 'Post 3' }
]
```

No sight of that `total` property. It turns out, `extractMeta()` gets called after `normalizeArrayResponse()`, so `payload` in `extractMeta` isn't the original payload; it is the normalized one. If we think about it, the expected format of `DS.JSONSerializer` for a collection of resources doesn't even allow for a `meta` object, as the expected response is an array of objects, so why is this method even present on this class? Good question! If you know the answer, please let me know in the comments 😃.

So how can we make this work? Instead of extending `DS.JSONSerializer`, we can extend the `DS.RESTSerializer`:

```js
import DS from 'ember-data';

const { RESTSerializer } = DS;

export default RESTSerializer.extend({
  normalizeArrayResponse(store, primaryModelClass, payload, id, requestType) {
    payload[primaryModelClass.modelName] = payload.items;
    delete payload.items;
    return this._super(...arguments);
  },
  extractMeta(store, modelClass, payload) {
    let { total } = payload;
    payload.meta = { total };
    delete payload.total;
    return this._super(...arguments);
  }
});
```

Here we are normalizing the payload to fit the `DS.RESTSerializer` format, which involves changing the `items` key to `post`. The normalized payload gets passed into `extractMeta`, which still has `total`. We can then assign `total` as a property in a `meta` object.

That's it! Now the result of `store.query()` has a `meta` property. 🙌

In closing, although we could have used either `DS.JSONSerializer` or `DS.RESTSerializer` to normalize this payload, `DS.RESTSerializer` allows for extracting metadata off of collection responses. This might be one thing to consider when working with a custom API and deciding on which serializer to extend.

[Here is the code from this post.](https://github.com/skaterdav85/extracting-metadata-in-ember-data)

{% include promo.html %}

Comments for this post can be found [on this GitHub issue.](https://github.com/skaterdav85/extracting-metadata-in-ember-data/issues/1)
