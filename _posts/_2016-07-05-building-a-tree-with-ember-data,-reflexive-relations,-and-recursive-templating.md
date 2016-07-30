---
layout: post
title: Building a Tree with Ember Data Reflexive Relations and Recursive Templating
date: 2016-07-05
categories: ember
description: TBA
keywords: Ember, EmberJS, tree, model, relationship, to itself, Ember.js, recursive, template, Ember Data
---

- How to build a tree
- First thought might be to use a nested data structure and embedded records. a structure that mimicks the tree hierarchy in the UI
- Turns out, we don't have to do that thanks to reflexive relationships
- Explain the first type of reflexive relationship that pertains to the tree with sample JSON
  - ??? see other article on reflexive relations
- now lets render the tree
- find all nodes without a parent (root level nodes)
- render those, and if each has a children render those as well, resursively
- rendering recursively is quite easy in ember with components
- whats the base case?

OR

Reflexive Relations in Ember Data
- theres 3 kinds
- 1. 1 to 1 - best freind example
- 2. 1 to 1 where best freind but not reciprocated
- 3. 1 to many
