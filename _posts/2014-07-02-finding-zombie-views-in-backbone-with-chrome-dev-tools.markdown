---
layout: post
title:  "Finding Zombie Views in Backbone with Chrome Dev Tools"
date:   2014-07-02
categories: JavaScript, Backbone, Memory
---

Finding Zombie Views in Backbone with Chrome Developer Tools
============================================================

Let's start off with a simple HTML page that loads Backbone.

```html
<!DOCTYPE html>
<html>
<head>
	<title>Demo</title>
</head>
<body>

<div id="people-container"></div>

<script src="http://code.jquery.com/jquery-1.11.1.js"></script>
<script src="http://jashkenas.github.io/underscore/underscore-min.js"></script>
<script src="http://jashkenas.github.io/backbone/backbone-min.js"></script>

</body>
</html>
```

Let's take a Heap Snapshot by opening up the Profiles tab in Chrome Developer Tools. If you look at the list of HTML* constructors, there aren't any HTMLLIElement instances on the page, meaning no li elements were created.

![heap snapshot 1](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot1.png)

Let's go ahead and create an li element and take a heap snapshot.

```js
(function() {

var li = document.createElement('li');
li.innerText = 'Person 1';
document.querySelector('#people-container').appendChild(li);

})();
```

![heap snapshot 2](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot2.png)

You'll notice that the object count for HTMLLIElement is 2. The first count is for the HTMLLIElement constructor itself and the second is for the li instance that we just created saved to the variable li.

Now what happens when I replace the innerHTML of #people-container? Let's find out.

```js
(function() {

var li = document.createElement('li');
li.innerText = 'Person 1';
document.querySelector('#people-container').appendChild(li);
document.querySelector('#people-container').innerHTML = '';

})();
```

![heap snapshot 3](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot3.png)

By replacing the innerHTML of #people-container, the li instance that we created has been removed and garbage collected from memory. The 1 under Objects Count corresponds to the HTMLLIElement constructor that was used to initially create the li element. The li variable went out of scope so it was garbage collected.

Now what happens if we do the same exact thing as above but without wrapping our code in an immediately invoked function expressions (IIFE)?

```js
var li = document.createElement('li');
li.innerText = 'Person 1';
document.querySelector('#people-container').appendChild(li);
document.querySelector('#people-container').innerHTML = '';
```
![heap snapshot 4](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot4.png)

You will notice now that we have an object count of 2 again. Why? Even though we have removed the li element, there is still a reference to our li variable on the window object. Thus, the li object cannot be garbage collected.

> The garbage collector will not clean up global variables during the page's life cycle.

### References

* [Backbone.js And JavaScript Garbage Collection](http://lostechies.com/derickbailey/2012/03/19/backbone-js-and-javascript-garbage-collection/)
