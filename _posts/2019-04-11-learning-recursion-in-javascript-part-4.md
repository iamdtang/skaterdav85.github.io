---
layout: post
title: Learning Recursion in JavaScript Part 4 - Palindromes
date: 2019-04-11
description: Does recursion make your head spin? Haven't used it in awhile and want a refresher? If so, this series is for you.
keywords: recursion, recursive, tutorial, examples, JavaScript, palindrome
image: javascript
twitter_image: javascript.png
twitter_image_alt: JavaScript logo
card_style: summary
---

For this fourth post in this series on recursion, we're going to look at palindromes. If you're not familiar with a palindrome, it is a word, phrase, or sequence that reads the same backward as forward. For example, "madam", "noon", "eve", and "level" are palindromes.

In this post, we're going to write a function that checks if a string is a palindrome.

## Manually Checking if a Word is a Palindrome

Before we write any code, how would we check if a string is a palindrome manually? A simple way would be to check the first and last characters of the string and see if they are the same. If they are, we move in a letter on both sides and check if those letters are the same. We can keep doing that until we've gone through all of the letters or there is one letter left. If at any point the letters that we are comparing don't match, we know that the word is not a palindrome.

Let's take the word "noon" for example. Is the first letter "n" the same as the last letter "n"? Yes, so we'll move in a letter. Is the second letter "o" the same as the third letter "o"? Yes. There are no more letters to check. The word "noon" is a palindrome.

Let's look at the word "level" now. What's different with this word is that there are an odd number of letters. Is the first letter "l" the same as the last letter "l"? Yes, so we'll move in a letter. Is the second letter "e" the same as the fourth letter "e"? Yes, so we'll move in a letter. "v" is the only letter remaining as it is the middle letter. The word "level" is a palindrome.

## Our Base Case

Looking at our two examples, we can identify our base. Our base case is when we've gone through all of the letters for an even numbered word length or there is one letter left for an odd numbered word length. In code, that would look like the following:

```js
function isPalindrome(string) {
  if (string.length <= 1) {
    return true;
  }

  // ...
}
```

## The Recursive Case

Now that we have our base case, let's start implementing the steps we went through above where we compare letters on the left and right, moving from the outside towards the inside.

```js
function isPalindrome(string) {
  if (string.length <= 1) {
    return true;
  }

  let [ firstLetter ] = string;
  let lastLetter = string[string.length - 1];

  if (firstLetter === lastLetter) {
    let stringWithoutFirstAndLastLetters = string.substring(1, string.length - 1);
    return isPalindrome(stringWithoutFirstAndLastLetters);
  } else {
    return false;
  }
}
```

And that's all there is to it. Let's step through some examples.

## Example 1: `isPalindrome('noon') // true`

<table border="1" cellpadding="7">
  <thead>
    <tr>
      <th>Invocation</th>
      <th><code class="highlighter-rouge">firstLetter</code></th>
      <th><code class="highlighter-rouge">lastLetter</code></th>
      <th>Recursive call</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code class="highlighter-rouge">isPalindrome('noon')</code></td>
      <td>n</td>
      <td>n</td>
      <td><code class="highlighter-rouge">isPalindrome('oo')</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">isPalindrome('oo')</code></td>
      <td>o</td>
      <td>o</td>
      <td><code class="highlighter-rouge">isPalindrome('')</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">isPalindrome('')</code></td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>Base case met. <code class="highlighter-rouge">true</code> is returned.</td>
    </tr>
  </tbody>
</table>

With the word "noon", the recursion will stop during the third invocation of `isPalindrome` since the string is empty, and `true` will be returned.

## Example 2: `isPalindrome('eve') // true`

<table border="1" cellpadding="7">
  <thead>
    <tr>
      <th>Invocation</th>
      <th><code class="highlighter-rouge">firstLetter</code></th>
      <th><code class="highlighter-rouge">lastLetter</code></th>
      <th>Recursive call</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code class="highlighter-rouge">isPalindrome('eve')</code></td>
      <td>e</td>
      <td>e</td>
      <td><code class="highlighter-rouge">isPalindrome('v')</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">isPalindrome('v')</code></td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td>Base case met. <code class="highlighter-rouge">true</code> is returned.</td>
    </tr>
  </tbody>
</table>

## Example 3: `isPalindrome('no0n') // false`

<table border="1" cellpadding="7">
  <thead>
    <tr>
      <th>Invocation</th>
      <th><code class="highlighter-rouge">firstLetter</code></th>
      <th><code class="highlighter-rouge">lastLetter</code></th>
      <th>Recursive call</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code class="highlighter-rouge">isPalindrome('no0n')</code></td>
      <td>n</td>
      <td>n</td>
      <td><code class="highlighter-rouge">isPalindrome('o0')</code></td>
    </tr>
    <tr>
      <td><code class="highlighter-rouge">isPalindrome('o0')</code></td>
      <td>o</td>
      <td>0</td>
      <td><code class="highlighter-rouge">false</code> is returned.</td>
    </tr>
  </tbody>
</table>

## Conclusion

Stay tuned for the next post in my series on recursion, as we'll continue to look at more examples and facets of recursion.
