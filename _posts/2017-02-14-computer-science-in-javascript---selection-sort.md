---
layout: post
title: Computer Science in JavaScript - Selection Sort
date: 2017-02-14
description: Have you ever felt like you had a gap in your learning because you did't know common algorithms and data structures in computer science? Maybe you've tanked an interview where they asked you an algorithm question? Want to see implementations in JavaScript instead of Java? If this sounds familiar, this series is for you.
keywords: algorithms, algorithm, javascript, computer science, selection sort, algorithms in javascript, swap, big O notation
---

{% include computer-science-series-intro.html %}

In this first post of the Computer Science in JavaScript series, we're going to look at one sorting algorithm called Selection Sort. We'll look at two variations of this algorithm.

## How Does Selection Sort Work?

Imagine you have an array of songs that you want to sort by the number listens.

```js
let songs = [
  { title: 'The Bad Touch', listens: 55 },
  { title: 'Alone', listens: 71 },
  { title: 'Warm Machine', listens: 45 },
  { title: 'Daylight', listens: 85 },
  { title: 'Shadows', listens: 13 }
];
```

If we want to sort the songs in descending order by `listens`, one approach is to go through the array once and find the song with the highest number of listens. We'll put that song at the bottom of another array called `sortedSongs` and remove it from the `songs` array. We'll have something like this now:

```js
let songs = [
  { title: 'The Bad Touch', listens: 55 },
  { title: 'Alone', listens: 71 },
  { title: 'Warm Machine', listens: 45 },
  { title: 'Shadows', listens: 13 }
];

let sortedSongs = [
  { title: 'Daylight', listens: 85 },
];
```

Then we'll do it again. This time, the "Alone" song has the highest number of listens in the `songs` array so it will be removed from `songs` and placed at the bottom of `sortedSongs`:

```js
let songs = [
  { title: 'The Bad Touch', listens: 55 },
  { title: 'Warm Machine', listens: 45 },
  { title: 'Shadows', listens: 13 }
];

let sortedSongs = [
  { title: 'Daylight', listens: 85 },
  { title: 'Alone', listens: 71 }
];
```

We'll do this again and again, until there are no more songs left in the `songs` array. That is Selection Sort!

Let's look at how to implement this algorithm in JavaScript.

## An Implementation in JavaScript

Here is an implementation of Selection Sort in JavaScript with comments:

```js
function sortSongs(songs) {
  let sorted = [];
  let total = songs.length;

  while (sorted.length < total) {
    // find the index of the song with the most listens
    let highestIndex = 0;
    songs.forEach(function(song, index) {
      if (song.listens > songs[highestIndex].listens) {
        highestIndex = index;
      }
    });

    // move the song with the most listens from
    // the songs array to the new sorted array
    sorted.push(songs[highestIndex]);
    songs.splice(highestIndex, 1);
  }

  return sorted;
}
```

