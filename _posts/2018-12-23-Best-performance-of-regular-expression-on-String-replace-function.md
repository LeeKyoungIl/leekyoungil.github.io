---
title: "Best performance of regular expression on String replace function."
date: 2018-12-23 08:26:28 -0400
categories: Java
---

I've been working on process of a really big String replace on the Java recently.

It's simple. 

When text input to my code, regular expression works at least 1000 times.
Namely, Strings are created in the Heap memory so much.

Sometimes, this situation gives strain on the system memory resource. 
Because, the text string is a little large And more then 1000 similar text data are generated on memory.
