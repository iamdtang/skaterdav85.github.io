---
layout: post
title:  "Unit Testing Angular Directives with Isolate Scope"
date:   2015-02-12
keywords: unit testing directives, angular directives, unit testing, angular $compile, isolate scope directives, testing isolate scope
---

If you are building complex user interfaces, you will at some point want to start unit testing your directives. Below is a simple directive called `blog-status` that displays either "Active" or "Inactive" on the page. This might be a directive used in the admin section for a blog where it shows a list of all your posts and the status of each post. It's not the most useful directive but it is simple enough to show how to unit test a directive with isolate scope. Usage of this directive would be:

```html
<blog-status is-active="blogArticle.active"></blog-status>
```

`blogArticle.active` would be a boolean value. And here is the directive implementation:

```js
{% raw %}
app.directive('blogStatus', function() {
  return {
    restrict: 'E',
    template: "<span>{{activeDisplayName}}</span>",
    scope: {
      isActive: '='
    },
    link: function($scope, $el, attrs) {
      if ($scope.isActive) {
        $scope.activeDisplayName = 'Active';
      } else {
        $scope.activeDisplayName = 'Inactive';
      }
    }
  }
});
{% endraw %}
```

This directive uses an isolate scope where `isActive` is passed in as `blogArticle.active` from the `is-active` attribute. So the first thing you might ask yourself is, what should I unit test here? What I would want to test is ensuring that the property `activeDisplayName` on the isolate scope gets set to "Active" if `blogArticle.active` is true and "Inactive" when false. Let's write a unit test for that:

```js
describe('active directive', function () {
  var scope, $compile;

  beforeEach(module('blog'));
  beforeEach(inject(function($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  it('should display "Active" if passed true', function() {
    var element = '<blog-status is-active="blogArticle.active"></blog-status>';
    scope.blogArticle = { active: true };
    element = $compile(element)(scope);
    scope.$digest();

    expect(element.isolateScope().activeDisplayName).toEqual('Active');
  });
});
```

Looking at the test above, one of the first things you'll notice is the [`$compile` service](https://docs.angularjs.org/api/ng/service/$compile). If you've used another client-side templating library before like Handlebars, this is very similar to `Handlebars.compile(htmlString)`. This basically compiles an HTML string into an optimized template function which can be used later on to interpolate the template with data from `$scope`.

The isolate scope is the thing we want to test. To access it, we can call `element.isolateScope()` and access the properties on that scope.

To test this directive when `blogArticle.active` is `false` we can do the opposite:

```js
it('should display "Inactive" if passed false', function() {
  var element = '<blog-status is-active="blogArticle.active"></blog-status>';
  scope.blogArticle = { active: false };
  element = $compile(element)(scope);
  scope.$digest();

  expect(element.isolateScope().activeDisplayName).toEqual('Inactive');
});
```
