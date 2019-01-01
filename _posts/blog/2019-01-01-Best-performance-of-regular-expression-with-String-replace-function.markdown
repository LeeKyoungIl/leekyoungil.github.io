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
Because, the text string is a little large and more than 1,000 similar text data are generated on memory.

Let's looking the code.

```java
public static String replaceAll (Pattern pattern, String txt, String replacement) {
  return pattern.matcher(txt).replaceAll(replacement);
}
```

Nothing special?

But, this code runs more than 1,000 times per user request in one for-loop syntax.

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
    int cursor = 0;
    StringBuilder result = new StringBuilder();

    while (cursor < replacement.length()) {
        ...
    }
    sb.append(text, lastAppendPosition, first);
    sb.append(result);

    lastAppendPosition = last;
    return this;
}
```
The source code is too long, I can't paste it.<br> 
So, you can check the [api document link](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Matcher.html#appendReplacement-java.lang.StringBuffer-java.lang.String-) instead of the code.

If you look at the code, it's using the StringBuilder, StringBuffer classes.<br>
And the appendReplacement is base of Matcher class, so basically<br> 
it support regular expression.

Of course, the replaceAll method in Matcher class is too using appendReplacement, let's look at this code again.

```java
public static String replaceAll (Pattern pattern, String txt, String replacement) {
  return pattern.matcher(txt).replaceAll(replacement);
}
```

The replaceAll method is returning to immutable string object, so we can't save the memory resources.

Let's looking the replaceAll code in Matcher class.

```java
public String replaceAll(String replacement) {
    reset();
    boolean result = find();
    if (result) {
        StringBuffer sb = new StringBuffer();
        do {
            appendReplacement(sb, replacement);
            result = find();
        } while (result);
        appendTail(sb);
        return sb.toString();
    }
    return text.toString();
}
```

Before we look the code, the appendReplacement method is using stringBuffer by parameter.

As you know, the stringBuffer is slower than the stringBuilder.

From above, it's code version of the jdk8, the interesting thing is the code changed the stringBuffer to stringBuilder since the jdk9.

```java
/*
 ...
 * @since 9
 */
public Matcher appendReplacement(StringBuilder sb, String replacement) {
    // If no match, return error
    if (first < 0)
        throw new IllegalStateException("No match available");
    StringBuilder result = new StringBuilder();
    appendExpandedReplacement(replacement, result);
    sb.append(text, lastAppendPosition, first);
    sb.append(result);
    lastAppendPosition = last;
    modCount++;
    return this;
}
```

Of course, the others codes are many changed.

We can make similar code to that above (replaceAll), <br>
and we have to try for saving memory resource.<br>

For this reason, I was bound StringBuffer reference by parameter. 

```java
public static void replaceAllWithReUseBuilder (StringBuilder tmpBufferString, Pattern pattern, StringBuilder reUseBuilder, String replacement) {
    Matcher matcher = pattern.matcher(reUseBuilder.toString());
    tmpBufferString.setLength(0);
    while (matcher.find()) {
        matcher.appendReplacement(tmpBufferString, replacement);
    }
    matcher.appendTail(tmpBufferString);
    reUseBuilder.setLength(0);
    reUseBuilder.append(tmpBufferString);
}
```

In all, the two stringBuilder is used, one is temporary variable using in the while-loop, and the other one is used as a result store. 

Both variables are using already generated reference, so we can reuse memory resources.

Like this.

```java
String resultString = "Test String. (this string is more then 5kb.)";

StringBuilder reUseStringBuilder = new StringBuilder(resultString);
StringBuilder tmpBufferString = new tmpBufferString(reUseStringBuilder.length());

for (Map.Entry<String, String> replaceEntry : dictionaryMap.entrySet()) {
    ...
    replaceAllWithReUseBuilder(tmpBufferString, regexPattern, reUseStringBuilder, replaceValue);
    ...
}
```

The result is very interesting.

![image](https://user-images.githubusercontent.com/4101636/50571445-66d31d80-0dee-11e9-98b3-f770c58a649f.png){: width="100%" }

Memory usage has decreased.<br>
Check memory usage by profiler again.

![image](https://user-images.githubusercontent.com/4101636/50571500-8dde1f00-0def-11e9-8dad-f449fe285dd4.png){: width="100%" }

In my opinion, it's a meaningful result.

When system is at the end of limit, the jvm is first to be affected,<br> 
at this time, most important process is the garbage collector.

As you know, if target of clean objects are too much, the garbage collector is <br>
need much the cpu resources, because, when at this situation, <br>
if our application is usage memory usage a little, we can avoid system failure.

There's saying, "The foot of the candle is dark.", <br>
I wander in the Google's search result and github to resolve the issue,<br>
But, solution was close. 

Because of this issue, I learned the appendExpandedReplacement in java matcher class.

It will be useful for my work.