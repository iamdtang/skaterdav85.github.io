---
layout: post
title: Cascade Deleting Relationships in Ember Data
date: 2017-02-10
description: In Ember Data, if you delete a record from the store, related records are kept in the store. How do you cascade delete related records? Find out in this post.
keywords: ember data, ED, cascade delete, belongsTo, hasMany, unload relationships, eachRelationship, relationship options, snapshot
---

In Ember Data, if you delete a record from the store, related records are kept in the store. Let's say you have the following models:

```js
// app/models/post.js
export default DS.Model.extend({
  body: DS.attr(),
  comments: DS.hasMany()
});
```

```js
// app/models/comment.js
export default DS.Model.extend({
  body: DS.attr()
});
```

Let's assume a `post` record is loaded into the store along with its comments. If the post is deleted, it is unloaded from the store, but all of its comments remain in the store. Sometimes you want this. Sometimes you don't. If the comments are orphaned records and are no longer used, it might be a good idea to remove them to free up space.

One way to do this is to unload the related records manually. For example:

```js
let comments = post.hasMany('comments').value().toArray();
post.destroyRecord().then(() => {
  comments.forEach((comment) => {
    // need access to the store
    this.store.unloadRecord(comment);
  });
});
```

This works, but the clarity of the code suffers a little bit, especially if multiple related records need to be unloaded. Also, if this behavior is required in multiple places in your app, it can get repetitive.

Wouldn't it be nice if we could declaratively state that comments should be unloaded when `post.destroyRecord()` is called? Maybe something like this:

```js
// app/models/post.js
export default DS.Model.extend({
  body: DS.attr(),
  comments: DS.hasMany('comment', { cascadeDelete: true })
});
```

The `cascadeDelete` option isn't a property recognized by Ember Data, but we can configure our adapter to use it.

Let's create a mixin to contain this behavior and update our `application` adapter:

```js
// app/mixins/cascade-delete.js
import Ember from 'ember';

export default Ember.Mixin.create({
  // our implementation will go here
});
```

```js
// app/adapters/application.js
import DS from 'ember-data';
import CascadeDeleteMixin from './../mixins/cascade-delete';

export default DS.JSONAPIAdapter.extend(CascadeDeleteMixin, {
});
```

Now let's implement the mixin. From a high level, we'll override the `deleteRecord` method on the adapter. Before a record is deleted, we'll collect all related records that were declared with the `cascadeDelete` option. Then, we'll proceed to delete the record, and if the request succeeds, the collected related records will be unloaded from the store. Here is an implementation:

```js
import Ember from 'ember';

export default Ember.Mixin.create({
  deleteRecord(store, type, snapshot) {
    let recordsToUnload = [];

    // collect all records to unload into recordsToUnload variable
    snapshot.record.eachRelationship((name, descriptor) => {
      let { options, kind } = descriptor;
      let relationshipName = descriptor.key;

      if (options.cascadeDelete && kind === 'hasMany') {
        let hasManyRecordsArray = [];
        let hasManyRecords = snapshot.record.hasMany(relationshipName).value();
        if (hasManyRecords !== null) {
          hasManyRecordsArray = hasManyRecords.toArray();
        }
        recordsToUnload = recordsToUnload.concat(hasManyRecordsArray);
      }

      if (options.cascadeDelete && kind === 'belongsTo') {
        let belongsToRecords = snapshot.record.belongsTo(relationshipName).value();
        recordsToUnload = recordsToUnload.concat([ belongsToRecords ]);
      }
    });

    return this._super(...arguments).then((response) => {
      recordsToUnload.forEach((childRecord) => {
        store.unloadRecord(childRecord);
      });

      return response;
    });
  }
});
```

Now a more detailed explanation.

First, we can get access to the record we're about to delete from the snapshot via `snapshot.record`. Read more about Ember Data snapshots in [What are Ember Data Snapshots?](/2016/02/27/what-are-ember-data-snapshots.html).

Next, we can use the [DS.Model#eachRelationship](http://emberjs.com/api/data/classes/DS.Model.html#method_eachRelationship) method to iterate over the deleted record's relationships, which allows access to the `cascadeDelete` option through `descriptor.options`.

We can also get access to the relationship name "comments" with `descriptor.key`.

To get the related records, we can use Ember Data's `ds-references` feature to get the related data (i.e. comments) synchronously. Check out [this blog post on the Ember blog](http://emberjs.com/blog/2016/05/03/ember-data-2-5-released.html#toc_code-ds-references-code) to learn more about `ds-references`.

Lastly, the original `deleteRecord` on the adapter is called, and if that succeeds, the related records can be unloaded from the store.

Now, whenever a post is deleted, all of its comments will be unloaded from the store. This mixin can also be used to cascade delete `belongsTo` relationships.

Here is the [code](https://github.com/skaterdav85/cascade-delete-relationships-in-ember-data) in a working demo.

{% include promo.html %}
