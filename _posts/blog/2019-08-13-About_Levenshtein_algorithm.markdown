---
layout: post
published: true
title: "About Levenshtein Distance Algorithm"
date: 2019-08-13 10:00:30 -0400
categories: [blog]
tags: [levenshtein, distance, algorithm]
---

## What is the Levenshtein distance?

The Levenshtein Algorithm compare A and B string.<br>
Returns 0(zero) If both are equal and Integer value if both are different.<br>
The Integer value is the number of times you need to modify the two values to be the equal.<br>
Of course, the smaller the value is similar.

## Example 

Let's suppose there are two words. That is "Saturday" and "Sunday". <br>
And start to compare two words. Start with to compare the first letter. <br> 
Before we do, insert space to first of the words. Let's start to compare with space. <br>

![image](https://user-images.githubusercontent.com/4101636/62920670-661d5380-bde1-11e9-9c10-4a54dc70b25c.png){: width="100%" }
The Image from [wikipedia](https://en.wikipedia.org/wiki/Levenshtein_distance)

So, Think of it as array. 
```java
[' ', 'S', 'a', 't', 'u', 'r', 'd', 'a', 'y']
[' ', 'S', 'u', 'n', 'd', 'a', 'y']
```
The rule is simple. If both are the same, the value is set diagonally from the current position.<br>
And if it's different, add 1 to the smallest of the left, top, and diagonal values.

Finally, The value at the bottom right is the result. 

This example result value is 3. It means, you have to modify 3 times to make the texts equals. 
So, the value is 0(zero), means the same text.

Let's look at the library([Github](https://github.com/LeeKyoungIl/illuminati/tree/master/illuminati/illuminati-util/illuminati-levenshtein)) in the Java.<br> 
You can easily add it to the Maven or Gradle dependency.<br>

That library is open source. And I made it. <br>
It is different from another library.<br>
That Added flag for case sensitive identify.<br>
And I tried to make it using only one the for loop syntax.<br>

It will help a bit to understand the code.