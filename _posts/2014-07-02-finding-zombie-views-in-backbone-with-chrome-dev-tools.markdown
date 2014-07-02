---
layout: post
title:  "An Introduction to Finding Memory Leaks in Backbone Applications with Chrome Developer Tools"
date:   2014-07-02
categories: JavaScript, Backbone, Memory
---

An Introduction to Finding Memory Leaks in Backbone Applications with Chrome Developer Tools
============================================================

When it comes to memory management and JavaScript applications using Backbone, you'll often hear about zombie views and how easy it is to unintentionally create memory leaks. The suggested solution to preventing memory leaks in Backbone applications most often comes down to using _.listenTo()_ as opposed to _.on()_ when setting up views that can respond to model and collection changes. Recently, since I have started working with Backbone again quite a bit at work, I wanted to learn how to find and verify memory leaks in a browser's developer tools so that I can be more prepared for when I am faced with an application that is having memory problems. Therefore, I set out to build an extremely simple Backbone page to try and answer my own questions.

1. How can I identify memory leaks in a browser's developer tools?
2. Does replacing the innerHTML of a collection view destroy model views and prevent zombie views?
3. How can I measure and verify question 2?

This post provides my introductory exploration of finding memory leaks in Backbone applications using Chrome Developer Tools. 

### What is a Memory Leak?

