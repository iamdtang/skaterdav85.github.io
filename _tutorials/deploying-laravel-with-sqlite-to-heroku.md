---
layout: tutorial
title: Deploying Laravel with SQLite to Heroku
date: 2018-01-28
description: Deploying Laravel with SQLite to Heroku
keywords: Laravel, SQLite, Heroku
---

Make sure your SQLite database is at `database/database.sqlite`.

1. Add `"ext-pdo_sqlite": "*"` to the `require` block in `composer.json`. You can read about how to enable various PHP extensions on Heroku [here](https://devcenter.heroku.com/articles/php-support#extensions).
2. Run `composer update`
3. Create a Heroku account.
4. Create a new app in the Heroku dashboard and link your GitHub repo to it.
5. Click the "Enable Automatic Deploys" button. Now, every time you push to your GitHub repo, Heroku will automatically deploy your app.
6. Create a file in your repo called `Procfile`, with the following line: `web: vendor/bin/heroku-php-apache2 public/`. Push it up to your repo. This will trigger Heroku to deploy your app.
7. Navigate to the Settings tab, and add the following environment variables:

```
APP_ENV=development
APP_KEY=whatever your key is here ...
APP_DEBUG=true
APP_LOG_LEVEL=debug
DB_CONNECTION=sqlite
```

You're all set! Click on the "Open app" button and test all of your routes!
