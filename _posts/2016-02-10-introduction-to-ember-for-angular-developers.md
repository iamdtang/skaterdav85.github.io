---
layout: post
title: An Introduction to Ember for Angular Developers
date: 2016-02-10
description: One pain point of Ember that I often hear is that the learning curve is a little steep. Because Angular is extremely popular, I'd like to introduce Ember from the perspective of an Angular developer, hopefully getting those who know Angular up and running quickly based on something you are already familiar with. Ember is a fantastic framework that I've grown to love coming from the Angular world myself, and you may too.
keywords: Ember tutorial, Angular, Angular tutorial, Ember, beginners, Ember 101, Ember intro, EmberJS, Ember.js, AngularJS, Angular.js, Ember vs. Angular, Angular vs. Ember, Ember vs Angular, Angular vs Ember
image: ember
---

One pain point of Ember that I often hear is that the learning curve is a little steep. Because Angular is extremely popular, I'd like to introduce Ember from the perspective of an Angular developer, hopefully getting those who know Angular up and running quickly based on something you are already familiar with. Ember is a fantastic framework that I've grown to love coming from the Angular world myself, and you may too.

Ember is an opinionated JavaScript framework. It comes with a command line interface (CLI) used to scaffold your application, generate files with a test for every single file, run tests, and build an application for deployment. In Angular, these tasks are typically achieved using some combination of tools like Gulp, Grunt, Yeoman, and a handful of other plugins and custom code. Angular 2 however will have a CLI that is built on top of Ember CLI. In this post, I will be using Ember CLI to generate files so you can learn the commands along the way. Let's get started!

## Installation

To start working with Ember, you'll need to install Ember CLI which can be installed as a global node module.

```
npm install -g ember-cli
```

Make sure that you __DONT__ try and install Ember CLI using `sudo`. Either use Node Version Manager (NVM) or change the location where global node modules are installed so that it doesn't require `sudo`. For example, I have global node modules stored in `~/npm`. Run these commands if you'd like that too:

```
mkdir ~/npm
npm config set prefix ~/npm
```

Once you do that, add this `PATH=$PATH:$HOME/npm/bin` to your `~/.bash_profile` and restart terminal.

Once you've done that, you should have the `ember` command available. To create an Ember application, run:

```
ember new PROJECT-NAME
```

This will create an Ember project and install dependencies using Bower and NPM.

## Serving the Application

In Angular, you can serve up your application a number of ways. You might be using Express, a simple HTTP server like the ones built into Python or PHP, or you're running it within a server-side framework. Ember however expects your application to reside on its own, and Ember CLI provides a web server for development mode. It's worth noting that you can get it to run within a traditional server-side framework, but that isn't the happy path. To run an Ember application, simply run `ember serve` from within the root of your project and browse to `http://localhost:4200`.

## Defining Routes

Let's look at the differences between defining routes in Ember versus Angular. Because Angular UI Router is widely used, probably more so than the router that Angular provides, I will be using that as a comparison. Let's look at how we would define a route in Angular:

```js
$stateProvider.state('contact', {
  url: '/contact',
  templateUrl: 'templates/contact.html'
});
```

To define a route in Ember, run `ember generate route contact`. This will update `app/router.js` as follows:

```js
// app/router.js
Router.map(function() {
  this.route('contact');
});
```

With this `contact` route in place, when a user visits `/contact`, it will render the template `app/templates/contact.hbs`. This differs from the Angular UI router because you don't need to specify which template that the route should load. Ember follows a convention where the template name matches the route name. Another difference is that you don't need to specify the URL when defining a route in Ember. By default, the URL path will be the route name. If you'd like this to be different, use the `path` option:

```js
// app/router.js
Router.map(function() {
  this.route('contact', { path: '/contact-us' });
});
```

As you can see in the definition of routes, Ember follows more convention over configuration, ensuring consistency within a project as well as across all Ember applications. You don't need to think about what your template should be named and where it should live in your project. That is already decided for you by Ember CLI. This is one less thing to think about and enforce on a team, allowing you to focus on what matters, building the application.

## Outlets

Once you have a route defined, where does a route's template get rendered? In Angular, you'd set up a `div` with a `ui-view` directive somewhere on your `index.html` page.

```html
<div ui-view></div>
```

In Ember, the route's template gets rendered in an {% raw %}`{{outlet}}`{% endraw %} on the application template:

{% raw %}
```html
<!-- app/templates/application.hbs -->
<h1>Welcome to Ember</h1>
{{outlet}}
```
{% endraw %}

