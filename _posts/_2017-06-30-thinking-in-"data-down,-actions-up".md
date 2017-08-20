---
layout: post
title: Thinking in "Data Down, Actions Up"
date: 2017-06-30
description: TBA
keywords: DDAU, data down, actions up, one way data flow, unidirectional data flow
---

http://emberup.co/bindings-with-htmlbars-helpers/

==================================================================================================================

One challenge that I often see newcomers to Ember facing is understanding the "Data Down, Actions Up" (DDAU) paradigm. This can be especially challenging if you've never worked with a component based framework. Let's look at some examples written without DDAU in mind, and their DDAU counterparts.

## Example 1 - A Pagination Component

Say you're building a pagination component. This component needs to do the following:

* Show the current page
* Have previous and next buttons
* Disable the previous button when the page is 1
* Disable the next button when the page is on the last page

One way this component might be designed is something like this:

```hbs
{{my-pagination
  page=currentPage
  totalPages=totalPages}}
```

## Example 2 - Tracking an Active Item in a List

- use a service?

## Enforcing Data Down, Actions Up

One way you can enforce the Data Down, Actions up paradigm is to use the `readonly` helper.

- https://discuss.emberjs.com/t/ddau-readonly-attributes-still-modifiable-just-not-reassignable/12001
- example without it and how you can modify outer scope variable
- example with it and how it doesnt modify outer scope variable

## Takeaways




```hbs
{{my-pagination
  page=currentPage
  totalPages=totalPages
  onPageChange=(action "fetchRecordsForPage")}}
```
