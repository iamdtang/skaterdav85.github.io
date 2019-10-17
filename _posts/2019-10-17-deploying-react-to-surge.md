---
layout: post
title: Deploying React Projects to Surge.sh
date: 2019-10-17
description: 
keywords: react, create-react-app, surge, deploy
image: react
---

We can easily deploy React projects created with Create React App to [Surge.sh](https://surge.sh/), the static web publishing platform for front-end developers.

Here is the TLDR:

```
npm install -g surge
npm run build
cd build
mv index.html 200.html
surge
```

Ok, now with a little more of an explanation. First, install `surge` via NPM:

```
npm install -g surge
```

Next, build your project. This will get output to a `build` directory:

```
npm run build
```

Next, we'll `cd` into that `build` directory and rename `index.html` to `200.html`:

```
cd build
mv index.html 200.html
```

If we don't rename `index.html`, everything will work fine, but if we've implemented client-side routing (maybe with React Router) and we navigate to a new route and refresh the page, we'll get a 404 "page not found" error. Since many React projects implement client-side routing, I have included this step. If you aren't using client-side routing, feel free to skip renaming the `index.html` file. Read more about [adding a 200 page for client-side routing on the Surge help docs](https://surge.sh/help/adding-a-200-page-for-client-side-routing).

Lastly, run `surge` from within that `build` directory:

```
surge
```

That's it!




