---
layout: post
title: Installing Node and Ember CLI
date: 2017-10-14
description: Installing Node.js via NVM and Ember CLI
keywords: installing node, node.js, nvm, node version manager, ember CLI, ember, emberjs, ember-cli
---

Node.js is a JavaScript runtime commonly used for command line utilities and server-side applications written in JavaScript.

One way to install Node.js is through the main [https://nodejs.org](https://nodejs.org) site. This has a few drawbacks as sometimes you'll run into permission issues when installing global Node modules like Ember CLI (if you're on a Mac) or switching versions of Node can be a bit of a challenge. A popular alternative is to install Node using Node Version Manager, or NVM for short. NVM makes installing multiple versions of Node on your computer simple.

I don't use Windows myself, but you can install Node via the Windows Installer without any issues (so I've heard) from [https://nodejs.org/en/download](https://nodejs.org/en/download). If you'd like to install NVM, skip to the [NVM on Windows](#nvm-on-windows) section below.

## NVM on Mac

On a Mac, we can install NVM via [https://github.com/creationix/nvm](https://github.com/creationix/nvm). Open up Terminal and run the following:

```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.5/install.sh | bash
```

Then run:

```
# go to the home directory
cd ~

# list all files in the home directory
ls -a
```

Do you have a file called `.bash_profile`? If not, create it by running:

```
touch ~/.bash_profile
```

Lastly, add the following to your `.bash_profile`:

```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
```

If you're experienced with vim, emacs, or nano, go ahead and use that to edit `.bash_profile`. If not, you can open that file with your regular text editor with something like:

```
open -a "Atom" ~/.bash_profile
```

This command will open `.bash_profile` with Atom. Swap "Atom" with your text editor application name.

Restart Terminal and you should be able to type `nvm` in Terminal and see a list of available commands.

Once you have NVM installed, you're ready to install a specific Node version. Let's install version 6.11.4.

```
nvm install 6.11.4
```

If you type `nvm ls`, you can see all the Node versions you've installed. You should see an arrow pointing to your Node version.

![nvm ls screenshot](/images/nvm-ls.png)

An arrow will be pointing to your default Node version. If you don't see an arrow next to a specific version, run:

```
nvm alias default v6.11.4
```

Rerun `nvm ls` and hopefully you see an arrow pointing to a Node version.

## NVM on Windows

On Windows, you can install NVM via [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows). I haven't used it myself since I don't use Windows, but the documentation seems to be fairly straightforward. Install it using the installer and use the `nvm install` command to install 6.11.4.

## Installing Ember CLI

Ember CLI is a command line application for working with Ember.js, a popular JavaScript framework. Ember CLI is packaged as a global Node module. To install it, run the following:

```
npm install -g ember-cli
```

Try typing `ember --version` in Terminal and you should see some versions output to the screen.

Let's generate a new Ember application via Ember CLI. `cd` to where you'd like your application created on your computer, and then run:

```
ember new reddit-clone
```

This will create a folder called `reddit-clone` with a lot of files inside.

Next, let's run the application:

```
cd reddit-clone
ember serve
```

Navigate to [http://localhost:4200](http://localhost:4200) and you should see a welcome page.

![Ember welcome page screenshot](/images/ember-welcome-page.png)

You're all set!

If you came across an error when running `ember serve`, try the following:

1. Delete the `reddit-clone` folder
2. Install Ember CLI version 2.15.1 via `npm install -g ember-cli@2.15.1`
3. `cd reddit-clone; ember serve`

Hopefully everything works! If not, message me and I'll do my best to help!
