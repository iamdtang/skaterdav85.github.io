---
layout: post
title: Learning How to Loop in Elixir Through Recursion
date: 2019-01-13
description: In this post, we'll look at how to loop in Elixir through recursion by rebuilding Enum.each, Enum.reduce, Enum.map, and Enum.filter.
image: elixir-thumb.png
image_alt: Elixir programming language logo
card_style: summary
keywords: elixir, loop, recursion, map, filter, reduce, each, foreach, for loop, enum, enumerable, iterate
image: elixir
---

{% include elixir-series-intro.md %}

## Looping in Elixir

Elixir doesn't have looping constructs like a `for` loop or a `while` loop. Instead, looping is achieved through recursion. If you're not familiar with recursion, recursion is when a function keeps calling itself until some condition is met.

Fire up an `iex` session and type in the following:

```elixir
[head | tail] = [1, 2, 3]
head # 1
tail # [2, 3]
```

Here we've pattern matched against the list using the cons operator (the `"|"` character). `head` is the first item in the list and `tail` is a list of all the other items. We could continue and break down `tail` until it is an empty list. For example:

```elixir
[head | tail] = [1, 2, 3]
head # 1
tail # [2, 3]

[head | tail] = tail
head # 2
tail # [3]

[head | tail] = tail
head # 3
tail # []
```

We can write a recursive function that uses the technique above to go through every item in the list and print out each number:

```elixir
defmodule MyEnum do
  def each([head | tail]) do
    IO.puts(head)
    each(tail)
  end

  def each([]), do: nil
end

MyEnum.each([1, 2, 3])
```

In Elixir, functions can have multiple clauses. If a function has multiple clauses, Elixir will try each one from top to bottom in the module until one of them matches.

In the example above, we've defined two clauses for the `each` function. The first function clause will match whenever the first argument is a non-empty list, resulting in it getting called. This function will keep calling itself with `tail`, which contains one less item on each successive call, until the list is empty, at which point the second clause will match and get called and the recursion will terminate.

