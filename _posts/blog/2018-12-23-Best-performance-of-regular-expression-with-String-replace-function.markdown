---
layout: post
published: true
title: "Best performance of regular expression with String replace function."
date: 2018-12-23 08:26:28 -0400
categories: [blog]
tags: [java, regular, expression, string, replace]
---

I've been working on process of a really big String replace on the Java recently.

Working flow is simple. 

When text input to my code, regular expression works at least more than 1,000 times.
Namely, strings are created in the Heap memory so much.

Sometimes, this situation gives strain on the system memory resource. 
Because, the text string is a little large and more than 1,X00 similar text data are generated on memory.

Let's looking the code.

```java
public static String replaceAll (Pattern pattern, String txt, String replacement) {
  return pattern.matcher(txt).replaceAll(replacement);
}
```

Nothing special?

But, this code runs more than 1,000 times per user request.

For example.

```java
String resultString = "Test String. (this string is more then 5kb.)";
for (Map.Entry<String, String> replaceEntry : dictionaryMap.entrySet()) {
    ...
    resultString = replaceAll(regexPattern, resultString, replaceValue);
    ...
}
```

At this time, what will be happened in the heap memory?

Maybe, more than 1,000 times of Immutable string objects will be created in the heap memory.

In fact, it's not a big deal.

The string objects will be cleaned by the garbage collector. <br>
(Somebody told me, God only knows when garbage collector executed.)

We will see the graph as below.
![image](https://user-images.githubusercontent.com/4101636/50532906-a934fa00-0b63-11e9-9668-196000d60862.png){: width="100%"}


This is ordinary graph of garbage collector.

But, live data is too big. <br>
It seems to be over 3~4G roughly.

Check memory usage by profiler.
![image](https://user-images.githubusercontent.com/4101636/50547521-1dfc5700-0c7e-11e9-9657-c2e4c0a4fddc.png){: width="100%" }


Arrays of char and byte occupy a large part of memory.

Then, what is the solution?

In my opinion, there are two solutions.

 1. When you allocate memory resource, reuse it.
 2. And make the garbage collector run faster.
 
The first solution is using the StringBuffer, StringBuilder class.<br>
These classes using the char array allocate String data.

Fortunately, some replacer function codes are in the github<br> 
and we can get by google's search engine results. 

But, there are still issue.

 - Does this function is using the StringBuffer, StringBuilder classes,<br>
 and regular expression?

Many open source codes did not satisfy the conditions.<br>
But, solution was close.

The appendReplacement method of java matcher class is satisfy the conditions.

```java
public Matcher appendReplacement(StringBuffer sb, String replacement) {
    ...
}
```
Because the source code is too long, I can't paste it.<br> 
So, chek the [api document link](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Matcher.html#appendReplacement-java.lang.StringBuffer-java.lang.String-) instead of the code.
