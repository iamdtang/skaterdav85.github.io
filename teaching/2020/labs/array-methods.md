---
layout: assignment
title: Array Methods
---

Create a `README.md` file. In that file, write the code for each question using only the following array methods.

- [Array find()](https://www.w3schools.com/JSREF/jsref_find.asp)
- [Array filter()](https://www.w3schools.com/JSREF/jsref_filter.asp)
- [Array map()](https://www.w3schools.com/JSREF/jsref_map.asp)
- [Array join()](https://www.w3schools.com/jsref/jsref_join.asp)

Do not use array indexing.

Please use a [Fenced Code Block](https://www.markdownguide.org/extended-syntax/#fenced-code-blocks) with Syntax Highlighting for each of your answers.

## 1. Array of full names

```js
const data = {
  users: [
    { id: 0, first_name: 'David', last_name: 'Tang' },
    { id: 1, first_name: 'Patrick', last_name: 'Dent' },
    { id: 2, first_name: 'Nayeon', last_name: 'Kim' },
    { id: 3, first_name: 'Zune', last_name: 'Nguyen' }
  ]
};
```

```js
const fullNames = /* your code here */;

// Expected result
[ 'David Tang', 'Patrick Dent', 'Nayeon Kim', 'Zune Nguyen' ]
```

## 2. CSV list of emails

```js
const data= {
  students: [
    { id: 0, email: 'email0@usc.edu' },
    { id: 1, email: 'email1@usc.edu' },
    { id: 2, email: 'email2@usc.edu' }
  ]
};

const emails = /* your code here */;

// Expected result
'email0@usc.edu, email1@usc.edu, email2@usc.edu'
```

## 3. A list of students with an A

```js
const students = [
  { id: 0, name: 'Student 0', grade: 'B' },
  { id: 1, name: 'Student 1', grade: 'A' },
  { id: 2, name: 'Student 2', grade: 'C' },
  { id: 3, name: 'Student 3', grade: 'A' },
  { id: 4, name: 'Student 4', grade: 'A' }
];

const studentsWithAnA = /* your code here */;

// Expected result
'Student 1, Student 3, Student 4'
```

## 4. Find a student by the student ID of 789

```js
const students = [
  { studentId: '123', name: 'Student 0' },
  { studentId: '456', name: 'Student 1' },
  { studentId: '789', name: 'Student 2' },
  { studentId: '012', name: 'Student 3' },
  { studentId: '345', name: 'Student 4' }
];

const student = /* your code here */;

// Expected result
{ studentId: '789', name: 'Student 2' }
```

## 5. List all the ITP classes student 1 is taking

```js
const students = [
  { id: 0, name: 'Student 0', classes: ['BUAD 200', 'ITP 300'] },
  { id: 1, name: 'Student 1', classes: ['ITP 404', 'CSCI 101', 'ITP 405', 'ACCT 300', 'ITP 482'] },
  { id: 2, name: 'Student 2', classes: ['ITP 109', 'ITP 303', 'BUAD 300'] },
  { id: 3, name: 'Student 3', classes: ['ISE 331', 'ISE 370'] },
  { id: 4, name: 'Student 4', classes: ['CSCI 101'] }
];

const itpClasses = /* your code here */;

// Expected result
'ITP 404, ITP 405, ITP 482'
```

## Submission

[https://classroom.github.com/a/3UwuqaKR](https://classroom.github.com/a/3UwuqaKR)