[See this in action on JSBin](http://jsbin.com/tefetufusi/edit?js,console)

One downside to this implementation is that we are modifying the `songs` array. If you run `console.log(songs)`, you'll notice that it is now empty. That is because `Array.prototype.slice` is mutating, which means that it modifies the array. If you didn't want this side effect, we can modify our code so that we create a new array from the `songs` array before doing the selection sort. It is just one line of code added:

```js
function sortSongs(songs) {
  // create a new array from the songs array so
  // the original songs array isn't modified
  songs = songs.concat([]);

  // everything else is the same
  let sorted = [];
  let total = songs.length;

  while (sorted.length < total) {
    let highestIndex = 0;
    songs.forEach(function(song, index) {
      if (song.listens > songs[highestIndex].listens) {
        highestIndex = index;
      }
    });

    sorted.push(songs[highestIndex]);
    songs.splice(highestIndex, 1);
  }

  return sorted;
}
```

[Try it out in JSBin](http://jsbin.com/cejatebeki/1/edit?js,console)

## A Variation of Selection Sort with Swapping

Another way to approach this algorithm that you'll often see is with swapping.

Let's start off with our list of songs again:

```js
let songs = [
  { title: 'The Bad Touch', listens: 55 },
  { title: 'Alone', listens: 71 },
  { title: 'Warm Machine', listens: 45 },
  { title: 'Daylight', listens: 85 },
  { title: 'Shadows', listens: 13 }
];
```

We'll iterate over the list of songs starting at index 1 and compare `songs[1].listens` with `songs[0].listens`. If `songs[1].listens` is less than `songs[0].listens`, we'll swap the two positions. Let's go through it.

<table cellpadding="10" cellspacing="0" border="1">
  <tr>
    <td>Is 71 < 55?</td>
    <td>No</td>
  </tr>
  <tr>
    <td>Is 45 < 55?</td>
    <td>Yes. Swap by putting songs[2] at index 0 and songs[0] at index 2</td>
  </tr>
</table>

Now the list looks like this:

```js
let songs = [
  { title: 'Warm Machine', listens: 45 },
  { title: 'Alone', listens: 71 },
  { title: 'The Bad Touch', listens: 55 },
  { title: 'Daylight', listens: 85 },
  { title: 'Shadows', listens: 13 }
];
```

<table cellpadding="10" cellspacing="0" border="1">
  <tr>
    <td>Is 85 < 45?</td>
    <td>No</td>
  </tr>
  <tr>
    <td>Is 13 < 45?</td>
    <td>Yes. Swap by putting songs[4] at index 0 and songs[0] at index 4</td>
  </tr>
</table>

After a first pass, `songs` will now look like this:

```js
let songs = [
  { title: 'Shadows', listens: 13 },
  { title: 'Alone', listens: 71 },
  { title: 'The Bad Touch', listens: 55 },
  { title: 'Daylight', listens: 85 },
  { title: 'Warm Machine', listens: 45 }
];
```

We'll do it again, but this time compare `songs[1]` with the rest of the songs in the list.

<table cellpadding="10" cellspacing="0" border="1">
  <tr>
    <td>Is 55 < 71?</td>
    <td>Yes. Swap by putting songs[2] at index 1 and songs[1] at index 2</td>
  </tr>
</table>

Now `songs` will look like this:

```js
let songs = [
  { title: 'Shadows', listens: 13 },
  { title: 'The Bad Touch', listens: 55 },
  { title: 'Alone', listens: 71 },
  { title: 'Daylight', listens: 85 },
  { title: 'Warm Machine', listens: 45 }
];
```

<table cellpadding="10" cellspacing="0" border="1">
  <tr>
    <td>Is 85 < 55?</td>
    <td>No</td>
  </tr>
  <tr>
    <td>Is 45 < 55?</td>
    <td>Yes. Swap by putting songs[4] at index 1 and songs[1] at index 4</td>
  </tr>
</table>

After a second pass, `songs` will now look like this:

```js
let songs = [
  { title: 'Shadows', listens: 13 },
  { title: 'Warm Machine', listens: 45 },
  { title: 'Alone', listens: 71 },
  { title: 'Daylight', listens: 85 },
  { title: 'The Bad Touch', listens: 55 }
];
```

We'll keep doing this until we've reached the end of the list, which at that point the `songs` array will be sorted by `listens` in ascending order.

Here is an implementation in JavaScript:

```js
function sortSongs(songs) {
  let indexToCompare = 0;
  while (indexToCompare < songs.length) {
    for (let i = indexToCompare + 1; i < songs.length; i++) {
      if (songs[i].listens < songs[indexToCompare].listens) {
        swap(songs, indexToCompare, i);
      }
    }

    indexToCompare++;
  }

  return songs;
}

function swap(array, index1, index2) {
  let item1 = array[index1];
  let item2 = array[index2];
  array[index1] = item2;
  array[index2] = item1;
}
```

[Try it out in JSBin](http://jsbin.com/paresuvupi/edit?js,console)

## Speed and Big O Notation

In terms of speed, Selection Sort isn't very fast. In computer science, Big O notation indicates the speed of an algorithm, but not in seconds, minutes, or hours. Big O notation indicates the speed of an algorithm by the number of operations it will make for a given input size (the number of songs in our example). This lets you compare algorithms and see how the number of operations grow for a given input size.

In Big O notation, the _O_ stands for _operations_ and _n_ stands for the input size, and it gives you a general idea of the number of operations. If an algorithm is <span class="equation">O(n)</span>, this means for a list of size <span class="equation">n</span>, it will take <span class="equation">n</span> operations. The algorithm grows linearly.

So what is the Big O notation for the Selection Sort algorithm? Selection Sort takes <span class="equation">O(n x n)</span> time or <span class="equation">O(n<sup>2</sup>)</span> time. This means that the algorithm grows quadratically. Why is this?

For each item in the list, we're looping over the list again. Now you might think, isn't the number of elements we're checking each time decreasing? Yes that is true, but based on certain rules in Big O Notation, it comes out to <span class="equation">O(n<sup>2</sup>)</span> time. For those who are interested in how this works out, continue reading.

If we think about how many iterations we're doing, the first time is 5, the second time is 4, the third time is 3, and so on until we get to 0.

```
5 + 4 + 3 + 2 + 1 = 15
```

We could express the above this like:

```
5 + (5-1) + (5-2) + (5-3) + (5-4) = S
```

or more generically:

```
n + (n-1) + (n-2) + ... + 2 + 1 = S
```

So looking at this polynomial equation, my first question was, how do you derive <span class="equation">n<sup>2</sup></span> from this? After some help from a few smart friends, here is how it works out. Let's say <span class="equation">n</span> is equal to 4. The polynomial equation would be:

```
n + (n-1) + 2 + 1 = S
```

Now take that equation and add it to itself, but reverse the terms:

```
n +  (n-1) +   2   + 1 = S
 1 +   2    + (n-1) + n = S
==================================
(n+1) + (n+1) + (n+1) + (n+1) = 2S
```

Notice how this comes out to 4 pairs of <span class="equation">n + 1</span>? We can now write this as:

```
n(n+1) = 2S
(n^2 + n) / 2 = S
```

In Big O Notation, constants like dividing by 2 are usually ignored, because if two different algorithms have different Big O runtimes, the constant ends up being insignificant. Sometimes they do make a difference though. So that leaves us with:

```
(n^2 + n) = S
```

What about the extra _n_? Well the <span class="equation">n<sup>2</sup></span> is much larger than _n_ when _n_ is sufficiently large, so we can ignore that too because <span class="equation">n<sup>2</sup></span> will dominate the runtime.

In the equation <span class="equation">(n<sup>2</sup> + n) = S</span>, we can consider <span class="equation">n<sup>2</sup></span> as <span class="equation">f(n)</span> and <span class="equation">n</span> as <span class="equation">g(n)</span>, so the runtime is <span class="equation">O(f(n) + g(n))</span>.

One Big O Notation rule is:

> If f(n) > g(n) for large n, then O(f(n) + g(n)) = O(f(n))

Thus, we can drop the <span class="equation">n</span> and we're left with just <span class="equation">n<sup>2</sup></span>.

## Conclusion

Selection sort is just one sorting algorithm and it isn't very fast. In a future post, we'll look a faster sorting algorithm called Quicksort. Stayed tuned for the next post in the Computer Science in JavaScript series.
