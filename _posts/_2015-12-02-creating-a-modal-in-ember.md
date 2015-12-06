---
layout: post
title:  "Creating a Modal in Ember"
date:   2015-12-02
description: How to create a modal in Ember
keywords: modal in Ember, ember modals, custom modals, ember, modal
---

The key to creating modals in Ember is working with named outlets.

```html
<!-- templates/application.hbs -->
{{outlet 'modal'}}
```

```js
// routes/books/book.js
export default Ember.Route.extend({
  renderTemplate() {
    this.render('books.book', {
      into: 'application',
      outlet: 'modal'
    });
  },

  actions: {
    close() {
      this.transitionTo('books');
    }
  }
});
```

```html
<!-- templates/books/book.hbs -->

```

```css
/* styles/app.css */

```
