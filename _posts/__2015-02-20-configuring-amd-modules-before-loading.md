---
layout: post
title:  "Configuring AMD/Require.js Modules Before They Are Loaded Into Other Modules"
date:   2015-02-20
keywords: require.js, marionette, amd, asynchronous module definition
---

Currently I am using Marionette which registers itself as an AMD module called "marionette". Before it gets loaded into other modules, I want to set some configurations on it. My only thought as of now is to do this:

// configuredMarionette.js
define(["marionette"], function(Marionette) {
    // modify Marionette here
    return Marionette;
});

Then, in each of my modules that need marionette, I set "configuredMarionette" as the dependency instead of "marionette" so that I get the configured version. Is there any other way around this that is cleaner?

When working with Require.js, sometimes you'll want to configure a 3rd party library so that wherever it is specified as a dependency, it has the configurations applied.

For example, imagine you are working with Marionette and you want to swap out the client-side templating engine to use Handlebars instead of Underscore. 

```js
define(["marionette", "handlebars"], function(Marionette, Handlebars) {
    Marionette.TemplateCache.prototype.loadTemplate = function(templateSelector) {
      var template = $(templateSelector).html();

      if (!template) {
        template = $("script[data-template-name='" + templateSelector + "']").html();
      }

      return template;
    };

    Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
      return Handlebars.compile(rawTemplate);
    };

    return Marionette;
});
```

