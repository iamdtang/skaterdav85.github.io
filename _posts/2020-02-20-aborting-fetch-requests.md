---
layout: post
title: Aborting Fetch Requests with AbortController
date: 2020-02-20
description: Learn how to abort fetch requests with the AbortController class and how to do it in a React component.
keywords: fetch, AbortController, cancel request, abort request, react
image: javascript
---

We can abort `fetch` requests using the [`AbortController` class](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) built into the browser. Note, `AbortController` is experimental, but [browser support is pretty good](https://caniuse.com/#search=AbortController).

<iframe
  src="https://codesandbox.io/embed/abort-fetch-requests-uv1q7?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Findex.js&theme=dark&view=editor"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="abort-fetch-requests"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

So where might we use this? Let's say we have a React component that fetches and renders some data. The page loads, the `fetch` request is made, we get impatient and click to another route which dismounts the component. If we set state when the `fetch` request resolves on an unmounted component, we will get the following error:

> Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.

You can simulate this in the following example. The button will toggle the rendering of the `ReposCount` component when it is clicked. If you click the button to unmount the component before the API call finishes, you will see the "Can't perform a React state update on an unmounted component" warning in the console.

<iframe
  src="https://codesandbox.io/embed/aborting-fetch-requests-in-react-1-899u8?fontsize=14&hidenavigation=1&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="aborting-fetch-requests-in-react-1"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

To fix this so that errors aren't thrown for impatient users, let's update the component to use `AbortController`:

<iframe
  src="https://codesandbox.io/embed/aborting-fetch-requests-in-react-2-q4l6b?fontsize=14&hidenavigation=1&module=%2Fsrc%2FReposCount.js&theme=dark"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="aborting-fetch-requests-in-react-2"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

One thing to note is that when we call `controller.abort()`, the `fetch` promise rejects with an `AbortError`. In the example above, we are catching the error and logging "aborted".
