---
layout: post
title: Keywords Lists vs. Maps in Elixir
date: 2019-01-02
description: This post covers keyword lists in Elixir.
keywords: elixir, keyword list
---

For the past 10 years, my programming experience has mostly focussed on JavaScript and PHP. I've learned a few functional programming concepts through JavaScript, such as function purity, immutability, and side effects, but I've never worked with a true functional language. I've decided to learn [Elixir](https://elixir-lang.org/), a functional programming language, and blog about my journey.

<hr>

## Keyword Lists

In Elixir, a keyword list is a collection type of data structure. You will commonly see it in the following form:

```elixir
list = [ a: 1, b: 2 ]
```

The long form of this is a list of tuples containing 2 values, where the first value is an atom representing the key and the second value is the associated value.

```elixir
list = [ {:a, 1}, {:b, 2} ]
```

Keyword lists must have atoms as keys.

We can access values as such:

```elixir
list[:a] # 1
```

To add values, we can use the `++` operator:

```elixir
list = [ a: 1, b: 2 ] ++ [ c: 3 ]
# [ a: 1, b: 2, c: 3 ]
```

To remove values, we can use the `--` operator:

```elixir
list = [ a: 1, b: 2, c: 3 ] -- [ c: 3 ]
# [ a: 1, b: 2, c: 3 ]
```

## Maps

## Keyword Lists vs Maps

So both are key value pairs. When should you use a keyword list and when should you use a map?

Typically you'll find keyword lists used as a list of options to a function. For example:


Why? Per [the documentation](https://elixir-lang.org/getting-started/keywords-and-maps.html):

> Remember, though, keyword lists are simply lists, and as such they provide the same linear performance characteristics as lists. The longer the list, the longer it will take to find a key, to count the number of items, and so on. For this reason, keyword lists are used in Elixir mainly for passing optional values. If you need to store many items or guarantee one-key associates with at maximum one-value, you should use maps instead.
