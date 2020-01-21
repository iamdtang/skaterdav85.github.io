---
layout: post
title: Setting Up GitHub Actions for an Ember CLI Project
date: 2020-01-20
description: Learn how to set up continuous integration with GitHub Actions for your Ember CLI project.
keywords: ember, github actions, ci, continuous integration
image: ember
---

1. Go to your repository on GitHub and click on the "Actions" tab.
2. Click on the "New workflow" button on the left.
3. Click on the "Set up a workflow yourself" button on the right.
4. Copy and paste the following YAML configuration into the editor which will create the file `.github/workflows/main.yml`. Then click on the green "Start commit" button.

```yml
name: Ember

on: [pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x]

    steps:
      - uses: actions/checkout@v1
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install Dependencies
        run: npm ci
      - name: JavaScript Linting
        run: npm run lint:js
      - name: Template Linting
        run: npm run lint:hbs
      - name: npm test
        run: npm test
        env:
          CI: true
```

The `CI: true` line will set an [environment variable](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/workflow-syntax-for-github-actions#env) called `CI` for the `npm test` step, which will be used if your `testem.js` file contains the following line:

```js
process.env.CI ? '--no-sandbox' : null
```

[The default `testem.js` file](https://github.com/ember-cli/ember-new-output/blob/v3.15.1/testem.js#L14) has this line.