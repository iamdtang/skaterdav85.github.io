---
layout: post
title:  "How to Learn Angular.js"
date:   2015-02-01
keywords: Angular.js tutorial, How to learn angular, learning angular, getting started with angular
---

I get asked pretty frequently, "What is the best way to learn Angular.js?". Here is a path of resources in order of what I think is a good way to learn Angular.


1. [CodeSchool - Shaping up with Angular.js](https://www.codeschool.com/paths/javascript#angular-js) - Free
2. [AngularJS Fundamenals in 60-ish Minutes](https://www.youtube.com/watch?v=i9MHigUZKEM) - Free
3. Go build something. Take a simple JSONP API, like the [iTunes Search API](https://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html) and create a music search application. Allow the user to favorite artists and track. Create song detail pages using angular's router.
4. [PluralSight - Angular Best Practices](http://www.pluralsight.com/courses/angular-best-practices)
5. Refactor the project you built to incorporate some of the best practices. Some things you might want to do include:
	* Create directives with isolate scope.
	* Move all $http calls from controllers to their own services
	* Implement a simple in-memory caching solution into your data service layer.
6. [PluralSight - AngularJS Patterns: Clean Code](http://www.pluralsight.com/courses/angularjs-patterns-clean-code)

## Other Useful Resources

* [AngularJS Style Guide](https://github.com/johnpapa/angularjs-styleguide) - Free: This styleguide basically covers what was in the PluralSight - AngularJS Patterns: Clean Code course mentioned above.
* [Pro AngularJS (Expert's Voice in Web Development)](http://smile.amazon.com/Pro-AngularJS-Experts-Voice-Development/dp/1430264489/ref=sr_1_1?ie=UTF8&qid=1422813075&sr=8-1&keywords=angular) - I have only read parts of this book but the parts I read were really good. I especially liked how the author described MVC.

## Staying up on Angular

* [ng-newsletter](http://www.ng-newsletter.com/) - "The free, weekly newsletter of the best AngularJS content on the web."
* [Adventures in Angular Podcast](http://devchat.tv/adventures-in-angular)
