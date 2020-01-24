---
layout: post
title: Using SQLite with PHP on Heroku
date: 2020-01-24
description: This post covers how to use SQLite with PHP on Heroku.
keywords: PHP, SQLite, Heroku
---

## 1. Our Project

Let's say we have a project with the following directory structure:

* index.php
* database.sqlite

Our `index.php` file contains the following:

```php
$pdo = new PDO('sqlite:database.sqlite');
// ... the rest of your code
```

## 2. Run Composer

First, create the file `composer.json` in the root of the project with the following contents:

```json
{
  "require": {
    "ext-pdo_sqlite": "*"
  }
}
```

This will enable the `pdo_sqlite` PHP extension on Heroku. You can read more about how to enable various PHP extensions on Heroku [here](https://devcenter.heroku.com/articles/php-support#extensions).

Next, install [Composer](https://getcomposer.org/) and run `composer install`. This will generate a `composer.lock` file. Add `vendor` to your `.gitignore`.

## 3. Deploy to Heroku

The app is good to go! Just push up these changes to Heroku and everything should work.
