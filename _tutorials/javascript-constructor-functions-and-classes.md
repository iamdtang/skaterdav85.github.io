---
layout: tutorial
title: JavaScript Constructor Functions and Classes
date: 2017-08-09
description: The fundamentals of constructor functions and ES6 classes
keywords: javascript, constructor function, es6, class, classes, prototype
---

## Constructor Functions

Constructor functions are the equivalent of classes in many programming languages. Sometimes people will refer to them as as reference types, classes, data types, or simply constructors. If you aren't familiar with classes, they are a construct that allows you to specify some properties and behaviors (functions), and multiple objects can be created with those properties and behaviors. A common analogy you'll often hear is, a class is to a blueprint as an object is to a house. Multiple houses can be created from a single blueprint, as multiple objects can be created from a class.

Let's define a constructor function:

```js
function Person(name, position) {
  this.name = name;
  this.position = position;
}
```

There is really nothing special about this function except that the function name starts with a capital letter. This isn't mandatory, but it is popular convention so that other developers know to invoke it as a constructor function. So how is the invocation different? Normally, functions are invoked with parenthesis. Constructor functions instead are invoked using the `new` operator:

```js
let david = new Person('David Tang', 'Lecturer');
let patrick = new Person('Patrick Dent', 'Associate Professor');
```

Here we are _constructing_ two `Person` objects.

When a constructor function is invoked with the `new` keyword, _this_ refers to the object that is being constructed. Note, if a constructor is invoked without the `new` keyword, _this_ will point to the global object, which is the `window` object in the browser. This will end up creating properties on the window object (also known as global variables), which is not a recommended practice.

## Methods

Methods can be defined on constructor functions by assigning a function to a property.

```js
function Person(name) {
  this.name = name;
  this.hi = function() {
    console.log('Hi! My name is ' + this.name);
  };
}

let eminem = new Person('Slim Shady');
eminem.hi(); // Hi! my name is Slim Shady
```

In this example, the `hi` property is assigned a function. When it is invoked off of a `Person` object, the keyword _this_ will correspond to the newly constructed `Person` object.

Although methods can be defined this way, this approach does have a downside. Every time an instance of `Person` is created, a new function is defined and assigned to the `hi` property of that object. If we create 5 `Person` objects, they will all have their own `hi` methods that do the same thing. A more efficient way to do this is to define `hi` once, and have each `Person` object use that same function reference. To do this, we can use a function's `prototype`.

```js
function Person(name) {
  this.name = name;
}

Person.prototype.hi = function() {
  console.log('Hi! My name is ' + this.name);
};

let david = new Person('David');
david.hi(); // Hi! My name is David

let patrick = new Person('Patrick');
patrick.hi(); // Hi! My name is Patrick
```

Every function in JavaScript has a property called `prototype` which contains an almost empty object (more on this later). Whenever a `Person` instance is created, the object will inherit any properties or methods defined on `Person.prototype`.

We could have written the example above like this:

```js
function Person(name) {
  this.name = name;
}

Person.prototype = {
  constructor: Person,
  hi: function() {
    console.log('Hi! My name is ' + this.name);
  }
};
```

Rather than adding new methods to `Person.prototype` in several statements, we can just redefine the `Person.prototype` object. There is one caviat though. Remember when I said that the prototype is an "almost empty" object? Technically it has a property on it named `constructor` that points back to its constructor function. If we override the prototype by setting it to a completely new object, we should reset this `constructor` property.

## What Should Be Set On `prototype`?

Because anything on the prototype is shared across all object instances of that constructor, typically you only see methods defined on the prototype and properties stored on the constructed object itself. Methods are shared behaviors so each object doesn't need its own unique method. However, each object often needs its own unique set of properties. Properties defined on the an object itself and not the prototype are referred to as "own properties".

## Property Lookups

What happens if we define a property with the same name on an object and its constructor's prototype? For example:

```js
function Person(name) {
  this.name = name;
  this.walk = function() {
    console.log('moon walking');
  };
}

Person.prototype.walk = function() {
  console.log('normal walking');
};

let mj = new Person('Michael Jackson');
mj.walk();
```

In this example, a `walk` method is defined both on a `Person` instance and `Person.prototype`. What do you think will get logged to the console?

JavaScript will first try and look up a property on the object itself (an "own property"). If it exists, that property is used. If not, it will look at the prototype of the function that created the object.

So in the example above, `walk` is found on the `mj` object itself so it will log "moon walking" to the console. If our `Person` function looked like this:

```js
function Person(name) {
  this.name = name;
}
```

Then "normal walking" would be logged to the console because a `walk` method was not found on the object itself, so JavaScript looked next on `Person.prototype` in which the `walk` method was found.

## Inheritance

If you've come from a class-based language, you might be wondering how inheritance works. Let's say we have an `Animal` constructor.

```js
function Animal() {};
Animal.prototype.eat = function() {
  console.log('eating');
}
```

Now let's say we have a `Cat` constructor:

```js
function Cat() {}
Cat.prototype.meow = function() {
  console.log('meowing');
};
```

A cat is a type of animal and we want `Cat` to extend from `Animal`. One way to achieve inheritance is like this:

```js
function Animal() {}
Animal.prototype.eat = function() {
  console.log('eating');
};

function Cat() {}
Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
Cat.prototype.meow = function() {
  console.log('meowing');
};
```

If you've used classes in other languages before, you're probably reading this and thinking "what the ...". Yes, it is a little clunky. Thankfully, ES6 / ES2015 classes make this much much cleaner:

```js
class Animal {
  eat() {
    console.log('eating');
  }
}

class Cat extends Animal {
  constructor() {
    super();
  }
  meow() {
    console.log('meowing');
  }
}
```

## Native Constructor Functions & Their Shorthand (literal) Counterparts

JavaScript has several built in functions used as constructors. They are: String, Number, Boolean, Array, Function, Object, RegExp, and Date.

```js
let str = new String('some string');
// OR
let str = 'some string'; // literal syntax
```

```js
let age = new Number(26);
// OR
let age = 26; // literal syntax
```

```js
let person = new Object();
// OR
let person = {}; // literal syntax
```

```js
let x = new Boolean(false);
// OR
let x = false; // literal syntax
```

```js
let add = new Function('a', 'b', 'return a + b;');
let add = function(a, b) {
  return a + b;
} // literal syntax
```

Even though you can technically create numbers, strings, objects, booleans, and functions using the native constructors, it is almost always simpler and more straightforward to use the literal syntax.

## Extending Native Constructors

Native constructor functions can be extended as well. This is often considered a bad practice because if you create a custom `String` method and browsers in the future implement that method slightly differently, code may not work as you'd expect. Despite that, it is still a good exercise and worthwhile to learn for understanding prototypes.

```js
String.prototype.dasherize = function() {
  return this.replace(/\s/g, '-');
};

'hello world'.dasherize(); // hello-world
```
