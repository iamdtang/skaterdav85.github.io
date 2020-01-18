---
layout: post
title: Reading a File in Elixir on Heroku
date: 2019-02-01
last_modified_at: 2019-02-03
description: This post covers a problem I ran into when reading files on Heroku in an Elixir Phoenix app.
twitter_image: elixir-thumb.png
twitter_image_alt: Elixir programming language logo
card_style: summary
keywords: Elixir, read, file, Heroku, Phoenix, File.read
image: elixir
---

{% include elixir-series-intro.md %}

Recently I created a small API in Elixir/Phoenix and deployed it to Heroku using the free plan. The API read an HTML file stored in a `data` folder located in the project root.

In one of my controllers, I had the following:

```elixir
def index(conn, %{"course" => course, "year" => year}) do
  Path.expand("./../../../data/#{year}", __DIR__)
  |> Path.join("#{course}.html")
  |> log
  |> File.read
  |> handle_file(conn, course, year)
end
```

Locally, the path that was logged was `/Users/david/Sites/students/data/2019/itp405.html`. Everything worked.

Once I pushed it up to Heroku, I noticed that the file couldn't be read. After inspecting the logs on Heroku (using `heroku logs --app davids-api`), I found that the path that was generated from `Path.expand` was `/tmp/build_b2f02984e1fe996483c2e4e14d6e337d/data/2019/itp405.html`. For whatever reason, that path wasn't working and resulted in a "file not found" error.

Eventually I discovered that the file could be read using the path `/app/data/2019/itp405.html`. My final solution turned out to be:

```elixir
def index(conn, %{"course" => course, "year" => year}) do
  get_path(course, year)
  |> log
  |> File.read
  |> handle_file(conn, course, year)
end

defp get_path(course, year) do
  if System.get_env("HEROKU_EXEC_URL") do
    "/app/data/#{year}/#{course}.html"
  else
    Path.expand("./../../../data/#{year}", __DIR__)
    |> Path.join("#{course}.html")
  end
end
```

It turns out there is an environment variable named `HEROKU_EXEC_URL` when running on Heroku. I ended up using that to conditionally determine the file path. This isn't an ideal solution, but it got my app working. If you know of a better way, please let me know in the comments!

## UPDATE (2/3/2019)

It turns out, there is a better way to do this, as David made me aware of in the comments section. Instead of putting the `data` folder in the root of my project, I moved it into the `priv` directory. Then, I used [`code:priv_dir` from Erlang](http://erlang.org/doc/man/code.html#priv_dir-1) to get the path to the `priv` directory:

```elixir
defp get_path(course, year) do
  "#{:code.priv_dir(:students)}/data/#{year}/"
  |> Path.join("#{course}.html")
end
```

This function takes the application name, which you can find in the `project` function in `mix.exs`.

No more conditional logic based on a Heroku environment variable!
