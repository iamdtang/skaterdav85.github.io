---
layout: assignment
title: Installing Node
---

We can install Node.js a few different ways. One approach is to install Node.js from the [Node.js site](https://nodejs.org/en/) with a GUI installer. This approach should suffice for this class. The only issue you may run into (Mac users in particular) is when you install Node.js modules globally. For example, if you run `npm i -g create-react-app`, you may get an error saying something along the lines of not having sufficient privileges. In order to get around this, you can prefix that command with `sudo` (i.e. `sudo npm i -g create-react-app`). Another issue with installing Node.js like this is if you have multiple projects that use different Node.js versions. However, this won't be an issue for everything we write in this class.

A more popular approach to installing Node.js is through [Node Version Manager (NVM) for Mac](https://github.com/nvm-sh/nvm) or [Node.js version manager for Windows](https://github.com/coreybutler/nvm-windows). Unfortunately I don't have a Windows machine nor have I used NVM on Windows before. I did however see [lots of tutorials on YouTube](https://www.youtube.com/results?search_query=install+NVM+windows). If you're on a Mac, follow these instructions:

1. Follow the instructions under "Install & Update Script": https://github.com/nvm-sh/nvm#install--update-script.
1. Restart Terminal
1. Type `nvm` and press Enter. You should see a list of options.
1. To install version 14.5.0 of Node.js, run `nvm install v14.5.0`. Replace "v14.5.0" with any recent version. Anything above version 12.x.x should suffice for this course. Once that finishes, run `nvm ls` to list out all the versions of Node.js that you have installed. If you would like to set a specific version of Node.js as the default, run `nvm alias default <version>` (i.e. `nvm alias default v14.5.0`).

To verify you have Node.js installed, open up your command line and run `node -v`. You should see the version of Node.js that you installed.
