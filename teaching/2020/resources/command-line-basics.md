---
layout: assignment
title: Command Line Basics
---

Please familiarize yourself with the following CLI commands. They all work on a Mac and most should work on Windows.

## The `pwd` command

Displays the current working directory

## The `ls` command

List all the non-hidden files in the current directory to the console. Hidden files begin with a ".". If you'd like to display all files (hidden and non-hidden) in the current directory, run `ls -a`.

## The `cd` command

Change directory from the current directory to (file path)

Example: `cd ~/Downloads`

## The `mkdir` command

Create a subdirectory named (file path) in the current directory

Example: `mkdir assignment1`

## The `touch` command

Create a new, empty file.

Example: `touch index.html`

## The `open` command

Open a folder or file with a specific application from the CLI. This command isn't necessary to learn but can be helpful. I often find myself wanting to open a specific folder or file (like `~/.bash_profile`) with VS Code from the CLI. I am not certain if this command works on Windows. If anyone is using Windows, please give this a try and let me know. 🙏

Examples:

- `open -a 'Visual Studio Code' .` (the "." means the current working directory)
- `open -a 'Visual Studio Code' ~/.bash_profile` (This can be very helpful if you need to edit a hidden file and you aren't familiar with a CLI text editor like Vim.)
