---
layout: post
title:  "Finding Zombie Views in Backbone with Chrome Dev Tools"
date:   2014-07-02
categories: JavaScript, Backbone, Memory
---

Finding Zombie Views in Backbone with Chrome Developer Tools
============================================================

### Memory Profiling with Simple Native JavaScript

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
<script>
// our code will go here
</script>

</body>
</html>
```

Let's take a Heap Snapshot by opening up the Profiles tab in Chrome Developer Tools. If you look at the list of HTML* constructors, there aren't any HTMLLIElement instances on the page, meaning no li elements were created via JavaScript.

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

First off, yes we are putting an li element in a div without a ul or ol element. Later on this will be changing but deal with it for now.

You'll notice that the object count for HTMLLIElement is 2. The first count is for the HTMLLIElement constructor itself and the second is for the li instance that we just created saved to the variable li. Behind the scenes, document.createElement is making use of the HTMLLIElement constructor through the factory pattern. The global _document_ object has a reference to the li object so it has not gone out of scope and been garbage collected.

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

By setting the innerHTML of _#people-container_ to an empty string, the list item has been removed from the DOM and the li instance that we created has gone out of scope and been garbage collected since the document object no longer has a reference to the li object we created. The 1 under _Objects Count_ corresponds to the HTMLLIElement constructor that was used to initially create the li element.

Now what happens if we do the same exact thing as above without wrapping our code in an immediately invoked function expressions (IIFE)?

```js
var li = document.createElement('li');
li.innerText = 'Person 1';
document.querySelector('#people-container').appendChild(li);
document.querySelector('#people-container').innerHTML = '';
```
![heap snapshot 4](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot4.png)

You will notice that we have an object count of 2 again. Why would there be an object count of 2 if the li we created was removed? Even though we have removed the li element from the DOM, there is still a reference to our li variable on the window object since we created it as a global variable. Thus, the li object cannot be garbage collected.

> The garbage collector will not clean up global variables during the page's life cycle.

### Memory Profiling with Backbone

Let's set up the code so that we have a Backbone Collectio of people rendered in a Collection View where each model in the collection has its own Model View. This is a very common Backbone situation.

```js
(function() {

var people = new Backbone.Collection([
	{ id: 1, name: 'David' },
	{ id: 2, name: 'Jane' },
	{ id: 3, name: 'Sam' },
	{ id: 4, name: 'Max' }
]);

// A Model View (an item view)
var PersonView = Backbone.View.extend({
	tagName: 'li',
	className: 'person',
	render: function() {
		console.log('rendering');
		var html = this.model.get('id') + ' - ' + this.model.get('name');
		this.$el.html(html);
	}
});

// A Collection View
var PeopleView = Backbone.View.extend({
	tagName: 'ul',
	id: 'people',
	render: function() {
		this.collection.each(function(model) {
			var view = new PersonView({
				model: model
			});
				
			view.render();
			this.$el.append(view.el);
		}, this);
	}
});

// And to kick it all off ...
var peopleView = new PeopleView({
	collection: people
});

peopleView.render();

$('#people-container').append(peopleView.el);

})();
```

With this bit of code, we can see each person from our collection being rendered on the screen. 

* 1 - David
* 2 - Jane
* 3 - Sam
* 4 - Max

We can also see 5 HTMLLIElement objects from our heap snapshot. 1 for the HTMLLIElement constructor and 4 li elements created from _PersonView_ for each person rendered in our collection view.

![heap snapshot 5](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot5.png)

Now let's modify _#people-container_ and set its innerHTML to an empty string temporarily and take a heap snapshot.

```js
$('#people-container').append(peopleView.el).html('');
```

![heap snapshot 6](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot6.png)

As like before, removing the list items from the DOM by setting the innerHTML of _#people-container_ to an empty string allowed the garbage collector to clean up all HTMLLIElement instances from memory.

### References

* [Backbone.js And JavaScript Garbage Collection](http://lostechies.com/derickbailey/2012/03/19/backbone-js-and-javascript-garbage-collection/)
