---
layout: post
title: Keywords Lists in Elixir
date: 2019-01-02
description: Time to dive into functional programming and learn Elixir. This post covers keyword lists.
image: elixir-thumb.png
image_alt: Elixir programming language logo
card_style: summary
keywords: elixir, keyword list
---

{% include elixir-series-intro.md %}

In Elixir, a keyword list is a collection type of data structure.

## Defining a Keyword List

You will commonly see a keyword list defined with the following syntax:

```elixir
list = [a: 1, b: 2]
```

This is syntactic sugar for a list of tuples containing 2 values, where the first value is an atom representing the key and the second value is the associated value.

```elixir
list = [{:a, 1}, {:b, 2}]
```

Keyword lists have a few characteristics:

* The keys must be atoms
* The key/value pairs have an order
* Keys can be used more than once

Keyword lists are typically used for a list of options. Let's look at an example.

`String.split/2` can split a string by some delimiter:

```elixir
String.split("1,2,3,4", ",")
# ["1", "2", "3", "4"]
```

However, if you split a string by an empty string, the first and last items will be empty strings:

```elixir
String.split("Elixir", "")
# ["", "E", "l", "i", "x", "i", "r", ""]
```

We can exclude these empty strings by passing in the `trim` option:

```elixir
String.split("Elixir", "", [trim: true])
# ["E", "l", "i", "x", "i", "r"]
```

Elixir gives us even more syntactic sugar when a keyword list is used as the last argument in a function by allowing us to leave off the brackets:

```elixir
String.split("Elixir", "", trim: true)
# ["E", "l", "i", "x", "i", "r"]
```

You will see this shorthand used pretty frequently.

## Reading Values from a Keyword List

We can access values from a keyword list with bracket notation:

```elixir
list = [{:a, 1}, {:b, 2}]
list[:a] # 1
```

We can also read values with the [Keyword](https://hexdocs.pm/elixir/Keyword.html) module, specifically the `Keyword.get/2` function:

```elixir
Keyword.get([a: 1, b: 2 ], :b) # 2
```

## Manipulating a Keyword List

To add values, we can use the `++` operator:

```elixir
list = [a: 1, b: 2] ++ [c: 3]
# [a: 1, b: 2, c: 3]
```

To remove values, we can use the `--` operator:

```elixir
list = [a: 1, b: 2, c: 3] -- [c: 3]
# [a: 1, b: 2]
```

We can also manipulate keyword lists using the [Keyword](https://hexdocs.pm/elixir/Keyword.html) module.

For example, to add or replace values, we can use [`Keyword.put/3`](https://hexdocs.pm/elixir/Keyword.html#put/3):

```elixir
Keyword.put([a: 1, b: 2], :c, 3)
# [c: 3, a: 1, b: 2]

Keyword.put([a: 1, b: 2], :b, 5)
# [b: 5, a: 1]
```

Notice how the added or updated key/value pair gets moved to the first position in the list.

## Pattern Matching on a Keyword List

You can also pattern match on keyword lists. However, according to the guides, "it is rarely done in practice since pattern matching on lists requires the number of items and their order to match".

```elixir
[a: a, b: b] = [a: 1, b: 2]
# a is 1 and b is 2

[b: b, a: a] = [a: 1, b: 2]
# MatchError (the order doesn't match)

[a: a] = [a: 1, b: 2]
# MatchError (the size doesn't match)
```

## Duplicate Keys in a Keyword List

As mentioned above, keyword lists can have keys used more than once.

```elixir
list = [a: 1, b: 2, a: 3]

list[:a] # 1 (the first value is returned)
Keyword.get_values(list, :a) # [1, 3]
```

When it comes to updating a key that appears more than once in a keyword list, `Keyword.put/3` will remove all entries for that key and put the key with its new value at the beginning of the list:

```elixir
Keyword.put([a: 1, b: 2, a: 3], :a, 4)
# [a: 4, b: 2]
```

## Working with Keyword Lists

We already saw that we can use `Keyword` module functions with keyword lists. We can also use functions from the `Enum` module, as keyword lists are an enumerable data type.

```elixir
Enum.count(a: 1, b: 2) # 2

Enum.map [a: 1, b: 2], fn(tuple) ->
  IO.inspect(tuple)
end

# {:a, 1}
# {:b, 2
```

We can also use functions in the `List` module on keyword lists:

```elixir
List.first(a: 1, b: 2)
# {:a, 1}
```
