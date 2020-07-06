---
layout: assignment
title: GitHub Classroom
---

## Before you start a lab, assignment, the midterm, or the final project

Normally with GitHub, you'd create a repository yourself that is attached to your profile. For this course, you will instead create a private repository through GitHub Classroom. This is so that I will have access to your code and GitHub Classroom will keep track of your submissions. I have created a test assignment named "Test Assignment" located at [https://classroom.github.com/a/7pkasgDs](https://classroom.github.com/a/7pkasgDs) if you'd like to see what this workflow looks like. Click on that link and follow the wizard. If this were a real assignment, you would just need to push your code up to this repository before the due date.

Once you've created a repository through GitHub Classroom and you are on your repository page, click on the green "Code" button, which will open a dropdown. Copy the URL in the input. Open your Terminal, `cd` to wherever you want your course work to be, and run the following:

```
git clone <paste URL here>
```

For example, I would run the following:

```
git clone https://github.com/ITP-GitHub-Classroom-Submissions/test-assignment-skaterdav85.git
cd test-assignment-skaterdav85
```

At this point, I can start my work. Feel free to make commits and push up those commits as you work. Your work needs to be pushed before the deadline.

## The .gitignore file

Sometimes it may be a good idea to exclude files from being tracked with Git. This is typically done in a special file named `.gitignore`. Here is what I usually have in this file:

```
.DS_Store
node_modules
```

Please add this to every repo with code that you submit.
