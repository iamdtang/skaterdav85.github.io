---
layout: post
title: Adding Svelte 3 to an Existing Application
date: 2020-01-23
description: Learn how to sprinkle in Svelte 3 components into an existing project.
keywords: svelte, svelte 3, rollup.js, Rollup
image: svelte
---

Interested in sprinkling Svelte into an existing application? This is how I did it.

## 1. Scaffold a Svelte Application in the Existing Application

First, I ran the following command in my existing application:

```
npx degit sveltejs/template svelte-components
```

This will scaffold a Svelte project in a new directory called `svelte-components` and install its dependencies. You can do this wherever you want, but I recommend putting this directory where it won't be served by the web server.

## 2. A `HelloWorld` Component

Inside of `svelte-components/src`, create the file `HelloWorld.svelte` with the following contents:

```html
<p>Hello World!</p>
```

Next, add the following to `svelte-components/src/main.js`:

```js
import HelloWorld from './HelloWorld.svelte';

new HelloWorld({
  target: document.querySelector('#hello-world-container')
});
```

This assumes you have an element with an `id` of `hello-world-container` in your existing application. The `HelloWorld` Svelte component will get rendered there.

## 3. Change the JS and CSS Build Paths in `rollup.config.js`

Inside of `rollup.config.js`, change the `file` property and specify where you want the JavaScript to be built to:

```js
output: {
  // ...
  file: '../dist/svelte-bundle.js'
}
```

Similarly, change where you want the CSS to be built to:

```js
svelte({
  // ...
  css: css => {
    css.write('../dist/svelte-bundle.css');
  }
})
```

## 4. Link to the Built JS and CSS from the Existing Application

Create a `script` tag for `svelte-bundle.js` and a `link` tag for `svelte-bundle.css` in your existing application. For example:

```html
<link href="/dist/svelte-bundle.css" rel="stylesheet">
<script defer src="/dist/svelte-bundle.js"></script>
```

This blog is built using Jekyll. I did the following so that users will get the latest assets on every Jekyll build.

```html
<link href="/dist/svelte-bundle.css?{% raw %}{{site.time | date: '%s%N'}}{% endraw %}" rel="stylesheet">
<script defer src="/dist/svelte-bundle.js?{% raw %}{{site.time | date: '%s%N'}}{% endraw %}"></script>
```

The [`site.time`](https://jekyllrb.com/docs/variables/#site-variables) variable is the time when the site was built (when you run the `jekyll` command).

## 4. Run your Application

In development, run `npm run dev` in `svelte-components` and run your application as usual. Svelte uses [rollup.js](https://rollupjs.org/) and `npm run dev` will use Rollup to watch for file changes and rebuild `svelte-bundle.css` and `svelte-bundle.js`.

## 5. Building for Production

When running `npm run dev`, our `svelte-bundle.css` and `svelte-bundle.js` files won't be minified. To do that for production, run `npm run build`. Manually doing this for every production build will probably get annoying, so add this to your deployment script.

## 6. Clean Up

Because I sprinkled Svelte components into an existing application, I didn't need the `svelte-components/public` directory so I deleted it. The files that I kept include:

* `svelte-components/src/HelloWorld.svelte`
* `svelte-components/src/main.js`
* `svelte-components/rollup.config.js`
* `svelte-components/package.json`
* `svelte-components/package-lock.json`

Hope that helps! Reach out to me on Twitter [@iamdtang](https://twitter.com/iamdtang) if you have any questions.