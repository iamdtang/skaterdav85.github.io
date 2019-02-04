---
layout: assignment
title: Laravel 3
---

For this lab, you will set up a few Eloquent models and write some queries. Start by creating a [GitHub Gist](https://gist.github.com/) called `lastname_firstname_lab1_eloquent.md`. Write the code for each question in triple back ticks. [Here is an example of what your lab submission should look like.](https://gist.github.com/skaterdav85/13fb0230df0335dd1009d777719254ed) Include a comment at the top of the code block for models to specify the location of that model.

To test out your code, use `php artisan tinker`.

1. Find all customers who work for "Apple Inc.".
1. Find invoice 5 and update its `BillingAddress` to "123 Sesame Street".
1. Given `$theWho = Artist::find(144)`, create a new album for `$theWho`.
1. Create a relationship between an invoice and invoice items such that all invoice items for an invoice can be accessed through an `items` property off of an invoice object.
1. Create a relationship between an invoice and invoice items such that the invoice can be accessed from an invoice item object through an `invoice` property.

## Submission

* Send an email to me and the TA with the link to your GitHub Gist. Please use the subject line __ITP 405 Lab Submission - Laravel 3__.
