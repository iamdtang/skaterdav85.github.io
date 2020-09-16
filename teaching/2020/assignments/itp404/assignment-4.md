---
layout: assignment
title: Assignment 4
---

For this assignment, you will rebuild Assignment 3 with a few modifications. Please create a brand new React project and copy over any code that you used in Assignment 3.

## Search Form

Add a search form at the top of the page. The search form should contain a text input and a submit button. The search input is for users to type in a subreddit. When the form is submitted, the app will fetch the data for the subreddit that was typed in and render it on the page.

Use the [`encodeURIComponent` function](https://www.w3schools.com/JSREF/jsref_encodeuricomponent.asp) to encode the value that you type into the text input before using it in the URL of the Reddit API call. This will ensure that spaces are encoded properly. For example:

```js
const encodedSubreddit = encodeURIComponent('cute cats');
console.log(encodedSubreddit); // cute%20cats
```

Notice how the space was encoded to `%20`.

The app should display a loading indicator while the page is loading. Make it so that while a search is processing, the search bar remains rendered on the page and the loading indicator is beneath it.

## Previous Search History

Add a feature that keeps track of all previous searches and display them in a right sidebar. Make it such that a user can click on one of the previous searches and the app fetches and renders the data for that search term.

Tip: When looping through the previous searches to render them, each one will need to "remember" the current item in the `map()` call in order to use it to perform the search again. Your code might look something like this:

```jsx
{
  previousSearches.map((term) => {
    return (
      <button
        type="button"
        className="btn btn-link"
        key={term}
        onClick={() => {
          applyPreviousSearch(term)
        }
      >
        {term}
      </button>
    );
  });
}
```

There are other ways to achieve this, so your code doesn't have to follow this approach.

## Deploy to Netlify or Surge

- Deploy your project to [Netlify](https://www.netlify.com/) or Surge. Here are instructions for [Deploying React Projects to Surge.sh](/2019/10/17/deploying-react-to-surge.html).
- Add the deployed URL to your `README.md` using a Markdown link. See this [Markdown guide](https://www.markdownguide.org/cheat-sheet/) to learn how to create a link in Markdown.

## Submission

[https://classroom.github.com/a/J-z2uf7W](https://classroom.github.com/a/J-z2uf7W)
