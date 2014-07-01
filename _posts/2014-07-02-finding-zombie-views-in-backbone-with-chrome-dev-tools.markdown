---
layout: post
title:  "An Introduction to Finding Memory Leaks in Backbone Applications with Chrome Developer Tools"
date:   2014-07-02
categories: JavaScript, Backbone, Memory
---

An Introduction to Finding Memory Leaks in Backbone Applications with Chrome Developer Tools
============================================================

As stated on the [Chrome Developer Tools - JavaScript Profiling site](https://developer.chrome.com/devtools/docs/javascript-memory-profiling),

> A memory leak is a gradual loss of available computer memory. It occurs when a program repeatedly fails to return memory it has obtained for temporary use. JavaScript web apps can often suffer from similar memory related issues that native applications do, such as leaks and bloat but they also have to deal with garbage collection pauses.

In this post, I'd like to present an introductory exploration of finding memory leaks in Backbone applications using Chrome Developer Tools. When it came to memory management and using Backbone, I kept reading that the solution was to use _.listenTo()_ as opposed to _.on()_, but I still had several questions so I set out to build a simple Backbone page and try to answer the following questions:

1. How can I identify memory leaks in Chrome Developer Tools?
2. Does replacing the innerHTML of a collection view destroy model views and prevent zombie views?
3. How can I measure and verify Question 2?

### Memory Profiling with Simple Native JavaScript

Let's start off with a simple HTML page that loads Backbone and its dependencies.

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

Take a Heap Snapshot by opening up the Profiles tab in Chrome Developer Tools. 

![heap snapshot 1](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot1.png)

If you look at the list of HTML* constructors, there aren't any _HTMLLIElement_ instances on the page, meaning no li elements were created via JavaScript. Let's go ahead and create an li element and take a heap snapshot.

```js
(function() {

var li = document.createElement('li');
li.innerText = 'Person 1';
document.querySelector('#people-container').appendChild(li);

})();
```

First off, yes we are putting an li element in a div without a ul or ol element. Later on this will be changing. Take a heap snapshot.

![heap snapshot 2](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot2.png)

You'll notice that the object count for HTMLLIElement is 2. The first count is for the _HTMLLIElement_ constructor itself and the second is for the li instance that we just created saved to the variable li. Behind the scenes, _document.createElement()_ is making use of the HTMLLIElement constructor and the factory pattern to create list item elements. The global _document_ object has a reference to the li object so it has not gone out of scope to be garbage collected.

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

By setting the innerHTML of _#people-container_ to an empty string, the list item has been removed from the DOM and the li instance that we created has gone out of scope. The document object no longer has a reference to the li object we created so it was garbage collected. The 1 under _Objects Count_ corresponds to the _HTMLLIElement_ constructor that was used to initially create the li element.

Now what happens if we do the same exact thing as above without wrapping our code in an immediately invoked function expression (IIFE)?

```js
var li = document.createElement('li');
li.innerText = 'Person 1';
document.querySelector('#people-container').appendChild(li);
document.querySelector('#people-container').innerHTML = '';
```
![heap snapshot 4](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot4.png)

You will notice that we have an object count of 2 again. Why would there be an object count of 2 if the li we created was removed by setting the innerHTML of _#people-container_ to an empty string? Even though we have removed the li element from the DOM, there is still a reference to our li variable on the window object since we created it as a global variable. Thus, the li object cannot be garbage collected.

> The garbage collector will not clean up global variables during the page's life cycle.

### Memory Profiling with Backbone

Let's set up the code so that we have a Backbone Collection of people rendered in a Collection View where each model in the collection has its own Model View. This is a very common Backbone scenario.

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

We can also see 5 _HTMLLIElement_ objects from our heap snapshot. 1 for the HTMLLIElement constructor and 4 li elements created from _PersonView_ for each person rendered in our collection view.

![heap snapshot 5](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot5.png)

Now let's modify _#people-container_ and set its innerHTML to an empty string temporarily and take a heap snapshot.

```js
$('#people-container').append(peopleView.el).html('');
```

![heap snapshot 6](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot6.png)

As like before, removing the list items from the DOM by setting the innerHTML of _#people-container_ to an empty string allowed the garbage collector to clean up all _HTMLLIElement_ instances from memory.

#### Model Changes and Persisting the Collection

Let's make 2 changes to our code. The first thing we are going to do is have our _PersonView_ objects re-render whenever its model changes.

```js
var PersonView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},
	tagName: 'li',
	className: 'person',
	render: function() {
		console.log('rendering');
		var html = this.model.get('id') + ' - ' + this.model.get('name');
		this.$el.html(html);
	}
});
```

I have set up this event binding in our _initialize()_ method. The next thing I will do is store the _people_ variable on the window object so that we can persist this Backbone Collection. Many times in a Backbone application you will keep a collection around in memory so that you can do something with that data such as filter it. It doesn't really matter where you store it. The key thing here is that it is still in memory somewhere.

```js
// previous code here

// remove the li's from the page
$('#people-container').append(peopleView.el).html('');

// store off the people collection onto the window object
window.people = people;
```

Now let's take a heap snapshot.

![heap snapshot 7](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot7.png)

What you'll notice now is that our list item elements are still being kept in memory and are not able to be garbage collected even though we have removed them from our page. Why?

Remember from before that global variables will not be cleaned up by the garbage collector? In this case, our PersonView objects are not being cleaned up. We are intentially keeping the people collection around by storing it on the window object. Each model in the collection has a reference to the corresponding _PersonView_. This happened when we told our _PersonView_ to re-render if its model changes.

```js
this.listenTo(this.model, 'change', this.render);
```

We can see that the model has a reference to the render method. Because it has a reference to the render method, it cannot garbage collect this view. This is whats called a zombie view, a view that sticks around in memory when we think it has been gone and it comes back to haunt us and bring our applications down.

#### How to we remove views?

What is the proper way to remove these views? Rather than just replacing the innerHTML which doesn't remove our _PersonView_ objects, we should call a _remove()_ method on our view objects that _Backbone.View_ provides. Backbone will unbind views that listen to models or collections to prevent our data from hanging on to view references which prevents our views from being garbage collected.

Instead of this:

```js
$('#people-container').append(peopleView.el).html('');
```

We will do this:

```js
var PeopleView = Backbone.View.extend({
	initialize: function() {
		this.childViews = [];
	},
	tagName: 'ul',
	id: 'people',
	render: function() {
		this.collection.each(function(model) {
			var view = new PersonView({
				model: model
			});

			view.render();
			this.childViews.push(view);
			this.$el.append(view.el);
		}, this);
	}
});

var peopleView = new PeopleView({
	collection: people
});

peopleView.render();

$('#people-container').append(peopleView.el);

peopleView.childViews.forEach(function(personView) {
	personView.remove();
});
```

They key thing to note here is that in our _PeopleView_ collection view, we store off references of our model views into a property called childViews. Then later on, rather than replacing the innerHTML of _#people-container_, we iterated over all of the child views and called the remove method. By doing this, Backbone unbinds each _PersonView_ instance from its model before it is removed from the DOM, thus allowing our view objects to be garbage collected and freeing up memory.

### Conclusion

After reading Building Backbone Plugins by Derick Bailey and several of his articles on Zombie Views, I wanted to try this out myself with an emphasis of finding memory leaks in Chrome Developer Tools. I highly recommend checking out his articles which I have posted below since he can explain memory leaks and Backbone a whole lot better, but hopefully this has been a useful way of finding these zombie views and tracking them down in Chrome.


### References

* [Backbone.js And JavaScript Garbage Collection](http://lostechies.com/derickbailey/2012/03/19/backbone-js-and-javascript-garbage-collection/)
* [Building Backbone Plugins](https://leanpub.com/building-backbone-plugins)
* [Managing Events As Relationships, Not Just References](http://lostechies.com/derickbailey/2013/02/06/managing-events-as-relationships-not-just-references/)
* [Zombies! RUN!](http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/)
* [JavaScript Memory Profiling - Chrome Developer Tools](https://developer.chrome.com/devtools/docs/javascript-memory-profiling)
