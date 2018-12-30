---
layout: post
published: true
title: "Best performance of regular expression on String replace function."
date: 2018-12-23 08:26:28 -0400
categories: [blog]
tags: [java, regular, expression, string, replace]
---

I've been working on process of a really big String replace on the Java recently.

Working flow is simple. 

When text input to my code, regular expression works at least 1,X00 times.
Namely, strings are created in the Heap memory so much.

Sometimes, this situation gives strain on the system memory resource. 
Because, the text string is a little large and more than 1,X00 similar text data are generated on memory.

Let's looking the code.

```java
public static String replaceAll (Pattern pattern, String txt, String replacement) {
  return pattern.matcher(txt).replaceAll(replacement);
}
```

Nothing to special?

But, this code runs 1,x00 per user request.

For example.

```java
String resultString = "Test String. (this string is more then 5kb.)";
for (Map.Entry<String, String> replaceEntry : dictionaryMap.entrySet()) {
    ...
    resultString = replaceAll(regexPattern, resultString, replaceValue);
    ...
}
```

At this time, what will happens in the heap memory?

May be, more then 1,000 Immutable string objects will be created in the heap memory.

In fact, it's not a big deal.

The string objects will be cleaned by the garbage collector. <br>
(Somebody talked me, god only knows, when garbage collector will be executed.)

We can almost see these graphs.
![image](https://user-images.githubusercontent.com/4101636/50532906-a934fa00-0b63-11e9-9668-196000d60862.png)

It's ordinary graph of garbage collector.
