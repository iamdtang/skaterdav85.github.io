---
layout: post
title: SQLite Cheatsheet
date: 2018-01-14
description: The fundamentals of SQLite
keywords: sqlite
---

```
// create a database
sqlite3 employees.db

// Creates a table in the database
// Primary Key automatically generates values that start at 1 and increase by 1
// name is a text field that will hold employee names
create table employees (id integer primary key, name text);

insert into employees (id, name) values(1, 'Max Eisenhardt');
insert into employees (name) values('Pietro Maximoff');
insert into employees (name) values('Wanda Maximoff');
insert into employees (name) values('Mortimer Toynbee');
insert into employees (name) values('Jason Wyngarde');

// In column mode, each record is shown on a separate line with the data aligned in columns
// headers on shows the column names, if off they wouldn't show
.mode column
.headers on

select * from employees;

// Changes the width of the columns
.width 15 20

.exit

// Reopen database
sqlite3 employees.db

// Displays the tables
.tables

// Show the current settings
.show

// Used to export database into SQL format on the screen
.dump

// Output to a file
.output ./Documents/sqlite3Files/employees.sql
.dump
.output stdout // Restores output to the screen

// Delete a table
drop table employees;

// Output html table
.mode html
select * from employees;
.output stdout

// display table information
PRAGMA table_info(tracks);
```

This is a modified version from [http://www.newthinktank.com/2013/05/sqlite3-tutorial/](http://www.newthinktank.com/2013/05/sqlite3-tutorial/), which has more details if you are interested in learning more.
