---
layout: post
title: Styling &lt;select&gt; Elements with CSS
date: 2016-04-07
description: This post shows how you can style your select menus with modern CSS
keywords: styling, select, menus, dropdowns, css, style arrow, select arrow
image: css
---

As a JavaScript developer, I find myself keeping up less and less with CSS. Recently I had to style a select menu and figured this was probably now possible in at least modern browsers. After some research and trial and error, this is the solution I ended up with that worked pretty well:

```css
select {
  /* General styling */
  height: 30px;
  width: 100px;
  border-radius: 0;
  padding-left: 10px;

  /* Removes the default <select> styling */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  /* Positions background arrow image */
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC');
  background-repeat: no-repeat;
  background-position: 75px center;
}
```

<style>
.select-demo {
  height: 30px;
  width: 100px;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0;
  background-image:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAh0lEQVQ4T93TMQrCUAzG8V9x8QziiYSuXdzFC7h4AcELOPQAdXYovZCHEATlgQV5GFTe1ozJlz/kS1IpjKqw3wQBVyy++JI0y1GTe7DCBbMAckeNIQKk/BanALBB+16LtnDELoMcsM/BESDlz2heDR3WePwKSLo5eoxz3z6NNcFD+vu3ij14Aqz/DxGbKB7CAAAAAElFTkSuQmCC');
  background-repeat: no-repeat;
  background-position: 75px center;
  padding-left: 10px;
}
</style>

__Here is an example:__

<select class="select-demo">
  <option>1</option>
  <option>2</option>
  <option>3</option>
</select>

Try it out yourself on <a href="http://jsbin.com/hokivosoca/edit?html,css,output" target="_blank">JSBin</a>.

There are two key properties here: the `appearance` property and `background-image`. The `appearance` property set to `none` is used to strip away the native styling of the select menu. Support for `appearance` is pretty good across modern browsers: <a href="http://caniuse.com/#feat=css-appearance" target="_blank">http://caniuse.com/#feat=css-appearance</a>.

Then, a base64 encoded image of a prettier dropdown arrow is positioned in the background on the right side. Why base64 encode the image? This way you don't have to worry about an extra HTTP request or figuring out where to put that image. Just copy that styling and you're all set! There is also a cool site, <a href="https://www.iconfinder.com/icons/211614/arrow_b_down_icon#size=20" target="_blank">https://www.iconfinder.com/icons/211614/arrow_b_down_icon#size=20</a>, where you can grab the base64 encoded icons if you don't like the one in this example.

How have you styled select elements? Let me know in the comments!
