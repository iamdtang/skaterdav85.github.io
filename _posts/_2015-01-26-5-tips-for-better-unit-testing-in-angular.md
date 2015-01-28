---
layout: post
title:  "5 Tips for Better Unit Testing in Angular"
date:   2015-01-26
keywords: Testing services in Angular, Unit Testing Angular services, Unit tests, Jasmine unit testing
---

## 1. Use $provide to mock dependencies

```js
describe('countries', function() {
  beforeEach(module('shipping'));

  describe('findByUserLocale()', function() {
      beforeEach(module(function($provide) {
          $provide.value('authenticatedUser', {
              locale: 'en_GB'
          });
      }));

      it('should find countries based on user locale', inject(function(countries) {
          var userLocaleCountries = countries.findByUserLocale();

          expect(userLocaleCountries).toEqual([
              { name: 'United Kingdom', iso: 'GBR', locale: 'en_GB' },
              { name: 'Ireland',        iso: 'IRL', locale: 'en_GB' }
          ]);
      }));
  });
});
```

## 2. Use $compile to compile directives

```js
describe('active directive', function () {
    var scope, $compile;

    beforeEach(module('catalog'));
    beforeEach(inject(function($rootScope, _$compile_) {
        scope = $rootScope.$new();
        $compile = _$compile_;
    }));

    it('should display "Active" if passed true', function() {
        var element = '<active property="style.active"></active>';
        scope.style = { active: true };
        element = $compile(element)(scope);
        scope.$digest();

        var isolated = element.isolateScope();
        expect(isolated.activeDisplayName).toEqual('Active');
    });
});
```

## 3. Enable Growl Notifications in Karma

https://www.npmjs.com/package/karma-growl-notifications-reporter

```
npm install karma-growl-notifications-reporter --save-dev
```

Inside of _karma.conf.js_:

```js
reporters: ['progress', 'coverage', 'growl-notifications']
```

## 4. Mock your backend with $httpBackend

## 5. Make sure services are in a fresh state for each test