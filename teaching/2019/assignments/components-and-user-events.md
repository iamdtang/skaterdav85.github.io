---
layout: assignment
title: Components and User Events
---

For this assignment, you will modify Assignment 3 so that it is more interactive. Please use the same repository but create a branch named _assignment4_. You can create a new branch with `git checkout -b assignment4`.

## Search Bar

Add a search bar at the top of the page. The search bar should contain a text input and a submit button. The search bar is for users to type in a subreddit topic. When the search form is submitted, the app will fetch the data and render it on the page. The app should display a loading indicator while the page is loading. Make it so that while a search is processing, the search bar remains rendered on the page and the loading indicator is beneath it.

## Previous Search History

Add a feature that keeps track of all previous searches and display them somewhere on the page. Make it such that a user can click on one of the previous searches and the app fetches and renders the data for that search term.

Tip: When looping through the previous searches to render them, you're going to need to bind a class method to `onClick` and have it "remember" the current item in the `map()` call. See the [`bind()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) function. Your code might look something like this:

```jsx
{this.state.previousSearches.map((term) => {
  return (
    <button type="button" onClick={this.applyPreviousSearch.bind(this, term)}>
      {term}
    </button>
  );
})}
```

There are other ways to do achieve this, so your code doesn't have to follow this approach.

## Read Count

Add a feature that tracks every time a post is clicked regardless if it is the same post. This total can be rendered anywhere on the page and should start at 0. This number will reset back to 0 when the page reloads.

## Submission

Push the code to the same repo as Assignment 3 using `git push origin assignment4`. Also, deploy your updated app to Surge. Send an email to the TA and me with the title "ITP 404 - Assignment 4" with the GitHub and Surge URLs in the body. Failure to submit by the deadline will result in a 0.
