---
layout: assignment
title: WebSockets
---

For this assignment, you will create a very basic version of Google Docs in your Laravel app.

Start by creating a public route `/docs` in your Laravel project. On this page, display a simple editor using an editable `div` through the [`contenteditable` attribute](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content). Make this "editor" take up a majority of the page.

Users will be able to type content into this `div`. As a user types, send the content through a WebSocket connection so that all connected clients receive it and see the most up to date document.

## Where do I put my frontend JavaScript in my Laravel app?

Place your frontend JavaScript in the `public` directory. Let's say I have `public/js/client.js`, then in my Blade view, I can link to it like so:

```html
<script src="/js/client.js"></script>
```

## My cursor is jumping. Why?

If you want to stop the cursor from resetting to the beginning of the text area every time you type something, check the incoming messages and only update the contents of the text area if it’s different from what’s already in the text area. Otherwise, each time you type, the page will send out the new contents to the web socket, receive that same message back, and replace the text area contents with the same thing that’s already there, knocking the cursor back to the beginning.

## Optional

In the upper left hand corner, add an input that represents the document title, similar to Google Docs.

Feel free to enhance this however you wish.

## Deployment

* Change `new WebSocket.Server({ port: 8080 })` to `new WebSocket.Server({ port: process.env.PORT || 8080 })`
* Change `new WebSocket('ws://localhost:8080')` to use your Heroku URL with `wss://` instead of `ws://` i.e. `new WebSocket('wss://dtang-websocket-demo.herokuapp.com')`.

## Submission

Submit your web socket server repo to [https://classroom.github.com/a/O2g5Hf2f](https://classroom.github.com/a/O2g5Hf2f). Create a README.md file and add a link to the `/docs` route of your Laravel app.

