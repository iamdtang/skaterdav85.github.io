---
layout: post
title: Handling Errors with Ember Data
date: 2016-01-09
description: So you know how to work with Ember Data and the happy paths when your promises resolve. That's great, but you also need to handle error responses. Let's look at how to do that when your API adheres to the JSON API specification or the formats expected by the `RESTSerializer` and `JSONSerializer`.
keywords: ember data errors, AdapterError, DS.AdapterError, model errors, JSON API errors, JSONAPI errors, JSONAPISerializer, errors, RESTSerializer, JSONSerializer, isValid, DS.Errors, DS.InvalidError
---

__UPDATED 3/25/16 to reflect Ember Data 2.x__

Last time I wrote about the different serializers in Ember Data and their corresponding API response formats in my post [Which Ember Data Serializer Should I Use?](/2015/12/05/which-ember-data-serializer-should-i-use.html). You know how to work with Ember Data and the happy paths when your promises resolve. That's great, but you also need to handle error responses. Let's look at how to do that.

As of Ember Data 2.x, all error responses follow the JSON-API spec. A JSON-API error response looks like this:

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
<a href="http://jsonapi.org/format/#error-objects" target="_blank">JSON API error documentation</a>.

One thing I want to point out is that the JSON API spec states that an error object __MAY__ have those
members. But which of those properties does Ember Data use?

Let's say we want to create/update a new `user` record and handle the scenario when
there is an error validating the `name` attribute. What should that
error object look like? The __two__ error object properties you will need the API to include
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
that identifies a specific value in a JSON document. If you were to look at a `user`
JSON document following JSON API, it would look like this:

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

You can see how that JSON pointer `data/attributes/name` maps to this JSON document. You
can learn more about JSON pointers [here](https://tools.ietf.org/html/rfc6901).

Back to the example. Not only does the API need to send the error response formatted as above,
but it also needs to send a 422 HTTP status code (Unprocessable Entity). Behind the scenes,
when the adapter sees a 422 status code, it rejects the promise with an instance of
`DS.InvalidError` to signal that the record failed server side validation.

Once you've got that, an `errors` property will be available on your model.

```js
user.save().then(() => {
  // handle success
}).catch((adapterError) => {
  console.log(user.get('errors')); // instance of DS.Errors
  console.log(user.get('errors.name')); // array of error objects for the name attribute
  console.log(user.get('errors').toArray());
  console.log(user.get('isValid')); // false
  console.log(adapterError); // instance of DS.AdapterError
});
```

As you can see in the catch block, there is a lot of information at your disposal. What you're likely
to use are the `errors` and `isValid` properties on the model. To display the errors, you can do the following in your template:

```html
{% raw %}
{{#each model.errors.name as |error|}}
  <div class="error">
    {{error.message}}
  </div>
{{/each}}
{% endraw %}
```

Accessing the attribute name off of the `errors` object will return an array of all errors for that
property.

## Handling Errors for RESTSerializer and JSONSerializer before Ember Data 2.x

__The format below was marked as deprecated in 1.13.__ Error responses now follow the JSON-API format described above. Read about the deprecation <a href="http://emberjs.com/blog/2015/06/18/ember-data-1-13-released.html#toc_new-errors-api" target="_blank">here</a>.

So what if your API isn't based on JSON API and instead follows the conventions expected by `DS.RESTSerializer` or `DS.JSONSerializer`? What do error responses look like then? Error responses should look like this:

```json
{
  "errors": {
    "name": [
      "Name is not long enough"
    ]
  }
}
```

The response will also have a root key `errors`. Each property corresponds to a model attribute and contains an array of error messages. Similar to JSON API, a 422 HTTP status code should be returned.

Thanks to Artur Kesik (qnsi) and Jason Mitchell (jsonmit) for helping me out in the Ember discussion forum!

{% include promo.html %}
