---
layout: post
title: Capturing Functions and Expressions in Elixir
date: 2019-01-10
description: In this post, we're going to look at capturing functions and expressions, which can make Elixir code more concise.
image: elixir-thumb.png
image_alt: Elixir programming language logo
card_style: summary
keywords: elixir, capturing, capture operator, capture function, capture expression
image: elixir
---

{% include elixir-series-intro.md %}

In this post, we're going to look at capturing functions and expressions, which can make Elixir code more concise.

## Capturing Functions

In Elixir, we can use `Enum.each/2` to loop over an enumerable data type, like a list. If you haven't seen the `"/2"` notation before, that just denotes the function's arity (number of arguments) since you can define multiple functions with the same name with different arities. With `Enum.each/2`, the first argument is the enumerable and the second argument is an anonymous function. For example:

```elixir
Enum.each([1, 2, 3, 4, 5], fn(x) -> IO.puts(x) end)
```

We can also bind the anonymous function to a variable first:

```elixir
print_value = fn(x) -> IO.puts(x) end
Enum.each([1, 2, 3, 4, 5], print_value)
```

This can be a little verbose, especially if we are creating an anonymous function just to call another function, like `IO.puts`. Why not pass in `IO.puts` directly? `Enum.each/2` expects an anonymous function, and `IO.puts/1` is not an anonymous function. It is a named function. However, we can use `"&"`, known as the capture operator, to deal with this:

```elixir
Enum.each([1, 2, 3, 4, 5], &IO.puts/1)
```

Here we captured `IO.puts/1` by prefixing it with `&`. This essentially wrapped `IO.puts(x)` within an anonymous function, like so:

```elixir
fn(x) -> IO.puts(x) end
```

Much more terse!

Another way we could have written this is as follows:

```elixir
Enum.each([1, 2, 3, 4, 5], &IO.puts(&1))
```

The `&1` references the first parameter of the anonymous function that is created when `IO.puts/1` is captured. `&2`, `&3`, and so on would reference subsequent parameters.

`IO.puts(1)` is shorthand for `IO.puts(:stdio, 1)`. The above could also be written as such:

```elixir
Enum.each([1, 2, 3, 4, 5], &IO.puts(:stdio, &1))
```

You can also write to standard error with:

```elixir
Enum.each([1, 2, 3, 4, 5], &IO.puts(:stderr, &1))
```

## Capturing Expressions

In addition to capturing functions, we can capture expressions with the `&(expression)` syntax.

To map a list of numbers to another list where each number is doubled, we can do the following:

```elixir
Enum.map([1, 2, 3, 4, 5], &(&1 * 2))
```

To filter a list of numbers to those greater than 3, we can do:

```elixir
Enum.filter([5, 2, 6], &(&1 > 3))
```

To sum an array of numbers, we can use `Enum.reduce/3`. If you aren't familiar with reduce, it is a way to reduce a list to a single value. Summing an array of numbers is one example.

Using an anonymous function in the long form, it looks like the following:

```elixir
Enum.reduce([1, 2, 3, 4, 5], 0, fn(x, total) -> x + total end)
```

We can modify this to use a captured expression:

```elixir
Enum.reduce([1, 2, 3, 4, 5], 0, &(&1 + &2))
```

Here, `&1` represents each number in the list and `&2` represents the accumulating total.
