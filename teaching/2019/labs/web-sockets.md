---
layout: assignment
title: Web Sockets
---

For this lab, you will create a very basic version of Google Docs in your Laravel app.

Start by creating a public route `/docs` in your Laravel project. On this page, display a simple editor using an editable div through the [`contenteditable` attribute](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Editable_content).

Users will be able to type content into this div. Every time a user pauses typing for 500 milliseconds, send the content through the web socket connection so that all connected clients receive it and see the most up to date document.

## Submission

* Deploy your web socket server to Heroku.
* Deploy your Laravel app to Heroku.
* Send an email to me and the TA with the GitHub URL to the Laravel repo, the GitHub URL to the Node.js repo, and the Heroku URL to the `/docs` page. Please use the subject line __ITP 405 Lab Submission - Node 3: Web Sockets__.
