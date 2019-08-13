---
layout: tutorial
title: Protecting Web Applications Against Cross-Site Request Forgery (CSRF) Attacks
date: 2019-08-12
description: This post is a brief introduction to protecting web applications against Cross-Site Request Forgery Attacks (CSRF).
keywords: CSRF, XSRF, JavaScript, cross-site request forgery, security, double submit cookie, transparent token
---

## The Problem

Let's say we have built a restaurant review site `restaurant-reviews.com`. Our application makes `POST` requests to `/reviews` (on the same domain) to create a review. The application has a standard authentication system that uses a cookie to identify the user.

Now let's say an attacker decides to make a site at `https://my-restaurant-reviews.com` (notice the subtle domain name difference) that has the following HTML and JavaScript:

```html
<form action="https://restaurant-reviews.com/reviews" method="post">
  <input type="hidden" name="review" value="SOME EVIL REVIEW">
</form>
```

```js
document.querySelector('form').submit();
```

An attacker gets a user of `restaurant-reviews.com` to visit `my-restaurant-reviews.com`. This can happen a number of ways, but maybe `restaurant-reviews.com` allows users to embed HTML in reviews, so the attacker created a simple anchor tag that linked to `my-restaurant-reviews.com` hoping someone would click on it.

When the page loads, the form will submit and the browser will send along that user's cookies for `restaurant-reviews.com`. The `POST` request to `restaurant-reviews.com/reviews` will see that the user is logged in since the session cookie was sent along in the request and create the malicious review without the user knowing. This can happen just by clicking on a link to `https://my-restaurant-reviews.com`.

## Protecting Against CSRF in Server-Rendered Web Apps

In traditional server-rendered web apps, a common technique is to generate a CSRF "token" for each active user session managed by the application. The server would render this token in a hidden input in a form. When the form is submitted, this token would be sent back to the server and will be used to verify that the authenticated user is the one actually making the request to the application.

For example, in Laravel, we can create a form like this with the Blade templating engine:

```html
<form method="post" action="/reviews">
  @csrf
  ...
</form>
```

The `@csrf` Blade directive would generate the following HTML:

```html
<form method="post" action="/reviews">
  <input type="hidden" name="_token" value="sbYzRkYwVfDEb9CH2BuLcivgDng69GM9l80Ek5ux">
  ...
</form>
```

The backend would then check to make sure the value in `_token` in the POST request matches what it generated. If they don't match, then the application will throw an error.

Instead of using a traditional form submission, what if we wanted to make our web application leverage AJAX? How would we then protect against CSRF attacks? A common technique is to use the Double Submit Cookie pattern.

## The Double Submit Cookie Pattern

The Double Submit Cookie Pattern works by having the server write a cookie (let's say it is called `CSRF-TOKEN`) and having the client-side JavaScript read that cookie and set it as an HTTP header when performing HTTP requests.

In our example, the malicious site `my-restaurant-reviews.com` would not be able to read the `CSRF-TOKEN` cookie set by `restaurant-reviews.com` and place it in a header, since cookies can only be read by the domain that created them, so the request would fail.

Angular does exactly this. According to [their documentation](https://angular.io/guide/http#configuring-custom-cookieheader-names):

> Angular's `HttpClient` has built-in support for the client-side half of this technique. `HttpClient` supports a common mechanism used to prevent XSRF attacks. When performing HTTP requests, an interceptor reads a token from a cookie, by default XSRF-TOKEN, and sets it as an HTTP header, X-XSRF-TOKEN. Since only code that runs on your domain could read the cookie, the backend can be certain that the HTTP request came from your client application and not an attacker.