As stated on the [Chrome Developer Tools - JavaScript Profiling site](https://developer.chrome.com/devtools/docs/javascript-memory-profiling),

> A memory leak is a gradual loss of available computer memory. It occurs when a program repeatedly fails to return memory it has obtained for temporary use. JavaScript web apps can often suffer from similar memory related issues that native applications do, such as leaks and bloat but they also have to deal with garbage collection pauses.

### Memory Profiling with Simple Native JavaScript

Let's start off with a simple HTML page that loads Backbone and its dependencies for our later examples.

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

![snapshot 0](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot0.png)

Then, click on "Take Snapshot".

![heap snapshot 1](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot1.png)

If you look at the list of HTML* constructors, nothing shows up for the _HTMLLIElement_ constructor. This is because there aren't any _li_ nodes on the page. If you've never heard of the _HTMLXXX_ constructors such as _HTMLLIElement_, they are the constructor functions used to create various DOM nodes. Let's go ahead and create an _li_ element and take a heap snapshot.

```js
(function() {

var li = document.createElement('li');
li.innerText = 'Person 1';
document.querySelector('#people-container').appendChild(li);

})();
```

First off, yes we are putting an _li_ element in a _div_ without a _ul_ or _ol_ element. Later on this will be changing. Take another heap snapshot.

![heap snapshot 2](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot2.png)

You'll notice that the object count for _HTMLLIElement_ is 2. The first count is for the _HTMLLIElement_ constructor function itself and the second is for the _li_ instance that we just created saved to the variable _li_. Behind the scenes, _document.createElement()_ is making use of the _HTMLLIElement_ constructor and the factory pattern to create list item elements. The global _document_ object has a reference to the _li_ object so it cannot be garbage collected.

Now what happens when I replace the _innerHTML_ of _#people-container_? Let's find out.

```js
(function() {

var li = document.createElement('li');
li.innerText = 'Person 1';
document.querySelector('#people-container').appendChild(li);
document.querySelector('#people-container').innerHTML = '';

})();
```

![heap snapshot 3](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot3.png)

By setting the _innerHTML_ of _#people-container_ to an empty string, the list item has been removed from the DOM and the _li_ instance that we created has gone out of scope. The document object no longer has a reference to the _li_ object we created so it was garbage collected. The 1 under _Objects Count_ corresponds to the _HTMLLIElement_ constructor that was used to initially create the _li_ element.

Now what happens if we do the same exact thing as above without wrapping our code in an immediately invoked function expression (IIFE)?

```js
var li = document.createElement('li');
li.innerText = 'Person 1';
document.querySelector('#people-container').appendChild(li);
document.querySelector('#people-container').innerHTML = '';
```
![heap snapshot 4](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot4.png)

You will notice that we have an object count of 2 again. Why would there be an object count of 2 if the _li_ we created was removed by setting the _innerHTML_ of _#people-container_ to an empty string? Even though we have removed the _li_ element from the DOM, there is still a reference to our _li_ variable on the window object since we created it as a global variable. Thus, the _li_ object cannot be garbage collected. There's a few things we can take away from these examples.

> The garbage collector will not clean up global variables during the page's life cycle.

> If an object in memory is holding a reference to another object that you want garbage collected, this reference needs to be destroyed.

### Memory Profiling with Backbone

Let's look at an example that is Backbone specific. We will set up the code so that we have a Backbone Collection of people rendered in a collection-view where each model in the collection has its own model-view. This is a very common Backbone scenario.

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

We can also see 5 _HTMLLIElement_ objects from our heap snapshot. 1 for the _HTMLLIElement_ constructor and 4 _li_ elements created from _PersonView_ for each person rendered in our collection view.

![heap snapshot 5](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot5.png)

Now let's modify _#people-container_ and set its _innerHTML_ to an empty string temporarily and take a heap snapshot.

```js
$('#people-container').append(peopleView.el).html('');
```

![heap snapshot 6](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot6.png)

As like before, removing the list items from the DOM by setting the _innerHTML_ of _#people-container_ to an empty string allowed the garbage collector to clean up all _HTMLLIElement_ instances from memory.

Let's make 2 changes to our code. The first thing we are going to do is have our _PersonView_ objects re-render whenever its model changes. We'll set this up using _Backbone.Events.listenTo()_. To find out more on the differences between [_.listenTo()_](http://backbonejs.org/#Events-listenTo) and [_.on()_](http://backbonejs.org/#Events-on), check out [Managing Events As Relationships, Not Just References By Derick Bailey](http://lostechies.com/derickbailey/2013/02/06/managing-events-as-relationships-not-just-references/).

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

I have set up this event binding in our _initialize()_ method. The next thing I will do is store the _people_ variable on the window object so that we can keep our Backbone Collection in memory. Many times in a Backbone application you will keep a collection around in memory so that you can do something with that data later on such as filtering it. It doesn't really matter where you store it. The key thing here is that it is still in memory somewhere and we have a way of accessing it.

```js
// previous code here

// remove the li's from the page
$('#people-container').append(peopleView.el).html('');

// store off the people collection onto the window object
window.people = people;
```

Now let's take a heap snapshot.

![heap snapshot 7](https://dl.dropboxusercontent.com/u/11600860/heap-snapshots/snapshot7.png)

What you'll notice now is that our list item elements are still being kept in memory and are not being garbage collected even though we have removed the list items from our page. Why is that?

Remember from before that if an object in memory is holding a reference to another object that you want garbage collected, this reference needs to be destroyed in order for the object to go out of scope and be cleaned up by the garbage collector. In this case, our _PersonView_ objects are not being cleaned up. We are intentially keeping the _people_ collection around by storing it on the window object. Each model in the collection has a reference to the corresponding _PersonView_, which has a reference to a corresponding list item element. We declared this relationship when we told our _PersonView_ objects to re-render if its respective model changes.

```js
this.listenTo(this.model, 'change', this.render);
```

Behind the scenes, a reference to the _PersonView_ render method is being passed to the model. You can see this in the [Backbone source](http://backbonejs.org/backbone.js):

```js
var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

// Inversion-of-control versions of `on` and `once`. Tell *this* object to
// listen to an event in another object ... keeping track of what it's
// listening to.
_.each(listenMethods, function(implementation, method) {
  Events[method] = function(obj, name, callback) {
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
    listeningTo[id] = obj;
    if (!callback && typeof name === 'object') callback = this;
    obj[implementation](name, callback, this);
    return this;
  };
});
```

Because each model has a reference to the the view that rendered it, the browser cannot garbage collect these views. This is what is referred to as zombie views - views that stick around in memory when we think it has been gone and it comes back to haunt us and bring our application down.

#### How to we remove views correctly?

There are a few ways of doing this but what I will demonstrate is the simplest and most common way. Rather than just replacing the _innerHTML_ which doesn't remove our _PersonView_ objects, we should call a _remove()_ method on our view objects that _Backbone.View_ provides. Backbone will unbind the view references from their models or collections to prevent our data from hanging on to view references which prevents our view objects from being garbage collected. The view objects can then be garbage collected, and so can the DOM elements that the view corresponds to, in this case the list item elements.

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

They key thing to note here is that in our _PeopleView_ collection view, we store off references of our _PersonView_ model views into a property called childViews. Then later on, rather than replacing the _innerHTML_ of _#people-container_, we can iterate over all of the child views and called the remove method. By doing this, Backbone unbinds each _PersonView_ instance from its model before it is removed from the DOM, thus allowing our view objects to be garbage collected and freeing up memory.

### Takeaways

* The garbage collector will not clean up global variables during a page's life cycle
* Make sure you remove all references to objects that you want cleaned up by the garbage collector
* In Backbone, removing elements from the page by wiping out the _innerHTML_ of the parent container element may not destroy the individual views. Be sure to call _.remove()_ on Backbone Views and this will unbind references from the objects that the views are listening to, assuming these event listeners were set up using _.listenTo()_


### Conclusion

After reading Building Backbone Plugins by Derick Bailey and several of his articles on Zombie Views, I wanted to try this out myself while verifying the memory leaks in Chrome Developer Tools. I highly recommend checking out his articles which I have posted below since he can explain memory leaks and Backbone a whole lot better, but hopefully this has been useful in understanding memory leaks, particularly in Backbone applications, and verifying memory leaks in Chrome Developer Tools.


### References

* [Backbone.js And JavaScript Garbage Collection](http://lostechies.com/derickbailey/2012/03/19/backbone-js-and-javascript-garbage-collection/)
* [Building Backbone Plugins](https://leanpub.com/building-backbone-plugins)
* [Managing Events As Relationships, Not Just References](http://lostechies.com/derickbailey/2013/02/06/managing-events-as-relationships-not-just-references/)
* [Zombies! RUN!](http://lostechies.com/derickbailey/2011/09/15/zombies-run-managing-page-transitions-in-backbone-apps/)
* [JavaScript Memory Profiling - Chrome Developer Tools](https://developer.chrome.com/devtools/docs/javascript-memory-profiling)
