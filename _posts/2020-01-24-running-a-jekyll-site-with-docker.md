---
layout: post
title: Running a Jekyll Site with Docker
date: 2020-01-24
description: This post shows how to run a Jekyll site with Docker.
keywords: jekyll, blog, site, docker
image: jekyll
---

## 1. Install Docker Desktop

Install [Docker Desktop](https://www.docker.com/products/docker-desktop) and start it up.

## 2. Create `docker-compose.yml`

Create a `docker-compose.yml` file in the root of your Jekyll project with the following contents:

```yaml
jekyll:
  image: jekyll/jekyll:pages
  command: jekyll serve --watch --incremental
  ports:
    - 4000:4000
  volumes:
    - .:/srv/jekyll
```

## 3. Run your Jekyll Site

Run `docker-compose up` from the root of your project. This will run the `jekyll` command you're probably familiar with and generate your site which can be viewed at [http://localhost:4000/](http://localhost:4000/). 