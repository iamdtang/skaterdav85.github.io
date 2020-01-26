---
layout: post
title: Adding Svelte 3 to a Jekyll Site
date: 2020-01-25
description: Learn how to sprinkle in Svelte 3 components into a Jekyll site.
keywords: svelte, svelte 3, jekyll, blog, static, site
image: svelte
---

Interested in sprinkling Svelte into your Jekyll site? This is how I did it.

## 1. Scaffold a Svelte Application in your Jekyll Site

First, I ran the following command in my Jekyll site:

```
npx degit sveltejs/template svelte-components
```

This will scaffold a Svelte project in a new directory called `svelte-components` and install its dependencies.

## 2. Update `_config.yml`

Add `svelte-components` to the `exclude` section in your `_config.yml` so that Jekyll excludes this directory during the site generation:

```yaml
exclude:
  - svelte-components
```

## 3. A `HelloWorld` Component

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

This assumes you have an element with an `id` of `hello-world-container` in your Jekyll site. The `HelloWorld` Svelte component will get rendered there.

## 4. Change the JavaScript and CSS Build Paths in `rollup.config.js`

Here we'll configure where we want Svelte to build our JavaScript and CSS. I chose to have them built into a `dist` folder in the root of my Jekyll site:

Inside of `rollup.config.js`, change the `file` property to the following:

```js
output: {
  // ...
  file: '../dist/svelte-bundle.js'
}
```

We'll do the same for our CSS:

```js
svelte({
  // ...
  css: css => {
    css.write('../dist/svelte-bundle.css');
  }
})
```

## 5. Link to the Built JavaScript and CSS 

Now create a `script` tag for `svelte-bundle.js` and a `link` tag for `svelte-bundle.css` in your Jekyll site. For example, this Jekyll blog has a layout file located in `_layouts/default.html` that is used for all pages. I added the following in the `head`:

```html
<link
  href="/dist/svelte-bundle.css?{% raw %}{{site.time | date: '%s%N'}}{% endraw %}" rel="stylesheet">

<script
  defer
  src="/dist/svelte-bundle.js?{% raw %}{{site.time | date: '%s%N'}}{% endraw %}">
</script>
```

I included the [`site.time`](https://jekyllrb.com/docs/variables/#site-variables) as a query string parameter so that old versions of these assets aren't cached in visitors' browsers. The [`site.time`](https://jekyllrb.com/docs/variables/#site-variables) variable is the time when the site was built (when the `jekyll` command is run).

## 6. Running for Development

In development, run `npm run dev` in `svelte-components` and run your Jekyll site as usual. Svelte uses [rollup.js](https://rollupjs.org/) and `npm run dev` will use Rollup to watch for file changes and rebuild `svelte-bundle.css` and `svelte-bundle.js`.

## 7. Building for Production

When running `npm run dev`, our `svelte-bundle.css` and `svelte-bundle.js` files won't be minified. To do that for production, run `npm run build`. Manually doing this for every production build will probably get annoying, so I added a pre-commit hook via [husky](https://github.com/typicode/husky) to take care of this. To do this, add the following to `package.json`:

```json
{
  "devDependencies": {
    "husky": "^4.0.10"
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run build --prefix svelte-components; git add --all;"
    }
  }
}
```

Update the `exclude` section in `_config.yml` again to look like the following:

```yaml
exclude:
  - svelte-components
  - node_modules
  - package.json
  - package-lock.json
```

## 8. Clean Up

Because I sprinkled Svelte components into my Jekyll site, I didn't need the `svelte-components/public` directory so I deleted it. The files that I kept include:

* `svelte-components/src/HelloWorld.svelte`
* `svelte-components/src/main.js`
* `svelte-components/rollup.config.js`
* `svelte-components/package.json`
* `svelte-components/package-lock.json`

Hope that helps! Reach out to me on Twitter [@iamdtang](https://twitter.com/iamdtang) if you have any questions.