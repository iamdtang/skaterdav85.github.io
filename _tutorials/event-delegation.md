---
layout: post
title: Event Delegation
date: 2017-08-31
description: Event delegation examples using jQuery
keywords: event delegation, jquery
---

Say you have the following code:

```html
<ul>
  <li>Patrick</li>
  <li>Trina</li>
  <li>David</li>
</ul>
```

```js
$('li').on('click', function() {
  var name = $(this).text();
  console.log(name);
});
```

Everything works fine. Then you add a feature where users can add names to the list:

```html
<input type="text" id="name">
<button type="button">Add Name</button>
```

```js
$('button').on('click', function() {
  var name = $('#name').val();
  $('ul').append('<li>' + name + '</li>');
});
```

Everything seems ok, but then you click on the new names you added, and realize the click event on the `li` isn't working on these new items in the list.

[Try it here](http://jsbin.com/habuyolawu/1/edit?html,js,console,output)

The reason for this is because the click event listener was bound to all the `li` tags when the page rendered, but not any new ones that happen after page render.

One way to solve this is to bind the same click listener to new list items. Kind of tedious though. Instead, we can use a technique called event delegation. jQuery [defines event delegation](https://learn.jquery.com/events/event-delegation/) as:

> Event delegation allows us to attach a single event listener, to a parent element, that will fire for all descendants matching a selector, whether those descendants exist now or are added in the future.

Event delegation isn't specific to jQuery, but achieving it through jQuery is really simple!

Instead of binding the click listener to all list items, we can do this:

```js
$('ul').on('click', 'li', function() {
  var name = $(this).text();
  console.log(name);
});
```

[Try it here](http://jsbin.com/kijujawaye/1/edit?html,js,console,output)

Here we're attaching the click listener to some parent element that is always on the page, the `ul` in this case, and whenever a click happens on an `li`, the event will bubble up to the `ul`, and the event listener on the `ul` will be invoked. The callback function where the name is logged to the console will only be fired if the thing that was clicked matches the selector `li`.

This technique also has some performance benefits. Before, a click listener was added to every list item. With event delegation, only one click listener is added (to the `ul`). Much fewer event listeners.
