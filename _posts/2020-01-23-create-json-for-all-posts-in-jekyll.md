---
layout: post
title: Create a JSON Endpoint for All Posts in Jekyll
date: 2020-01-23
description: This post shows how to create a JSON feed of all of your posts in a Jekyll site.
keywords: jekyll, json, api, posts, endpoint
image: jekyll
---

Create `posts.json` (you can name this file whatever you want) in the root of your Jekyll site with the following contents:

```liquid
---
---
[
  {% raw %}{% for post in site.posts %}
    {
      "url": "{{post.url}}",
      "title": {{post.title | jsonify}},
      "content": {{post.content | jsonify}},
      "keywords": "{{post.keywords}}",
      "created": "{{post.date | date: "%B %e, %Y"}}"
    }{% unless forloop.last %},{% endunless %}
  {% endfor %}{% endraw %}
]
```

Visit `/posts.json` and voila! For example, my posts JSON endpoint is [https://davidtang.io/posts.json](https://davidtang.io/posts.json).

This example used the `site.posts` collection but other collections can be used too.

With this JSON endpoint, we can make AJAX requests to it. I did this for the search bar on this blog. For example:

```js
(async () => {
  const response = await fetch('/posts.json');
  const posts = await response.json();
  console.log(posts);
})();
```