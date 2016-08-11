---
layout: post
title: Consider Using JSON:API For Your API
date: 2016-08-11
description: Have you ever argued with your team on how an API should be formatted? JSON:API was created to standardize how APIs are built and keep API formatting discussions to a minimum.
keywords: json-api, json:api, json:api tutorial, json:api introduction, json, api, spec, specification, yehuda katz, ember data, steve klabnik, tyler kellen, dan gebhardt, ethan resnick
---

Have you ever argued with your team on how an API should be formatted? [JSON:API](http://jsonapi.org/) is a specification that was created to standardize and reduce the number of decisions that have to be made when building JSON APIs. (Yes, it can be confusing talking about JSON:API compliant APIs and JSON APIs that don't follow the spec). The benefit of following a specification that is opinionated about the format of your API is that it allows developers to be more productive and focus on what matters, the _unique parts_ of an application. Not only does it state what the format should look like, it also embraces hypermedia APIs.

The JSON:API specification was initially drafted by Yehuda Katz (co-creator of Ember and a huge contributor to a number of well known open source projects) and many of the decisions were originally extracted from Ember Data, a robust, client-side data access layer used with Ember. Since then, the spec has gone through several iterations based on lots of feedback and is at 1.0. There are five primary authors: Steve Klabnik, Yehuda Katz, Dan Gebhardt, Tyler Kellen, and Ethan Resnick.

If you haven't looked at the spec, I encourage you to [read through some of it](http://jsonapi.org/) and look at example payload structures.

I've had the pleasure of working with JSON:API and I've really appreciated its opinions. However, I've seen criticisms that typically fall into two buckets: "JSON:API is too bulky" and "What's with hyphens?". In this post, I'd like to address these criticisms from my point of view that may have deterred others from using JSON:API.

## Criticism 1: "JSON:API is too bulky and verbose"

The first thing people usually comment on when they look at the spec is the aesthetics, and say something to the effect of "JSON:API is too bulky and verbose". When you compare it to a lot of APIs out there today, it does indeed seem much "heavier", but there are good reasons for it.

### Distinguishing Attributes and Relationships

Many simple APIs return either an array of objects if you are requesting a list of things or a single object if you are finding something by an ID. For example, you might make a GET request to `/songs` and the response might look like this:

```json
[
  {
    "id": 1,
    "title": "Don't Stop Believin'"
  },
  {
    "id": 2,
    "title": "Forgot About Dre"
  }
]
```

This is simple, but how do you deal with specifying relationships? In this example, each song object probably belongs to a single genre and may have 1-to-many artists. In the example above, song 1 has a single artist (Journey) and song 2 has two artists (Dr. Dre and Eminem). How should these relationships be specified and how do you differentiate between a relationship and a regular attribute? These are questions that JSON:API addresses where each song resource object has a property `attributes` for regular attributes and a property `relationships` for specifying relationships. The above JSON could be represented in JSON:API as follows:

```json
{
  "data": [
    {
      "id": "1",
      "type": "songs",
      "attributes": {
        "title": "Don't Stop Believin'"
      },
      "relationships": {
        "artists": {
          "data": [
            {
              "id": "3",
              "type": "artists"
            }
          ]
        },
        "genre": {
          "data": {
            "id": "9",
            "type": "genres"
          }
        }
      }
    },
    {
      "id": "2",
      "type": "songs",
      "attributes": {
        "title": "Forgot About Dre"
      },
      "relationships": {
        "artists": {
          "data": [
            {
              "id": "4",
              "type": "artists"
            },
            {
              "id": "8",
              "type": "artists"
            }
          ]
        },
        "genre": {
          "data": {
            "id": "7",
            "type": "genres"
          }
        }
      }
    }
  ]
}
```

As you can see, it may come across as more "bulky" but part of this is to differentiate between regular attributes and relationships, and how different types of resources related to one another.

### "Make your API consistent and write decent documentation"

Some might say, "make your API consistent and write decent documentation". Then, you don't need to follow a specification. The benefit of a spec is that libraries can be written that adhere to a known format. With standards in place, open source libraries are created that allow developers to use shared solutions and _write less custom code_. Writing less custom code often means easier maintenance. Have you ever worked on a project with so much custom code that had little to no documentation and changing that code was either a nightmare or the person who wrote it was responsible for making the changes if they still worked there? Sometimes that code is labeled as legacy code that a team may want to rewrite. How often do developers write documentation for code they've written that isn't open sourced? From my experience, not often. Using a popular open source solution likely means there is documentation which helps for long term maintenance and passing your code on to developers after you.

## Criticism 2: "What's with the hyphens?"

Another criticism I've often heard is the hyphenation of attributes. For example:

```json
{
  "data": {
    "id": "1",
    "type": "users",
    "attributes": {
      "first-name": "Eric",
      "last-name": "Kosten"
    }
  }
}
```

When you initially look at a payload like this, you might be turned off by the hyphens in multi-word attributes, as the hyphen isn't an easy character to work with in many programming languages. For example, in JavaScript, you'd have to use bracket notation instead of dot notation to access `first-name`. Using bracket notation in JavaScript requires extra keystrokes than if the property had been in a form that could be used with dot notation.

### Why Hyphens?

So why were hyphens used? First, hyphens are not required. The [spec recommends using hyphens](http://jsonapi.org/recommendations/), but if you really don't want to, you can use another delimiter while still being compliant. I'll explain later why you'd probably want to stick with the recommendations. According to Dan Gebhardt, one of the authors of the spec, hyphens were used "primarily for symmetry in our recommendations for URLs and type names (which are used to form URLs)." Here is the [original tweet](https://twitter.com/dgeb/status/758311284559507456). Now although you could use another URL safe delimiter like an underscore, URLs typically use hyphens, so I'm guessing the spec went with hyphens for URL consistency and familiarity.

### Why You Should Follow The Recommendations and Use Hyphens

I mentioned that hyphens are recommended but not required in order to be JSON:API compliant. However, I still recommend you follow the recommendations unless you have a really good reason not to. Here's why.

First, if you are building a moderately complex application, it can be bad practice to consume an API in its raw form without a deserialization process. Consuming an API in its raw form probably means that the case conventions used in the API ends up being used in your application. If the API used snake_cased attributes, that means you are probably referencing `first_name` and `last_name` throughout your code base. If you are working in JavaScript, your code is probably following camelCase. Having inconsistent conventions in a code base can be frustrating and make maintenance more difficult. You could use snaked_case as your convention for your entire application, but do you really want your API dictating your code style? Instead, a better approach might be to have a data access layer that deserializes attributes when receiving payloads from the server and serializes attributes when sending data back to the server. With a good data abstraction layer, case conversion can easily be tackled. A good example of this is Ember Data.

Second, many libraries follow the spec recommendations out of the box. If your API follows JSON:API and its recommendations, a user will likely be able to choose a popular library and consume your API with little configuration. Deviating from the spec recommendations might mean more configuration on developers who want to use your API.

Third, the examples in the spec documentation follow the recommendations. If you want someone to learn about JSON:API, you'll likely be pointing them to the spec. By following the spec recommendations, you don't have to document your deviations or make users aware of the recommendations that you aren't following. Plus, the learning curve might be a easier.

## Final Thoughts

Hopefully this post has intrigued you a little to check out JSON:API. If the reasons above weren't compelling enough, just know that there are some really smart people behind it that spent a lot of time thinking about how APIs should be built. Following a spec frees up your mental capacity to think about your application.

Also, in my opinion, JSON:API isn't for every application. If you want a simple API that an application can consume in its raw form, go with a simpler JSON response. Just beware of the tradeoffs.

## Where to Learn More about JSON:API?

If you haven't checked out the [JSON:API specification](http://jsonapi.org/) yet, I encourage you to look at it. There is also a great podcast on [The Changelog with Yehuda Katz](https://changelog.com/189/) talking about JSON:API. If you are a frontend developer, I'd recommend you check out Ember Data a little bit, as it works with JSON:API out of the box and it might give you some ideas on how to create a client-side data abstraction layer that works with JSON:API. Lastly, check out the [long list of client and server libraries that implement JSON:API](http://jsonapi.org/implementations/).

Interested in building an API with JSON:API using Node.js? Sign up for my newsletter to be notified next week when I release it!
