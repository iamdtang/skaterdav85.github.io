---
layout: post
title: Converting JSON into Elixir Structs
date: 2019-01-21
description: This post covers a few things I learned when converting JSON into Elixir structs.
image: elixir-thumb.png
image_alt: Elixir programming language logo
card_style: summary
keywords: elixir, convert, map, struct, JSON, poison, decode, decoding
image: elixir
---

{% include elixir-series-intro.md %}

I've been going through the [Pragmatic Studio Elixir course](https://pragmaticstudio.com/courses/elixir), and this post is based on one of the exercises. I highly recommend this course!

Let's say we have the following JSON string:

```elixir
json = ~s([
  {
    "id": 1,
    "name": "Teddy",
    "type": "Brown",
    "hibernating": true
  },
  {
    "id": 2,
    "name": "Smokey",
    "type": "Black"
  },
  {
    "id": 3,
    "name": "Paddington",
    "type": "Brown"
  }
])
```

Note, [`~s`](https://hexdocs.pm/elixir/Kernel.html#sigil_s/2) is a sigil and it allows us to easily create a string of JSON without having to escape all of the quotes.

We can parse this JSON into a list of maps using the Poison library:

```elixir
bears = Poison.decode!(json)
# [
#   %{"hibernating" => true, "id" => 1, "name" => "Teddy", "type" => "Brown"},
#   %{"id" => 2, "name" => "Smokey", "type" => "Black"},
#   %{"id" => 3, "name" => "Paddington", "type" => "Brown"}
# ]
```

What if we wanted this to be a list of `Bear` structs instead?

The `Bear` struct used in the course is similar to the following:

```elixir
defmodule Bear do
  defstruct id: nil, name: "", type: "", hibernating: false
end
```

To convert each map to a `Bear` struct, we can map over the list:

```elixir
Enum.map bears, fn(bear) ->
  %Bear{
    id: bear["id"],
    name: bear["name"],
    type: bear["type"],
    hibernating: (if bear["hibernating"], do: true, else: false)
  }
end
# [
#   %Bear{hibernating: true, id: 1, name: "Teddy", type: "Brown"},
#   %Bear{hibernating: false, id: 2, name: "Smokey", type: "Black"},
#   %Bear{hibernating: false, id: 3, name: "Paddington", type: "Brown"}
# ]
```

This works, but setting each key-value pair is pretty tedious. After some googling, I found the [`Kernel.struct/2` function](https://hexdocs.pm/elixir/Kernel.html#struct/2), which allows us to create a struct from a map.

So I tried this:

```elixir
Enum.map bears, fn(bear) ->
  struct(Bear, bear)
end
# [
#   %Bear{hibernating: false, id: nil, name: "", type: ""},
#   %Bear{hibernating: false, id: nil, name: "", type: ""},
#   %Bear{hibernating: false, id: nil, name: "", type: ""}
# ]
```

Hmmm, not what I was expecting. All of the values are set to the struct's default values.

After reading about [`Kernel.struct/2`](https://hexdocs.pm/elixir/Kernel.html#struct/2) a bit more, it turns out that string keys are ignored. The keys of the map must be atoms. To convert the keys from strings to atoms, we can use [`Map.new/2`](https://hexdocs.pm/elixir/Map.html#new/2). This function allows us to create a new map from an existing map.

```elixir
Enum.map bears, fn(bear) ->
  bear = Map.new bear, fn({key, value}) ->
    {String.to_atom(key), value}
  end

  struct(Bear, bear)
end
# [
#   %Bear{hibernating: true, id: 1, name: "Teddy", type: "Brown"},
#   %Bear{hibernating: false, id: 2, name: "Smokey", type: "Black"},
#   %Bear{hibernating: false, id: 3, name: "Paddington", type: "Brown"}
# ]
```

Great, it works!

Now it turns out, there is an even easier way to do this using the Poison library.

```elixir
Poison.decode!(json, as: [%Bear{}])
```

Unfortunately, I couldn't find the documentation for this in the [Poison.decode!/2 v3.1.0 docs](https://hexdocs.pm/poison/3.1.0/Poison.html#decode!/2), but thankfully I learned about it in the Pragmatic Studio Elixir course!
