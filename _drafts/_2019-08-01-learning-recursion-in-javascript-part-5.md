---
layout: post
title: Learning Recursion in JavaScript Part 5 - Binary Search
date: 2019-08-01
description: Does recursion make your head spin? Haven't used it in awhile and want a refresher? If so, this series is for you.
keywords: recursion, recursive, tutorial, examples, JavaScript, binary search
image: javascript
twitter_image: javascript.png
twitter_image_alt: JavaScript logo
card_style: summary
---

{% include recursion-series-intro.md %}

In this post, we'll look at the binary search. The binary search is a search algorithm that finds the index of a value in a sorted array. Let's use the following array as an example:

```js
let array = [];
array[0] = 8;
array[1] = 9;
array[2] = 11;
array[3] = 14;
array[4] = 17;
```

Normally I would declare this array in a single line but I wanted to make the indexes obvious for each element.

The binary search works like this. Let's say I am searching for the value 9. We start by taking the middle index of the array, which is 2. Is 9 greater than, less than, or equal to the value at index 2? 9 is less than 11, so we know the value is contained in the lower half of the array (indexes 0 and 1). What's the middle index? We'll round down and say 0. Is 9 less than, greater than, or equal to 8? 9 is greater than 8, so we know it is in the upper half. We now know 9 is located at index 1.

We were able to 


```js
let array = [];
array[0] = 8;
array[1] = 9;
array[2] = 11;
array[3] = 14;
array[4] = 17;
array[5] = 19;

function binarySearch(array, search, min, max) {
	let middleIndex;

  min = min ? min : 0;
  max = max ? max : array.length - 1;

	if (max < min) {
		return -1;
	} else {
		middleIndex = parseInt((max + min) / 2);
	}

	if (search > array[middleIndex]) { // search in upper half
		return binarySearch(array, search, middleIndex + 1, max);
	} else if (search < array[middleIndex]) { // search in lower half
		return binarySearch(array, search, min, middleIndex - 1);
	} else {
		return middleIndex;
	}
}

binarySearch(array, 14); // 3
binarySearch(array, 11); // 2
binarySearch(array, 19); // 5
binarySearch(array, 31); // -1

```

## Conclusion

Stay tuned for the next post in my series on recursion, as we'll continue to look at more examples and facets of recursion.
