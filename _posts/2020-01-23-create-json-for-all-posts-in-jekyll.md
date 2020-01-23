---
layout: post
title: Create JSON for All Posts in Jekyll
date: 2020-01-23
description: This post shows how to create a JSON feed of all of your posts in a Jekyll site.
keywords: jekyll, json, api, posts, endpoint
image: jekyll
---

Create `posts.json` (you can name this file whatever you want) in the root of a Jekyll site with the following contents:

```liquid
---
---
[
  {% raw %}{% for site.post in posts %}
    {% unless post.link %}
      {
        "url": "{{post.url}}",
        "title": {{post.title | jsonify}},
        "content": {{post.content | jsonify}},
        "keywords": "{{post.keywords}}",
        "created": "{{post.date | date: "%B %e, %Y"}}"
      }{% unless forloop.last %},{% endunless %}
    {% endunless %}
  {% endfor %}{% endraw %}
]
```

Visit `/posts.json` and voila! For example, my posts JSON endpoint is [https://davidtang.io/posts.json](https://davidtang.io/posts.json).

This example can be used to create JSON for other collections your Jekyll site may have.

