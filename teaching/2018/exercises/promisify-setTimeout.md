---
layout: assignment
title: Promisify setTimeout()
date: 2018-03-19
---

```js
function timeout(milliseconds) {
  // your code
}

console.log(1);
timeout(1500).then(
  function() {
    console.log("sup");
  },
  function() {
    console.log("too long");
  }
);
console.log(2);
```

Modify the `timeout` function so that it returns a promise. The promise should resolve if the duration is less than 2 seconds. Otherwise, the promise should reject.
