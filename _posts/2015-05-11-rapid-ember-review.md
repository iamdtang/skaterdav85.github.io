---
layout: post
title:  "Rapid Ember.js Video Review"
date:   2015-05-11
keywords: Rapid Ember.js, learning ember, learning Ember.js, Ember.js tutorial
image: ember
---

[Rapid Ember.js](http://bit.ly/1xYIVbD) is an excellent 60 minute introduction to learning the Ember.js framework. The author William Hart does a great job at introducting the theory of MVC and Ember's take on it which differs a little if you've worked with Backbone or Angular.

Here are a few things that I really liked about the series:

1. The author does a great job at explaining client-side MVC and the distinction between persisted models and view models, and how Ember's Controller is used to separate the two. This was a problem I had been experiencing in my Backbone apps and I found it very useful to hear how Ember addressed it. It has definetly made me rethink how I go about separating display logic properties and persisted properties on my models. So if you are a Backbone developer thinking about trying Ember (even just for fun), this is one reason how this video series can be useful, even if you don't plan on using Ember for a real project.
2. Getting started with Ember is tough and having to learn ember-cli and ES6 modules first are just more hurdles to getting started with the framework. I really liked that William used simple script tags for the demo application (which wasn't a todo list!). This isn't something you'll find in many other tutorials. He addresses ember-cli in the last video once you've played around with framework.
3. I like how the author explains convention over configuration and how it relates to Ember's naming conventions for routes, nested routes, urls, controllers, templates, components, etc. Understanding and following these naming conventions is key to understanding how the pieces of Ember fit together.
4. The overview of Ember Data and the Ember Data model was useful. He does a great job at explaining what an adapter is and how it relates to models, the store, the serializer, and the data source (your database, local storage, etc). He provides a nice diagram as well and explains each of their responsibilities, how these pieces fit together, and shows how easy it is to swap the default REST adapter with a local storage adapter in the demo application.

Learning Ember.js requires time and commitment. Having a video series like [Rapid Ember.js](http://bit.ly/1xYIVbD) really helps the learning process and I'd recommend it to anyone trying to learn the framework. One other thing to note, even though Ember is on version 1.11 at this time and the author uses 1.6, it is still very applicable and worth watching.
