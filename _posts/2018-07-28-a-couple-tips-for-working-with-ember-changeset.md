---
layout: post
title: Tracking hasMany Relationship Changes With ember-changeset
date: 2018-07-28
description: This post covers how I handled tracking hasMany relationship changes with ember-changeset.
image: tracking-has-many-relationship-changes-with-ember-changeset.png
image_alt: Screenshot of code snippets from this post
keywords: ember-changeset, ember.js, tracking hasMany relationship changes
---

I've been using [ember-changeset](https://github.com/poteto/ember-changeset) at work for a handful of forms, and it works great! However, tracking `hasMany` relationships can be a little tricky.

This post is based on version 1.3.0 of [ember-changeset](https://github.com/poteto/ember-changeset), [which I believe is the most stable version at the time of this writing](https://github.com/poteto/ember-changeset/issues/299).

Let's say we have a form where we are applying tags to a post. If we look at the [README](https://github.com/poteto/ember-changeset) or [the example demo](https://ember-twiddle.com/e5eaa7bee6ed76257f5a62e618c315e8?fileTreeShown=false&openFiles=templates.application.hbs,), there aren't examples of tracking `hasMany` relationship changes. If we are doing this without a changeset, we might do something like:

```js
post.get('tags').pushObject(tag);
```

or if we're removing a tag:

```js
post.get('tags').removeObject(tag);
```

We might think to try:

```js
postChangeset.get('tags').pushObject(tag);
```

But this approach has some subtle issues. The issue here is that the changeset won't track the changes to the `tags` relationship because we are modifying the `hasMany` reference directly. Thus, changeset properties like `change`, `isInvalid`, and others might not work the way as expected.

Here has been my solution:

```js
// app/utils/ember-changeset.js
export function addToHasMany(changeset, relationship, item) {
  let hasMany = changeset.get(relationship).pushObjects([item]);
  changeset.set(relationship, hasMany.toArray());
}

export function removeFromHasMany(changeset, relationship, item) {
  let hasMany = changeset.get(relationship).removeObject(item);
  changeset.set(relationship, hasMany.toArray());
}
```

I've used the previous approach but then call `changeset.set()` with a new array reference. Note that `pushObjects` was used instead of `pushObject`. This is because `pushObjects` returns the array reference whereas `pushObject` returns the same object that was passed to it as a param.



Have you dealt with tracking `hasMany` relationship changes differently? Let me know on [Twitter](https://twitter.com/iamdtang)!
