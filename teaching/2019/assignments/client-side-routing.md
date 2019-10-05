---
layout: assignment
title: Client-side Routing
---

For this assignment, you will build another Reddit API application with React using React Router.

Create a layout with a navigation and a main content area. Display links for the following animals in the navigation:

* Cats
* Chickens
* Cows
* Dogs
* Pigs

When one of these links is clicked, fetch the data from the Reddit API `https://www.reddit.com/r/{animal}.json` (i.e. [https://www.reddit.com/r/pigs.json](https://www.reddit.com/r/pigs.json)) and display the following properties for each post:

* `title` that links to `url` in a new tab
* `score`
* `author`
* One of the image properties (you choose). If none exist, display "No image".

The navigation should still be on the page. The results should be displayed in the main content area. The URL should follow the pattern `/animals/:animal` where `:animal` will be "cats", "chickens", etc. If you refresh the page, the results should be rendered.

Next, make `author` a link to a route with the pattern `/authors/:author`. When an author is clicked, display the same properties listed above from the endpoint `https://www.reddit.com/user/{author}.json` (i.e. [https://www.reddit.com/user/samselikoff.json](https://www.reddit.com/user/samselikoff.json)). This endpoint returns the same Reddit data but from a specific author.

Lastly, if a user types an invalid URL, display the navigation and some helpful text in the main content area letting them know that the URL is invalid.

## Submission

When you are finished, deploy your project to Surge and include a link to your Surge URL in the README.md of your repo. 

Submit your assignment [here](https://classroom.github.com/a/ggDTdtW-) on our GitHub classroom. Failure to submit by the deadline will result in a 0.
