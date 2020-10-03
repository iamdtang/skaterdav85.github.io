---
layout: assignment
title: Assignment 5
---

For this assignment, you will build another Reddit API application with React using React Router.

Create a layout with a header, navigation, and a main content area. The header and navigation should always be rendered on the page.

## The Animals Route

Display links for the following animals in the navigation:

- Cats
- Chickens
- Cows
- Dogs
- Pigs

The URL should follow the pattern `/animals/:animal` where `:animal` will be "cats" / "kittens", "chickens", "cows", "dogs" / "puppies", or "pigs".

When one of these links is clicked, fetch the data from the Reddit API `https://www.reddit.com/r/{animal}.json` (i.e. [https://www.reddit.com/r/pigs.json](https://www.reddit.com/r/pigs.json)).

Filter down the results to include only the posts that contain a `thumbnail` image. Display the following properties for each post:

- `title` that links to `url` in a new tab
- `author`
- `thumbnail` as an image

The results should be displayed in the main content area. If you refresh the page, the results should be rendered.

**If any of the animals above don't have any thumnail images, feel free to swap with a different animal.**

## The Author Route

Next, make `author` a link to a route with the pattern `/authors/:author`. When an author link is clicked, display the same properties listed above from the endpoint `https://www.reddit.com/user/{author}.json` (i.e. [https://www.reddit.com/user/samselikoff.json](https://www.reddit.com/user/samselikoff.json)). This endpoint returns a list of posts from a specific author.

## A Default Route

If a user visits `/`, redirect them to `/animals/cats`, which will serve as the default route.

## Active Link Styling

Apply a unique style to the active link in the navigation. For example, if a user is on `/animals/cats`, the Cats link has a unique style to show that it is active. See [React Router's `NavLink` component](https://reactrouter.com/web/api/NavLink).

## A 404 Route

Lastly, if a user types an invalid URL, display some helpful text in the main content area letting them know that the URL is invalid. Check out the [React Router - No Match (404) docs](https://reactrouter.com/web/example/no-match).

## Deploy to Netlify or Surge

Deploy your project to [Netlify](https://www.netlify.com/) or Surge. Here are instructions for [Deploying React Projects to Surge.sh](/2019/10/17/deploying-react-to-surge.html). If you deploy to Netlify, be sure to include a `netlify.toml` in the root of your repository with the following contents:

```
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Submission

[https://classroom.github.com/a/JPnGFO2s](https://classroom.github.com/a/JPnGFO2s)
