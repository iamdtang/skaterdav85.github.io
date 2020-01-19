---
layout: post
title: Handling Errors in Ember Data
date: 2016-01-09
last_modified_at: 2020-01-18
description: This post covers what Ember Data expects for error responses and how they map to our model attributes.
keywords: ember data errors, AdapterError, AdapterError, model errors, JSON:API errors, JSONAPI errors, JSONAPISerializer, errors, RESTSerializer, JSONSerializer, isValid, Errors, InvalidError
image: ember
---

In my last post [Which Ember Data Serializer Should I Use?](/2015/12/05/which-ember-data-serializer-should-i-use.html), I wrote about the different serializers in Ember Data and their expected API responses. Now let's look at the expected error responses and how to work with errors.

As of Ember Data 2.x, all error responses follow the JSON:API spec. A JSON:API error response looks like this:

```json
{
  "errors": [
    {
      "id": "{unique identifier for this particular occurrence}",
      "links": {
        "about": "{link that leads to further details about this problem}"
      },
      "status": "{HTTP status code}",
      "code": "{application-specific error code}",
      "title": "{summary of the problem}",
      "detail": "{explanation specific to this occurrence of the problem}",
      "source": {
        "pointer": "{a JSON Pointer to the associated entity in the request document}",
        "parameter": "{a string indicating which URI query parameter caused the error}"
      },
      "meta": {}
    }
  ]
}
```

The response must contain a root key `errors` which is an array of error
objects. Each error object can have any of the properties listed above. To find
out more about each property of an error object, visit the
<a href="http://jsonapi.org/format/#error-objects" target="_blank">JSON:API error documentation</a>.

One thing I want to point out is that the JSON:API spec states that an error object __MAY__ have those
members, but which of those properties does Ember Data use?

Let's say we want to create or update a new `user` record and handle the scenario when
there is an error validating the `name` attribute. What should that
error object look like? The __two__ error object properties we will need the API to include
are `detail` and `source`. For example:

```json
{
  "errors": [
    {
      "detail": "Name is not long enough",
      "source": {
        "pointer": "data/attributes/name"
      }
    }
  ]
}
```

The property `source.pointer` is a _JSON pointer_ to a specific attribute, the `name`
attribute in this case. A JSON pointer is a string using a slash-based syntax
that identifies a specific value in a JSON document. If we were to look at a `user`
resource following JSON:API, it would look like this:

```json
{
  "data": {
    "type": "users",
    "id": "8",
    "attributes": {
      "name": "David Tang"
    }
  }
}
```

We can see how the JSON pointer `data/attributes/name` maps to `name` in this JSON document. Learn more about JSON pointers [here](https://tools.ietf.org/html/rfc6901).

Not only does the API need to send the error response formatted as above,
but it also needs to send a 422 HTTP status code (Unprocessable Entity). Behind the scenes,
when the adapter sees a 422 status code, it rejects the promise with an instance of
`InvalidError` to signal that the record failed server-side validation.

Once we've got that, an `errors` property will be available on our model.

```js
try {
  await user.save();
} catch(adapterError) {
  console.log(user.errors); // instance of Errors
  console.log(user.errors.name); // array of error objects for the name attribute
  console.log(user.errors.toArray());
  console.log(user.isValid); // false
  console.log(adapterError); // instance of AdapterError
}
```

As we can see in the catch block, there is a lot of information at our disposal. To display the errors, we can do the following in our template:

```html
{% raw %}
{{#each @model.errors.name as |error|}}
  <div class="error">
    {{error.message}}
  </div>
{{/each}}
{% endraw %}
```

Accessing the attribute name off of the `errors` object will return an array of all errors for that
attribute.

{% include ember-data-promo.html %}
