---
layout: post
title:  "Angular and CoffeeScript: The Tricky Parts"
date:   2014-12-29
categories: JavaScript Angular.js CoffeeScript
keywords: Angular and CoffeeScript, Angular, CoffeeScript, CoffeeScript function declarations
---

CoffeeScript has been an interesting language to learn. At first, I wasn't really into it because it required me to learn another another language that compiled down to the language I was already comfortable with. I also didn't like the fact that CoffeeScript wasn't a superset of JavaScript. I couldn't incrementally learn CoffeeScript by writing JavaScript while incorporating CoffeeScript features as I learned them. Being forced to use CoffeeScript at work, after a couple weeks, I became comfortable with the language and I could appreciate certain aspects. Then, I started using CoffeeScript with Angular.js and ran into a few troubles that I thought I'd share.

## 1. Watch out for implicit returns

When defining an Angular controller, you might do something like the following in JavaScript:

```js
var app = angular.module('app', ['ngRoute']);

app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'index.html',
			controller: 'MyController'
			controllerAs: 'vm'
		});
});

app.controller('MyController', function() {
	var vm = this;

	vm.hello = function() {
		alert('hello!')
	};
});
```

And the corresponding HTML:

```html
<div ng-view></div>

<script type="text/ng-template" id="index.html">
	<button ng-click="vm.hello(name)">hey</button>
</script>
```

Pretty simple. Now let's translate this to CoffeeScript.

```coffeescript
app = angular.module('app', [])

app.config ($routeProvider) ->
	$routeProvider
		.when('/', {
			templateUrl: 'index.html'
			controller: 'MyController'
			controllerAs: 'vm'
		})

app.controller 'MyController', () ->
	vm = this

	vm.hello = () ->
		alert("hello!")
```

Not a whole lot different. Remove the parenthesis, braces, and semicolons and use the different arrow syntax to define a function and you have CoffeeScript. However, this small controller definition in CoffeeScript has some issues that you might not notice immediately, other than the fact that it no longer works. The above controller definition compiles to the following JavaScript:

```js
app = angular.module('app', []);

app.controller('MyController', function() {
    var vm;
    vm = this;
    return vm.hello = function(name) {
      return alert("Hello, " + name);
    };
  });
```

Notice how CoffeeScript stuck in a return statement that returns _$scope.hello_ in the controller function definition? Functions in CoffeeScript implicitly return the last line if no return statement is provided. As you might guess, this can cause some issues. You may not know that Angular treats controllers as constructors. It isn't completely obvious that the function in the controller definition is newed up behind the scenes by Angular. Constructors always return a new constructed object unless a different return value is specified. Because CoffeeScript has implicit returns for functions, you may run into issues where your controller isn't working as expected when you are using a standard CoffeeScript function to define it. The fix is that you need to explicitly state that a controller returns _this_ so that there is no implicit return. This can be really tough to figure out and may eat up a few hours of your day if you did the above and didn't know that Angular controllers are used as constructors. I know it troubled me when I first started using CoffeeScript with Angular. As a general rule, you could always make sure that you explicitly return a value from your CoffeeScript functions so you don't accidentally run into this issue. There is another solution though that I prefer and that is to use CoffeeScript classes for controllers.

```coffeescript
class MyController
	constructor: ($scope, $log) ->
		$scope.name = 'David'

app.controller('MyController', MyController)
```

The _MyController_ class will become a function used as a constructor without an implicit return statement, thus allowing the controller object to be returned.

```js
MyController = (function() {
    function MyController($scope) {
      $scope.name = 'David';
    }

    return MyController;
})();
```

## 2. There are no function declarations

If you've kept up with the latest in the Angular community, you have probably seen John Papa's style guide for building Angular.js applications. The style guide has a lot of great ideas and he gives reasons why a particular style is advantageous over another. You can find the full styleguide [here](https://github.com/johnpapa/angularjs-styleguide).

One of the styles recommended is to use [function declarations to hide implementation details](https://github.com/johnpapa/angularjs-styleguide#style-y034). One way this style can be applied is when defining controllers. You could define a minification-safe controller like this:

```js
angular
	.module('app')
	.controller('MyController', ['$location', '$log', 'config', 'data', function($location, $log, config, data) {

	});
```

As you can see, this controller only has 4 dependencies and it is already becoming difficult to read. Add a few more dependencies and you'll have to break the controller definition onto 2 lines. Instead, the styleguide suggests something like this:


```js
angular
	.module('app')
	.controller('MyController', MyController);

MyController.$inject = ['$location', '$log', 'config', 'data'];

function MyController($location, $log, config, data) {
	
}
```

This alternative controller definition is much more readable. You can easily see that this file contains a controller definition since it is at the top followed by the list of injected dependencies. All of the complexity of the controller is moved to the bottom of the file. However, this approach takes advantage of function declaration hoisting. Function declarations, unlike function expressions, are hoisted to the top of the current scope which allows this style to work. CoffeeScript however does not have function declarations. In CoffeeScript, you define a function like this:

```coffeescript
MyController = () ->
```

which creates a function expression which doesn't hoist. 

```js
MyController = function() {};
```

Your next thought might be to use a CoffeeScript class. 

```coffeescript
app.controller('MyController', MyController)

class MyController
	constructor: ($scope) ->
		$scope.name = 'David'
```

However, CoffeeScript classes don't just create a function declaration. Instead, it uses an immediately invoked function expression (IIFE) to return a function declaration, which loses the benefit of function declaration hoisting.

```js
app.controller('MyController', MyController)

MyController = (function() {
	function MyController($scope) {
	  $scope.name = 'David';
	}

	return MyController;
})();
```

The above will throw an error because you are trying to reference _MyController_ before it is defined. This goes to show that it is really important to know how CoffeeScript translates to JavaScript.



So what is the solution? The simplest solution in my opinion is to just declare your controller at the bottom of the file after the controller class definition.

```coffeescript
class MyController
	constructor: ($scope, $log) ->
		$scope.name = 'David'

MyController.$inject = ['$scope', '$log']

app.controller('MyController', MyController)
```

Although you have to scroll to the bottom of the file to see what type of Angular component this is and the list of dependencies, with consistency and a good folder structure it isn't so bad, and in my opinion, it is better than the first solution of declaring the controller and its dependencies all on one line.

## Conclusion

I'd love to hear what style you are using for your Angular.js applications when using Coffeescript. Please let me know in the comments!