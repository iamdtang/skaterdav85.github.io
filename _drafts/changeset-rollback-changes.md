## Rolling Back Model Changes on Server-side Validation Errors

Let's say we are updating a post titled "Post 2" to "Post 1" and then save the changeset.

```js
export default Controller.extend({
  savePostTask: task(function* (changeset) {
    yield changeset.save();
  })
});
```

Imagine the API request returns server-side validation errors for the post's title attribute, because the "Post 1" title has already been taken.

Note, the [ember-changeset README](https://github.com/poteto/ember-changeset#handling-server-errors) documents how to push API validation errors onto a changeset.

That works well, but the changeset's underlying model has those invalid changes. If our UI consists of a list of blog post titles and the post form is in a drawer that slides in from the right side of the screen, then our UI will like this:

![example UI with a list of blogs posts on the left that show the invalid changes and the post form on the right](/images/ember-changeset-blog-post.png)

We see Post 1 twice in the list.

The way I've handled this is by rolling back the changes on the underlying model when there are server-side errors. For example:

```js
export default Controller.extend({
  post: alias('model'),
  savePostTask: task(function* (changeset) {
    try {
      yield changeset.save();
    } catch(e) {
      this.post.rollbackAttributes();
      return reject();
    }
  })
});
```
