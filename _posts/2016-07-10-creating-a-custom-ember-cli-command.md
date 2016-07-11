---
layout: post
title: Creating a Custom Ember CLI Command
date: 2016-07-10
description: Ever wondered how to create your own custom Ember CLI command? Trying to figure out how to create a custom command took some research and looking at other addons like ember-cli-deploy, so I thought I'd share what I learned in case you want to create your own custom command.
keywords: ember cli, custom command, emberjs, ember.js, cli
---

Ever wondered how to create your own custom Ember CLI command? Recently I created a custom Ember CLI command as an addon called [ember-share](https://github.com/skaterdav85/ember-share) that allows you to share your local running Ember app with the world via a publicly accessible URL. Trying to figure out how to create a custom command took some research and looking at other addons like ember-cli-deploy, so I thought I'd share what I learned in case you want to create your own custom command.

To start, create an addon. I'll call this addon "hello":

```
ember addon hello
```

Next, we'll do the necessary npm linking so that we can develop and test our addon without having to publish it. If you haven't created an addon before, read more npm linking [on the Ember CLI website](https://ember-cli.com/extending/#link-to-addon-while-developing).

Run `npm link` from the addon's root. Now go to your Ember app, and run `npm link hello`. We're all set.

## The index.js File

When you create an addon, it will come with an _index.js_ file in the addon's root that looks like this:

```js
/* jshint node: true */
'use strict';

module.exports = {
  name: 'hello'
};
```

Change the contents of this file to the following to create the custom `hello` command:

```js
/* jshint node: true */
'use strict';

module.exports = {
  name: 'hello',
  includedCommands: function() {
    return {
      hello: {
        name: 'hello',
        description: 'A test command that says hello',
        run: function(commandOptions, rawArgs) {
          console.log('hello!');
        }
      }
    }
  }
};
```

We've added a function `includedCommands()` that returns an object for one or more commands. Here we have a single command `hello` with a `description` and a `run` function. If we run `ember hello`, the `run()` function will execute and we'll see "hello!" logged in our terminal. We can also run `ember help hello` and we'll see the description logged to the terminal. If our addon needs a few commands, we can simply add another key to the returned object. For example, the code below will give us `ember hello` and `ember world`:

```js
/* jshint node: true */
'use strict';

module.exports = {
  name: 'hello',
  includedCommands: function() {
    return {
      hello: {
        name: 'hello',
        description: 'A test command that says hello',
        run: function(commandOptions, rawArgs) {
          console.log('hello!');
        }
      },
      world: {
        name: 'world',
        description: 'A test command that says world',
        run: function(commandOptions, rawArgs) {
          console.log('world!');
        }
      }
    }
  }
};
```

Note that the value under `name` corresponds to the command, not the root keys in the object returned from `includedCommands()`. We could have named those keys anything we wanted. For example, in the code below, the keys have been renamed to `helloCommand` and `worldCommand`:

```js
/* jshint node: true */
'use strict';

module.exports = {
  name: 'hello',
  includedCommands: function() {
    return {
      helloCommand: {
        name: 'hello',
        description: 'A test command that says hello',
        run: function(commandOptions, rawArgs) {
          console.log('hello!');
        }
      },
      worldCommand: {
        name: 'world',
        description: 'A test command that says world',
        run: function(commandOptions, rawArgs) {
          console.log('world!');
        }
      }
    }
  }
};
```

## Command Options and Arguments

You probably noticed the two arguments passed to the `run()` function: `commandOptions` and `rawArgs`. Let's start with `rawArgs`. `rawArgs` is an array of the arguments when the command is invoked. For example, if I ran:

```
ember hello 1 2 3
```

`rawArgs` would equal `['1', '2', '3']`.

`commandOptions` allows you to pass options with names to your command, like `port` if you were to run `ember serve --port 8000`. Let's add a `format` option so that "hello" can be formatted when it is logged to the terminal. The command will get executed like this:

```
ember hello --format uppercase
```

If we run that, we'll see the following warning:

> The option '--format' is not registered with the hello command. Run `ember hello --help` for a list of supported options.

To register the `--format` option, we need to add the property `availableOptions`:

```js
/* jshint node: true */
'use strict';

module.exports = {
  name: 'hello',
  includedCommands: function() {
    return {
      helloCommand: {
        name: 'hello',
        description: 'A test command that says hello',
        availableOptions: [
          { name: 'format', type: String, default: 'lowercase', aliases: ['f'] }
        ],
        run: function(commandOptions, rawArgs) {
          if (commandOptions.format === 'uppercase') {
            console.log('HELLO!');
          } else {
            console.log('hello!');
          }
        }
      }
    }
  }
};
```

`availableOptions` is an array that specifies the available options. Each option has a name, type, default value, and any number of aliases. We have given the `format` option a default value of 'lowercase' and the alias `f` so that it can be run like this:

```
ember hello -f uppercase
```

If you run `ember help hello`, you will see the command's description along with all the available options.

## Extending Built-In Commands

Custom commands can also extend from built-in commands like the commonly used `serve` and `test` commands. To have our hello command log the hello text and run `ember serve`, modify `index.js` to the following:

```js
/* jshint node: true */
'use strict';

var ServeCommand = require('ember-cli/lib/commands/serve');

module.exports = {
  name: 'hello',
  includedCommands: function() {
    return {
      helloCommand: ServeCommand.extend({
        name: 'hello',
        description: 'A test command that says hello',
        availableOptions: ServeCommand.prototype.availableOptions.concat([
          { name: 'format', type: String, default: 'lowercase', aliases: ['f'] }
        ]),
        run: function(commandOptions, rawArgs) {
          if (commandOptions.format === 'uppercase') {
            console.log('HELLO!');
          } else {
            console.log('hello!');
          }

          return this._super.run.apply(this, arguments);
        }
      })
    }
  }
};
```

There are a few things to notice here. First, we're importing the serve command as `ServeCommand` from Ember CLI. Next, `helloCommand` is assigned an object that extends from the serve command by calling `ServeCommand.extend()`. For `availableOptions`, we are concatenating our custom options with the default options that the serve command provides. If we didn't do this, our `availableOptions` would overwrite the options in the serve command and we'd get errors. Lastly, inside the `run()` function, we are calling `this._super.run.apply(this, arguments)` after our custom code to trigger the original serve command behavior.

If you wanted to extend other commands like `ember test`, import the test command like this:

```js
var TestCommand = require('ember-cli/lib/commands/test');
```

Check out all the other commands you can extend from [here](https://github.com/ember-cli/ember-cli/tree/master/lib/commands).

## Handling Asynchronous Operations

If you need your command to perform asynchronous operations, the `run()` function can return a promise. For example, you could do something like this in your `run()` function:

```js
/* jshint node: true */
'use strict';

var ServeCommand = require('ember-cli/lib/commands/serve');

module.exports = {
  name: 'hello',
  includedCommands: function() {
    return {
      helloCommand: ServeCommand.extend({
        // ...
        run: function(commandOptions, rawArgs) {
          // ...
          var myPromise = somethingAsync();
          var servePromise = this._super.run.apply(this, arguments);
          return Promise.all([ myPromise, servePromise ]);
        }
      })
    }
  }
};
```

What Ember CLI custom command are you thinking of making? Let me know in the comments below!
