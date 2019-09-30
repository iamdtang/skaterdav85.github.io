---
layout: assignment
title: Client-side Routing
---

For this assignment, you will build another Reddit API application with React using React Router.

Create a 2 column layout with a left nav bar and a main content area on the right. Display links for the following animals in the left nav bar:

* cats
* chickens
* cows
* dogs
* pigs

When one of these links is clicked, fetch the data from the Reddit API `https://www.reddit.com/r/{animal}.json` (i.e. [https://www.reddit.com/r/pigs.json](https://www.reddit.com/r/pigs.json)) and display the following properties for each post:

* `title` that links to `url` in a new tab
* `score`
* `author`
* One of the image properties (you choose). If none exist, display "No image".

The navigation should still be on the page. The results should be displayed in the main content area. The URL should follow the pattern `/animals/:animal` where `:animal` will be "cats", "chickens", etc. If you refresh the page, the results should be rendered.

Next, make `author` a link to a route with the pattern `/authors/:author`. When an author is clicked, display the same properties listed above from the endpoint `https://www.reddit.com/user/{author}.json` (i.e. [https://www.reddit.com/user/samselikoff.json](https://www.reddit.com/user/samselikoff.json)). This endpoint returns the same data, but for a specific author.

Lastly, if a user types an invalid URL, display the navbar with some helpful text in the main content area letting them know that the URL is invalid.

## Submission

Create a repo on GitHub called __itp404-assignment6-routing__ and upload your files. Also, deploy your app to Surge. Send an email to the TA and me with the title "ITP 404 - Assignment 6" with the GitHub and Surge URLs in the body. Failure to submit by the deadline will result in a 0.
