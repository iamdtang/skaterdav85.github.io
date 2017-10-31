---
layout: assignment
title: Build an Unread Email Component using Data Down, Actions Up
date: 2017-10-30
---

Create a branch off of assignment 7 called `assignment8`:

```
git checkout -b assignment8
```

For this assignment, build a component that behaves like an email item in the list of emails in your Gmail inbox. If the email is unread, it should display the email title in bold. If the email has been read, the title shouldn't be bold. When the email title is clicked, it should invoke an action passed into the `onclick` attribute.

Your component should be used like the following:

```hbs
{% raw %}{{unread-email email=email onclick=(action "markAsRead")}}{% endraw %}
```

The email object passed into the component should look like the following:

```js
let email = {
  read: false,
  title: 'Sign up for Spring classes!'
};
```

The `markAsRead` action should set `email.read` to `true`.

Be sure to test this component out with an email object where the `read` property starts off as `true`.

## Submission

```
git add --all
git commit -m 'your commit message here'
git push origin assignment8
```

Send an email to the TA and myself with a link to this branch.
