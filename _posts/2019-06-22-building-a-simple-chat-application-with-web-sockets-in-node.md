---
layout: post
title: Building a Simple Chat Application with Web Sockets in Node.js
date: 2019-06-22
description: This post covers how to build a simple chat application with Web Sockets in Node.js.
keywords: Web Sockets, ws://, wss://, Node.js, chat application, web socket server
image: javascript
twitter_image: javascript.png
twitter_image_alt: JavaScript logo
card_style: summary
---

This post is a written version of a lecture I gave for one of my classes at USC. You can find the recording here: [https://youtu.be/dQTzL3enFng](https://youtu.be/dQTzL3enFng).

In this post, we are going to build a small chat application using Web Sockets in Node.js.

## The Frontend

Let's start off with our HTML page:

```html
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8">
  <title>Web Socket Demo</title>
</head>
<body>

<ul id="chat"></ul>

<form>
  <textarea rows="8" cols="80" id="message"></textarea>
  <br>
  <button type="submit">Send</button>
</form>

<script src="main.js"></script>

</body>
</html>
```

Every time a user submits the message in the form, it will get sent through a web socket connection to all connected clients. All of the chat messages will get appended to `ul#chat`.

Next, let's write our client-side JavaScript in `main.js`.

```js
const connection = new WebSocket('ws://localhost:8080');

connection.onopen = () => {
  console.log('connected');
};

connection.onclose = () => {
  console.error('disconnected');
};

connection.onerror = (error) => {
  console.error('failed to connect', error);
};

connection.onmessage = (event) => {
  console.log('received', event.data);
  let li = document.createElement('li');
  li.innerText = event.data;
  document.querySelector('#chat').append(li);
};

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  let message = document.querySelector('#message').value;
  connection.send(message);
  document.querySelector('#message').value = '';
});
```

The first thing that happens in this script is establishing a connection to the web socket server (which we haven't implemented yet). The web socket protocol starts with `ws://` or `wss://` (encrypted with SSL, similar to `https://`).

There are several different event handlers on the [`WebSocket` class](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) including `onopen`, `onclose`, `onerror`, and `onmessage`.

The one that we will be concerned with primarily is `onmessage`. This event handler will get called whenever a new message is received from the server. Here, we'll simply create a list item with the message and append it to `#chat`.

The last piece of our script is to submit the message through the web socket connection when a user submits the form. Here, we have added an event listener to the form's submit event. The `event.preventDefault()` is used to prevent the page from refreshing. After that, we grab the message from the textarea, send it to the web socket server, and clear out the textarea so that the user can type another message.

That's it for the client-side JavaScript! Let's now create the web socket server.

## The Backend

First, create a `package.json` file and install [ws](https://www.npmjs.com/package/ws):

```json
{
  "dependencies": {
    "ws": "^7.0.1"
  }
}
```

Next, create a file called `server.js` with the following contents:

```js
const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ port: 8080 });

webSocketServer.on('connection', (webSocket) => {
  webSocket.on('message', (message) => {
    console.log('Received:', message);
    broadcast(message);
  });
});

function broadcast(data) {
  webSocketServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}
```

Here, we created a new `WebSocket.Server` instance on port 8080. Next, we added an event listener for the `connection` event which will occur when a client connects to the web socket server. Once a connection is established, an event listener is added for the `message` event on the web socket connection, which will occur when a client sends a message. At that point, we'll broadcast the message to all of the clients who are connected to the web socket server.

## Running the App

Run the backend in terminal with the command `node server.js`.

Next, open up two tabs with `index.html` with the Chrome Console open.

You should see the chat application working!