The built-in `Enum` module has a function called [`each/2`](https://hexdocs.pm/elixir/Enum.html#each/2) that makes the above more generic and reusable. [`Enum.each/2`](https://hexdocs.pm/elixir/Enum.html#each/2) goes through every item in a list using recursion behind the scenes and invokes an anonymous function with each item as its argument. This is similar to `Array.prototype.forEach` in JavaScript. Here is an example:

```elixir
Enum.each [1, 2, 3], fn(x) ->
  IO.puts(x)
end

# 1
# 2
# 3
```

Let's write our own implementation of this to learn more about looping through recursion in Elixir.

## Rebuilding `Enum.each/2`

```elixir
defmodule MyEnum do
  def each([head | tail], func) do
    func.(head)
    each(tail, func)
  end

  def each([], _func), do: nil
end

MyEnum.each [1, 2, 3], fn(x) ->
  IO.puts(x)
end
```

Our implementation is very similar to our previous example. The only difference is that we've replaced `IO.puts(head)` with `func.(head)` to make it more generic and reusable.

Pretty neat, huh? Now let's write our own implementation of [`Enum.reduce/3`](https://hexdocs.pm/elixir/Enum.html#reduce/3)!

## Rebuilding `Enum.reduce/3`

If you aren't familiar with reduce, it is a way to reduce a list to a single value. Summing an array of numbers is one example. In Elixir, we can use [`Enum.reduce/3`](https://hexdocs.pm/elixir/Enum.html#reduce/3). For example:

```elixir
sum = Enum.reduce [1, 2, 3], 0, fn(x, total) ->
  x + total
end

sum # 6
```

This works similar to `Array.prototype.reduce` in JavaScript if you've seen it there. Here is what the implementation might look like:

```elixir
defmodule MyEnum do
  def reduce([head | tail], total, func) do
    new_total = func.(head, total)
    reduce(tail, new_total, func)
  end

  def reduce([], total, _func), do: total
end

sum = MyEnum.reduce [1, 2, 3], 0, fn(x, total) ->
  x + total
end
```

This example is pretty similar to the `each` implementation that we did previously. Here, we invoke `func` with each item and the accumulating total, which starts off at 0. This returns `new_total`, which is passed into each recursive call. When `reduce` is eventually called with an empty list, the second clause of `reduce` will match, at which point the recursion still stop and `total` will be returned.

Let's move on and write our own implementation of [`Enum.map/2`](https://hexdocs.pm/elixir/Enum.html#map/2).

## Rebuilding `Enum.map/2`

If you haven't used a map function before, it is used to map one list to another list. For example, we can double a list of numbers by calling [`Enum.map/2`](https://hexdocs.pm/elixir/Enum.html#map/2):

```elixir
doubled_numbers = Enum.map [1, 2, 3], fn(x) ->
  x * 2
end

doubled_numbers # [2, 4, 6]
```

As we've learned, we can use the cons operator to destructure a list into two parts, the head, which is the first item, and the tail, which is another list of all remaining items.

```elixir
[head | tail] = [1, 2, 3]
head # 1
tail # [2, 3]
```

We can also use the cons operator to reconstruct a new list from a single value and another list:

```elixir
[1 | [2, 3]] # [1, 2, 3]
[1 | [2 | [3, 4]]] # [1, 2, 3, 4]
[1 | []] # [1]
[1 | [2, 3]] == [1, 2, 3] # true
```

With this in mind, we can rebuild `Enum.map/2`:

```elixir
defmodule MyEnum do
  def map([head | tail], func) do
    [func.(head) | map(tail, func)]
  end

  def map([], _func), do: []
end

MyEnum.map [1, 2, 3], fn(x) ->
  x * 2
end
```

In this example, we are taking the list `[1, 2, 3]` and mapping it to `[2 | [4 | [6 | []]]]`, which is the same as `[2, 4, 6]`.

Let's move on to our last Enum function and rebuild [`Enum.filter/2`](https://hexdocs.pm/elixir/Enum.html#filter/2).

## Rebuilding `Enum.filter/2`

The filter function is used to take one list and filter it down by some condition which is represented as a function. The function is called for every item in the list. If the function returns a truthy value, that item is kept in the list. If the function returns a falsy value, that item doesn't make it into the new list. Here is an example using the built-in [`Enum.filter/2`](https://hexdocs.pm/elixir/Enum.html#filter/2):

```elixir
filtered_items = Enum.filter [1, 2, 3, 4, 5], fn(x) ->
  x >= 3
end

filtered_items # [3, 4, 5]
```

Here is our own implementation:

```elixir
defmodule MyEnum do
  def filter([head | tail], func) do
    result = func.(head)

    if result do
      [head | filter(tail, func)]
    else
      filter(tail, func)
    end
  end

  def filter([], _func), do: []
end

MyEnum.filter [1, 2, 3, 4, 5], fn(x) ->
  x >= 3
end
```

The implementation is similar to our map function, but with an extra `if` statement. If `result` is truthy, we use the cons operator to include it in the list and call `filter` again with the tail. If `result` is falsy, we just call filter again and disregard `head`. We keep doing this until the list is empty, at which point the second `filter` clause will get executed and end the recursion.

## Conclusion

I found reimplementing [`Enum.each/2`](https://hexdocs.pm/elixir/Enum.html#each/2), [`Enum.reduce/3`](https://hexdocs.pm/elixir/Enum.html#reduce/3), [`Enum.map/2`](https://hexdocs.pm/elixir/Enum.html#map/2), and [`Enum.filter/2`](https://hexdocs.pm/elixir/Enum.html#filter/2) a great exercise to learn how to loop in Elixir through recursion. I'm sure these functions in the `Enum` module do more than our implementations, so you should still use those, but nevertheless it is a fun exercise to learn Elixir.
