---
layout: post
title: Creating a Custom Ember CLI Command
date: 2016-07-10
description: Ever wondered how to create your own custom Ember CLI command? Trying to figure out how to create a custom command took some research and looking at other addons like ember-cli-deploy, so I thought I'd share what I learned in case you want to create your own custom command.
keywords: ember cli, custom command, emberjs, ember.js, cli
---

Ever wondered how to create your own custom Ember CLI command? Recently I created a custom Ember CLI command as an addon called [ember-share](https://github.com/skaterdav85/ember-share) that allows you to share your local running Ember app with the world via a publicly accessible URL. Trying to figure out how to create a custom command took some research and looking at other addons like ember-cli-deploy, so I thought I'd share what I learned in case you want to create your own custom command.

To start, create an addon. I'll call my addon "hello":

```
ember addon hello
```

Next, we'll do the necessary npm linking so that we can develop and test our addon without having to publish it. Read more about the details [here](https://ember-cli.com/extending/#link-to-addon-while-developing). Run `npm link` from the addon's root. Now go to your Ember app, and run `npm link hello`. We're all set.

## index.js

When you create an addon, it will come with an _index.js_ file in the addon's root that looks like this:

```js
/* jshint node: true */
'use strict';

module.exports = {
  name: 'hello'
};
```

Change this file to the following:

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

We've added a function `includedCommands` that returns an object or one or more commands. Here we have a single command `hello` with a `description` and a `run` function. If we run `ember hello`, the `run()` function will execute and we'll see "hello!" in our terminal. We can also run `ember help hello` and we'll see the description output to the terminal. If our addon needed a few commands, we can simply add another key to the returned object. For example:

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

Note that the value under `name` corresponds to the command, not the key. We could have named those keys anything we wanted. For example, below the keys are `helloCommand` and `worldCommand`:

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

You probably noticed the two arguments passed to the `run()` function: `commandOptions` and `rawArgs`. `rawArgs` is an array of the arguments when the command was invoked. For example, if I ran:

```
ember hello 1 2 3
```

`rawArgs` would equal `['1', '2', '3']`.

`commandOptions` allows you to pass options with names to your command, like `port` if you were to run `ember serve --port 8000`. Let's add an option so that "hello" can be formatted when it is logged to the terminal. The command will get executed like:

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

If you run `ember help hello`, you will see the command's description along with all the available options.

## Extending Built-In Commands

Custom commands can also extend from built-in commands like `serve` and `test`. To have our hello command log our hello text and run `ember serve`, modify `index.js` to the following:

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

There are a few things to notice here. First, we're importing the serve command as `ServeCommand` from Ember CLI. Next, `helloCommand` is assigned an object that extends from the serve command by calling `ServeCommand.extend()`. For `availableOptions`, we are concatenating our custom options with the default options that the serve command provides. If we didn't do this, our `availableOptions` would overwrite the options in the serve command and we'd get errors. Lastly, inside the `run()` function, we are calling `this._super.run()` after our custom code to trigger the original serve command behavior.

If you wanted to extend other commands like `ember test`, import the test command like this:

```js
var TestCommand = require('ember-cli/lib/commands/test');
```

Check out all the other commands you can extend from [here](https://github.com/ember-cli/ember-cli/tree/master/lib/commands).

## Handling Asynchronous

If you need your command to perform asynchronous operations, the `run()` function can return a promise. For example, in the ember-share addon, the `run()` function returns a promise like this:

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
