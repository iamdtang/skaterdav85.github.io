---
layout: assignment
title: Midterm
---

The midterm will be an in-class practical where you will build a web application using Laravel in 2.5 hours based on requirements I give you using the material that you learned in the weeks leading up to the exam. You can use previous assignments, notes, and the internet to look things up. You are __NOT ALLOWED__ to communicate with anyone in or outside of class by any means. To study, review assigned readings, past assignments and labs, and class demos.

The app that you will build during the exam will need to be a separate installation from the one you have been using for labs, assignments, and class demos. You will also be expected to deploy this application to Heroku. __Before the midterm__, I encourage you to do the following:

1. Install a new Laravel app. Be sure you are installing a Laravel 6 app instead of a Laraval 7 app. Laravel 7 was released mid-semester. I'm pretty sure everything we've covered also works in Laravel 7, but use Laravel 6 just to be safe. You can install a Laravel 6 app with `composer create-project --prefer-dist laravel/laravel midterm "6.2.*"`. You can verify which version of Laravel your app is running on by looking at the file `composer.json` and the line that contains `"laravel/framework"`.
1. Set up your Laravel app to work with [this SQLite database](/teaching/2020/database.sqlite). This database has a table called `employees` with two columns: `id` and `name`.
1. To make sure you have set up everything correctly, create a GET route at `/employees` that displays all records from the `employees` table.
1. Deploy your app to Heroku and put your Heroku link on the `README.md`.

You are welcome to use Bootstrap so feel free to set that up as well.

## The Project

TBD

## Recommendations

I highly recommend that you make commits along the way. If you ever find yourself in a situation where you want to revert to the last commit where things were working and discard the changes you've made since then, you can run the following git commands from within your repo:

```
git reset --hard
git clean -fd
```

This will delete all changes you've made since the last commit.

## Submission

[https://classroom.github.com/a/LTfYwvFI](https://classroom.github.com/a/LTfYwvFI)
