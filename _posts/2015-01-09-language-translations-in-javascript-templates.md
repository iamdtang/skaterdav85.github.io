---
layout: post
title:  "Maintainable Language Translations in JavaScript Templates and Backbone Views"
date:   2015-01-09
keywords: JavaScript internationalization, JavaScript localization, languages translations, language translations in client-side templates
---

There are many things that you need to consider when writing JavaScript for an international site. Things such as formatting currency, dates and times, and translating almost every piece of text on the site. If you don't create an extensible approach, it can easily become a mess to maintain and update when new countries are introduced. In this post I wanted to go over a really simple and maintainable approach that I have been using to translate all text in my JavaScript templates. I'll first show an example using client-templating by itself and then I'll show how to create a `Backbone.View` that abstracts this away for you.

Imagine you have a client-side template showing a summary of your shopping cart. This template will include the last item added to the cart, your shopping cart total, and a button to checkout. This is a Handlebars template.

```html
{% raw %}
<script type="text/handlebars" id="product-template">
	{{#if lastItemAdded}}
		<div class="product-name">{{name}}</div>
	    <div class="product-info">
	        <p>Color: {{lastItemAdded.color}}</p>
	        <p>Size: {{lastItemAdded.size}}</p>
	        <p>Qty: {{lastItemAdded.quantity}}</p>
	        <p>Price: {{currency lastItemAdded.price}}</p>
	    </div>
	    <div>
	    	{{currency total}} Pre-Tax Subtotal
	    </div>
	    <a href="/secure/checkout">Checkout</a>
    {{else}}
        <p>Your shopping cart is empty.</p>
    {{/if}}
</script>
{% endraw %}
```

There are several labels in this template that need to be translated. All of the labels for each locale that the site supports are stored in a database. These labels can be dumped into a global namespaced JavaScript variable from the server. Here is an example using PHP:

```js
var App = {};
App.labels = <?php echo $labels ?>;
```

This snippet could render as:

```js
var App = {};
App.labels = {
  color: "Color",
  size: "Size",
  quantity: "Qty",
  price: "Price",
  preTaxSubtotal: "Pre-Tax Subtotal",
  checkout: "Checkout",
  emptyShoppingCartText: "Your shopping cart is empty."
};
```


One approach you might consider would be to manually traverse the DOM and update the innerText or innerHTML with the corresponding label in `App.labels`. This could work but it would be difficult to maintain since you would have to update both the HTML and JavaScript if labels are added, removed, or rearranged.

Another approach I've seen is to create separate frontend assets for each locale. Unless you have an automated build process, this is difficult to maintain because once you make a change, you need to replicate that change in several other files for each locale.

The approach I settled on is to have all translation data mixed in with the data before rendering the template. Here is a simplified example:

```js
var template = Handlebars.compile(document.querySelector('#product-template').innerHTML);
var data = {
  lastItemAdded: {
    color: 'Blue',
    size: 'M',
    quantity: 2,
    price: 40.
  },
  total: 80
};


// mixin in translation data into data
data.labels = App.labels;

document.getElementById('shopping-cart').innerHTML = template(data);
```

Now my JavaScript template can look like this:

```html
{% raw %}
<script type="text/handlebars" id="product-template">
	{{#if lastItemAdded}}
		<div class="product-name">{{name}}</div>
	    <div class="product-info">
	        <p>{{labels.color}}: {{lastItemAdded.color}}</p>
	        <p>{{labels.size}}: {{lastItemAdded.size}}</p>
	        <p>{{labels.quantity}}: {{lastItemAdded.quantity}}</p>
	        <p>{{labels.price}}: {{currency lastItemAdded.price}}</p>
	    </div>
	    <div>
	    	{{currency total}} {{labels.preTaxSubtotal}}
	    </div>
	    <a href="/secure/checkout">{{labels.checkout}}</a>
    {{else}}
        <p>{{labels.emptyShoppingCartText}}</p>
    {{/if}}
</script>
{% endraw %}
```

If I ever need to modify the text, this can simply be done at the database level. If the UI needs to change and labels are added, removed, or rearranged, no one has to hunt through JavaScript code. You can simply make changes at the template level in one single file.

## Applying this to Backbone Views

If you are working with Backbone, you can easily extend `Backbone.View` to provide this behavior.

```js
var labels = {
  all: function() {
    if (window.App && window.App.labels) {
      return App.labels;
    }
  }
};

var BaseView = Backbone.View.extend({
  render: function() {
    var json = {};
    var allLabels = labels.all();

    if (this.model) {
      json = this.model.toJSON();
    }

    if (allLabels) {
      json.labels = allLabels;
    }

    this.$el.html(this.template(json));

    return this;
  }
});

new BaseView({
  template: Handlebars.compile($('#product-template').html())
});
```

## Conclusion

This technique has saved me and my team a lot of time. I am not the one always writing the HTML. With this approach, those who work primarily with HTML and CSS can easily update the templates without ever having to go into the JavaScript and labels can be managed from the database.
