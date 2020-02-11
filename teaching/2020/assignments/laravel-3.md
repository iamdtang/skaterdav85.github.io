---
layout: assignment
title: Laravel 3
---

Create a repo with a `README.md`. In this file, write the Eloquent code for each question in code fences (triple back ticks). [Here is an example of what your submission should look like.](https://gist.github.com/skaterdav85/13fb0230df0335dd1009d777719254ed) If you click on "Raw", you can see the Markdown. If your Markdown submission is not formatted like the example, you will lose points.

To test out your code, use `php artisan tinker`.

1. Find all tracks with the genre "Metal".
1. Find all customers who work for "Apple Inc.".
1. Find invoice 5 and update its `BillingAddress` to "123 Sesame Street".
1. Given `$theWho = Artist::find(144)`, create a new album for `$theWho`. Use relationships instead of accessing `$theWho->ArtistId` directly.
1. What is the total of all invoices in 2012?
1. What is the average track length?
1. Create a relationship between an invoice and invoice items such that all invoice items for an invoice can be accessed through an `items` property off of an invoice object.
1. Create a relationship between an invoice and invoice items such that the invoice can be accessed from an invoice item object through an `invoice` property.

__NOTE:__ The primary key in the `invoice_items` table is NOT `InvoiceItemId` as you might expect. The primary key of `invoice_items` is actually `InvoiceLineId`. If you open up the database in SQLite from the command line, (see [this page](/tutorials/sqlite) if you forgot), you will see that. This is pertinent to the last 2 questions.

Some helpful resources:

* [Retrieving Aggregates](https://laravel.com/docs/6.x/eloquent#retrieving-aggregates)
* [Inserting and Updating Related Models](https://laravel.com/docs/6.x/eloquent-relationships#inserting-and-updating-related-models)

## Submission

[https://classroom.github.com/a/EtqkzX4o](https://classroom.github.com/a/EtqkzX4o)