---
layout: post
title:  "Unit Testing Angular Directives Part 2"
date:   2015-09-01
keywords: unit testing directives, testing angular directives, testing directive controllers, unit testing angular, unit testing isolate scope directives, testing isolate scope, angular components, unit testing angular components
---

Earlier this year I wrote about [Unit Testing Angular Directives with Isolate Scope](/2015/02/12/unit-testing-angular-directives.html). Now that I am working with Angular again, I've discovered another way to improve unit testing Angular directives using controllers. Let's look at an example.

Imagine you have the following directive:

```html
<action-button 
  value="Create" 
  processing-value="Processing..." 
  action="vm.create()"></action-button>
```

This directive will wrap a standard button that will disable when the passed in action is processing. For example, you have an asynchonous function and when that function is invoked, you want to disable the button so that the user cannot queue up multiple requests. Here is the corresponding template:

```html
<button ng-disabled="processing" ng-click="runAction()">{{displayLabel}}</button>
```

For this directive, the JavaScript might look like this:

```js
app.directive('actionButton', function() {
	return {
		restrict: 'E',
		templateUrl: 'action-button.html',
		scope: {
			action: '&',
			value: '@',
			processingValue: '@'
		},
		link: function($scope, $el, attrs) {
			// maybe some DOM manipulation here?

			$scope.displayLabel = $scope.value; 
			$scope.runAction = function() {
				$scope.processing = true;
				$scope.displayLabel = $scope.processingValue; 
				$scope.action().finally(function() {
					$scope.processing = false;
					$scope.displayLabel = $scope.value; 
				});
			};
		}
	};
});
```

Inside the link function we could have some custom DOM manipulation along with the logic to control the disabled property of the button when the button is clicked. Here is the corresponding unit test:

```js
describe('<action-button> directive', function() {
  var scope, $compile, $timeout;

  beforeEach(module('kittens'));
  beforeEach(inject(function($rootScope, _$compile_, _$timeout_) {
      scope = $rootScope.$new();
      $compile = _$compile_;
      $timeout = _$timeout_;
  }));

  it('should call the action when runAction is called', function() {
      var element = '<action-button value="Create" processing-value="Processing..." action="create()"></action-button>';
      scope.create = jasmine.createSpy().and.returnValue($timeout(0));
      element = $compile(element)(scope);
      element.isolateScope().runAction();
      expect(scope.create).toHaveBeenCalled();
  });
});
```

Testing a directive like this works, but it has a few downsides. First, your test is dependent on the DOM which could result in your test suite being slow depending on how many DOM dependent tests you have. You want your test suite to run fast so that you get immediate feedback. Second, you need to setup your test harness so that it has access to the directive templates. There are a few ways you can do this. You can setup something using `$httpBackend` or your can use a Karma plugin like `ng-html2js`. This requires a one time setup.

Instead, I like to separate out the logic of the directive into its own controller.

```js
app
	.directive('actionButton', function() {
		return {
			restrict: 'E',
			templateUrl: 'action-button.html',
			scope: {
				action: '&',
				value: '@',
				processingValue: '@'
			},
			controller: 'ActionButtonController',
			controllerAs: 'vm',
			bindToController: true, // Angular 1.3
			link: function(scope, el, attrs, controller) {
				// custom DOM manipulation here
			}
		};
	})
	.controller('ActionButtonController', function() {
		var vm = this;
		vm.displayLabel = vm.value;
		vm.runAction = function() {
			vm.processing = true;
			vm.displayLabel = vm.processingValue;

			vm.action().finally(function() {
				vm.processing = false;
				vm.displayLabel = vm.value;
			});
		};
	});
```

Here I've moved the logic from the directive's link function and moved it to a controller that the directive references. `bindToController`, a property introduced in Angular 1.3, is used to proxy the values bound to the directive's isolate scope to the controller.

By separating out directive logic into its own controller, you can unit test the logic of your directive just like any other controller. Your test is no longer dependent on the DOM. This also has the added benefit of separating out any custom DOM manipulation in your link function from the actual directive logic itself. This example didn't have any custom DOM manipulation, but you can imagine there might be inside that link function. Here is the corresponding unit test:

```js
describe('ActionButtonController', function() {
	var $controller, $timeout;

	beforeEach(module('kittens'));
	beforeEach(inject(function(_$controller_, _$timeout_) {
		$controller = _$controller_;
		$timeout = _$timeout_;
	}));

  it('should call the action when runAction is called', function() {
    var actionSpy = jasmine.createSpy().and.returnValue($timeout(0));
    var controller = $controller('ActionButtonController', {}, {
    	action: actionSpy
    });
    controller.runAction();
    expect(actionSpy).toHaveBeenCalled();
  });
});
```

The 3rd argument passed to `$controller` is an object where you can specify what values you want bound to the controller, simulating the values that are proxied from the directive's isolate scope to the controller via `bindToController`.