Ember uses an enhanced version of the Handlebars templating language which also uses the double curly braces to output dynamic content. There is an `application` route created by default when the app loads, and each top level route's template will get rendered into the application {% raw %}`{{outlet}}`{% endraw %}. The full HTML document skeleton can be found at `app/index.html`.

## Linking to Routes

Now that we have a route defined, how do we link to it? In Angular, we would do:

```html
<a ui-sref="contact">Contact</a>
```

In Ember, we use the `link-to` helper:

{% raw %}
```html
{{#link-to 'contact'}}Contact{{/link-to}}
```
{% endraw %}

Unlike the Angular UI router, Ember's `link-to` helper is aware of all routes in an application, and it will throw an error on live reload if you try and link to a route that hasn't been created yet. This is especially useful if you accidentally misspell the route in `link-to`. Ember will catch this when it loads the application and you'll see an error in the console whereas this will silently fail in Angular.

## Nested Routes and Outlets

To create a nested route in Angular, such as the `tech-support` route under the `contact` route, you would do this:

```js
$stateProvider
  .state('contact', {
    url: '/contact',
    templateUrl: 'templates/contact.html'
  })
  .state('contact.tech-support', {
    url: '/tech-support',
    templateUrl: 'templates/contact/tech-support.html'
  });
```

To render `templates/contact/tech-support.html` within `templates/contact.html`, you'd use another `ui-view`:

```html
<!-- templates/contact.html -->
<div ui-view></div>
```

In Ember, we can generate the `contact/tech-support` route with: `ember generate route contact/tech-support`. The router will be updated as follows:

```js
// app/router.js
Router.map(function() {
  this.route('contact', function() {
    this.route('tech-support');
  });
});
```

The `contact/tech-support` route will have the following template generated:

{% raw %}
```html
<!-- app/templates/contact/tech-support.hbs -->
{{outlet}}
```
{% endraw %}

The template `app/templates/contact/tech-support.hbs` will get rendered into the {% raw %}`{{outlet}}`{% endraw %} in `app/templates/contact.html`. Whenever a route template is generated, it will come with {% raw %}`{{outlet}}`{% endraw %} by default in case there are nested routes under that route. If that route won't have any nested routes, you can remove it.

One of the nice things about Ember's router is that the route hierarchy is visually apparent from the natural indentation levels. You can't move the nested `contact/tech-support` route outside of the callback function of the `contact` route. In Angular however, states can potentially be reordered because the API doesn't visually enforce grouping of hierarchical routes.

## Route Objects

Ember makes a distinction between a router and a route. The router is a hierarchical mapping of all the URLs in the application in `app/router.js`, and a route is an object associated with a particular URL that gets invoked when that URL is hit. In Angular, data fetching typically happens in the `resolve` property within the router or inside a controller. In Ember, there is a dedicated place for this inside route objects called the model hook.

```js
// app/routes/contact/tech-support.js
export default Ember.Route.extend({
  model() {
    return $.getJSON('http://mysite.com/api/tech-specialists');
  }
});
```

When a URL is entered, the route will call a series of methods, one of them being the model hook, before the template is rendered. Other methods in the route include `beforeModel`, `afterModel`, `activate`, `deactivate`, and a few others. The model hook can return a promise, and once that promise resolves, a property called `model` will be available in your template.

## Templates

To display data in your templates, Ember uses the `#each` Handlebars helper. To display a list of tech-specialists on the page returned to us from the model hook in the route, we can do:

{% raw %}
```html
<ul>
  {{#each model as |techSpecialist index|}}
    <li>{{techSpecialist.firstname}} {{techSpecialist.lastname}}</li>
  {{/each}}
</ul>
```
{% endraw %}

One of the great things about Ember is that the framework prevents you from putting too much logic in your templates. In Angular, you can put variable assignments and complicated conditional statements directly in your template making it difficult to test and maintain. For example:

{% raw %}
```html
<ul>
  <li ng-repeat="techSpecialist in techSpecialists">
    {{techSpecialist.firstname}} {{techSpecialist.lastname}}
    <span ng-if="techSpecialist.certified && techSpecialist.yearsOfExperience >= 5">
      Senior Tech Specialist
    </span>
  </li>
</ul>
```
{% endraw %}

All of the logic that determines whether a tech-specialist is considered Senior or not is embedded directly in the HTML. This is great for prototyping since it is quick and easy, but it often doesn't scale well and it is impossible to unit test. You might think it's ok just this once, but if you are working on a team and many developers say "just this once", you might run into problems. In Ember, this logic must reside outside of the template in something like a computed property (more on this later). Your template in Ember might look like this instead:

