---
layout: post
title:  "Getting Started with CommonJS Modules and Browserify"
date:   2015-01-05
categories: ['JavaScript', 'Browserify']
keywords: CommonJS Modules, Introduction to Browserify, Getting Started with Browserify, Browserify Tutorial, CommonJS tutorial, CommonJS vs AMD, CommonJS and Browserify tutorial
---

Modules allow us to organize code and prevent polluting the global namespace. Until ES6, JavaScript didn't have a native module system. There were however popular module systems created by the community. In the browser, the most popular module system was the Asynchronous Module Definition (AMD). In order to use AMD modules, you could use a library like [Require.js](http://requirejs.org/). The Node.js environment took a different approach to modules and created a module system called CommonJS. If you'd like to use CommonJS style modules in the browser, there is a tool called [Browserify](http://browserify.org/) which has been picking up steam. Which module system you choose is entirely up to your team's preference and application's needs. 

Before we can see how to use CommonJS modules in the browser with Browserify, let's look at how CommonJS modules work.

## How CommonJS Modules Work

To create a CommonJS module, simply create a new JavaScript file. Anything in that file won't be seen by other modules. In order to give your module a public API, you can attach properties and methods to the _module.exports_ property that is accessible in every module.

### Custom Modules - Example 1

Let's say we have a _Validation_ constructor function stored in _validation.js_ and a _User_ constructor function stored in the _models/user.js_.

<img src="/images/browserify/folderstructure1.png" alt="Example 1 folder structure" style="width: 200px;">

__validation.js__

```js
function Validation() { /* implementation here */ }
Validation.prototype.passes = function() { /* implementation here */ };
module.exports = Validation;
```

Here I've defined a constructor function _Validation_ with a method _passes()_. This function is made public by assigning it to _module.exports_ which is accessible from every module.

And similarly for __models/user.js__:

```js
function User() { /* implementation here */ }
module.exports = User;
```

If we want to access a module from _main.js_, we need to use the _require()_ function and specify a relative path to the file wihout the _.js_ extension.

```js
var Validation = require('./validation');
var User = require('./models/user');

console.log(Validation);
console.log(User);
```

What _require()_ returns is whatever is set to _module.exports_ in the module being required. For the validation module, _main.js_ can't see anything else but the _Validation_ constructor function. Any variables declared inside _validation.js_ are inaccessible from _main.js_.

So in other words, if we had the following in __validation.js__:

```js
var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function Validation() { /* implementation here */ }
Validation.prototype.passes = function() { /* implementation here */ };
module.exports = Validation;
```

The variable _emailPattern_ would only be accessible from within validation.js and could not be seen from _main.js_.

One other thing to mention is that in every module, there is another variable availabled called _exports_ which references _module.exports_.

__databaseConfig.js__

```js
exports.host = 'localhost';
exports.username = 'root';
exports.password = 'root';
exports.database = 'mydb';
```

__main.js__

```js
var db = require('./databaseConfig.js');
console.log(db); // { host: 'localhost', username: 'root', password: 'root', database: 'mydb' }
```

### Custom Modules - Example 2

We can also specify a file named _index.js_ in a folder. If we require that folder, it will automatically use the _index.js_ file as the module. This is particularly useful if you have a bunch of related modules that you want to group under a single object.

<img src="/images/browserify/folderstructure2.png" alt="Example 2 folder structure" style="width: 200px;">

Here I have created two different types of formatter modules in the _formatters_ directory.

__formatters/currency.js__

```js
module.exports = function currency() {
	console.log('format currency');
};
```

__formatters/date.js__

```js
module.exports = function date() {
	console.log('format date');
};
```

To require all formatters from _main.js_, simply create an index module that requires each formatter. We can set _module.exports_ equal to an object containing each formatter.

__formatters/index.js__

```js
module.exports = {
	date: require('./date'),
	currency: require('./currency')
};
```

Then, from _main.js_, we can simply require the _formatters_ directory which will automatically require _formatters/index.js_.

__main.js__

```js
var formatters = require('./formatters');
formatters.currency(); // format currency
formatters.date(); // format date
```

### Working With Third Party Modules

We can also work with third party modules from NPM. Let's install one I created called [validatorjs](https://www.npmjs.com/package/validatorjs), which was inspired by the Validator class in the Laravel framework.

```
npm install validatorjs
```

This will create a folder called _node_modules_ containing all installed third party modules.


<img src="/images/browserify/folderstructure3.png" alt="Example 3 folder structure" style="width: 200px;">

From our _main.js_ file, we can require it by simply specifying the name of the module.

__main.js__

```js
var Validator = require('validatorjs');
console.log(Validator);
```

How to create a reusable third party module is an entire post for itself so I won't cover that here.

Those are the basics of creating and using CommonJS modules. Let's now see how we can use Browserify to leverage CommonJS modules for our JavaScript in the browser.

## Browserify

To install `browserify`, simply install it globally using `npm`.

```
sudo npm install -g browserify
```

Once you have installed browserify, you can build all of your JavaScript into a single file:

```
browserify main.js -o bundle.js
```

Browserify will look at _main.js_ and recursively bundle up all of the required modules into a single output file (hence the -o option) _bundle.js_.

Having to run this command every time you modify a JS file can be tedious. Instead, we can leverage another global module called `watchify`.

```
sudo npm install -g watchify
```

As the module documentation states, `watchify` is "watch mode for browserify builds". We can use it just like the `browserify` command. `watchify` will watch any files in your dependency graph and rebuild the output file as soon as any file changes.

```
watchify main.js -o bundle.js
```

One thing to note, when using `watchify`, you will see full system paths to your modules in the output file. For obvious security reasons, you don't want this for your production build. `watchify` is not intended to be used for deployment. In your build system, use the `browserify` command instead and you won't see these full system paths.

## Conclusion

Browserify is a command line tool that allows us to use CommonJS modules in the browser. Let me know what your thoughts are on using CommonJS modules in the browser through Browserify.