{% raw %}
```html
<ul>
  {{#each model as |techSpecialist index|}}
    <li>
      {{techSpecialist.firstname}} {{techSpecialist.lastname}}
      {{#if seniorLevel}}
        <span>Senior Tech Specialist</span>
      {{/if}}
    </li>
  {{/each}}
</ul>
```
{% endraw %}

Notice how all of the conditional logic is replaced with a single property? I find this to be more readable. So how do we move that display logic out to `seniorLevel`? One way is to use components.

## Components

What is a component? As [Tom Dale puts it](https://twitter.com/tomdale/status/361288660240441344):

> "For you Angular peeps, an Ember.js component is roughly equivalent to an E restricted, transcluded, isolate-scoped directive."

To create a component, run `ember generate component tech-specialist`. Components must have a hyphen in it. This is to prevent clashes with current or future HTML elements and aligns Ember components with the W3C Custom Elements specification.

A component, like a directive, has two parts: the template and the associated JavaScript. To start, we are going to move the HTML for a single tech-specialist to a component:

{% raw %}
```html
<ul>
  {{#each model as |techSpecialist index|}}
    {{#tech-specialist specialist=techSpecialist}}{{/tech-specialist}}
  {{/each}}
</ul>
```
{% endraw %}

A component in Ember looks similar to a tag. The Ember team is working on something called angle-bracket components so that components will look like HTML tags.

{% raw %}
```html
<!-- app/templates/components/tech-specialist.hbs -->
{{specialist.firstname}} {{specialist.lastname}}
{{#if seniorLevel}}
  <span>Senior Tech Specialist</span>
{{/if}}
```
{% endraw %}


```js
// app/components/tech-specialist.js
export default Ember.Component.extend({
  tagName: 'li',
  seniorLevel: Ember.computed('specialist.certified', 'specialist.yearsOfExperience', function() {
    if (this.get('specialist.certified') && this.get('specialist.yearsOfExperience') >= 5) {
      return true;
    }

    return false;
  })
});
```

Here we are defining a computed property. A computed property is a property that recomputes when any of the properties it depends on change. In this case, whenever `certified` or `yearsOfExperience` changes on `specialist`, `seniorLevel` will recompute. Any properties on the component are available in the template. This behaves much like an isolate-scoped directive in Angular, and you don't have to think about mapping component attributes using &amp;, =, or @. Instead, component attributes are automatically accessible using `this.get()`.

## Helpers

In Angular, you have the concept of filters which allow you to transform data. For example, you might have a filter that turns a time stamp into a readable time string like "5 years ago". In Ember, these are called helpers.

In Angular, it might look like this:

{% raw %}
```html
{{techSpecialist.startDate | relativeTime}}
```
{% endraw %}

In Ember, it would look like:

{% raw %}
```html
{{relative-time techSpecialist.startDate}}
```
{% endraw %}

To generate a helper in Ember, run `ember generate helper relativeTime`.

```js
// app/helpers/relative-time.js
export function relativeTime(params/*, hash*/) {
  let timestamp = params[0];
  // implementation ...
  return relativeTimeStr;
}

export default Ember.Helper.helper(relativeTime);
```

A helper can be used either as a function in your JavaScript or in your templates.

## Services

In Angular, you have several ways of making services using either a factory, service, value, provider, or constant. A service in Angular is a singleton and can be used to hold state or abstract some type of functionality that can be shared across your application. Similarly, services in Ember are singleton objects used to share state and functionality across your application. For example, maybe you want to have a shopping cart in your application. To generate a `cart` service in Ember, run `ember generate service cart`.

```js
// app/services/cart.js
export default Ember.Service.extend({
  add() { /* implementation */ },
  remove() { /* implementation */ }
});
```

To inject the `cart` service into a route, controller, or component, you can use `Ember.inject.service()`. This is one form of dependency injection in Ember.

```js
export default Ember.Route.extend({
  cart: Ember.inject.service(),
  actions: {
    addToCart(item) {
      this.get('cart').add(item);
    }
  }
});
```

I didn't cover actions, but actions get fired on user events. For example, you might have a product listing page, and when you click on the button "Add to Cart", it will fire the `addToCart` action which you can then use the `cart` service to store the item. Think of actions like `ng-click`, `ng-keypress`, etc.

## Conclusion

As someone who has worked a lot with Angular, what drew me to Ember was its strong sense of convention over configuration, out of the box testing, development consistency across teams, upgrade paths between major versions of the framework, and Ember Data. I didn't talk about Ember Data in this post because it can be a whole post in itself, but it is a robust library for modeling your data and working with APIs and offers much more than `$resource`. This post hasn't been a comprehensive look at Ember, but hopefully it is enough to get you started.

{% include promo.html %}
