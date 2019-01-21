---
layout: post
published: true
title: "Internal working of the HashMap in java. (resize method)"
date: 2019-01-21 21:00:30 -0400
categories: [blog]
tags: [hashmap, resize, java]
---

The developers of java application are always to developing application<br> 
with the HashMap, so do I.<br>

Most developers are already knows, how the HashMap works in the Java. <br>
So, this article not handle about theory of the HashMap. 

This article explain about components of the HashMap source code <br>
by version of the Java8.<br>

But, I can not explain everything at this time.<br>
So, this article explain "resize()" method of the HashMap.

Firstly look at the first of "resize()" code. 

```
Initializes or doubles table size.
```

When input the data of the HashMap, if not enough free space, it must increase the space.<br>

The "resize()" method is used at this time, or the first time you input data into the HashMap.

Let's look at the full of code.

{% highlight java linenos %}
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        } else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY 
                    && oldCap >= DEFAULT_INITIAL_CAPACITY) {
            newThr = oldThr << 1;
        }
    } else if (oldThr > 0) {
        newCap = oldThr;
    } else {
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
        Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
    }
{% endhighlight %}

The code is a very complex and long.<br>
Let's check the code of line number of 6 to 19 by flow.

```java
6 if (oldCap > 0) {
7    if (oldCap >= MAXIMUM_CAPACITY) {
8        threshold = Integer.MAX_VALUE;
9        return oldTab;
10   } else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY 
11               && oldCap >= DEFAULT_INITIAL_CAPACITY) {
12       newThr = oldThr << 1;
13   }
14 } else if (oldThr > 0) {
15     newCap = oldThr;
16 } else {
17     newCap = DEFAULT_INITIAL_CAPACITY;
18     newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
19 }
```

There are two important variables, In this part.

Firstly, the oldCap, it is stored existing size of the HashMap (HashTable).<br>
If data input into the HashMap at the first time, the oldCap value is 16.<br>

This value(capacity) can be changed at the first time. <br>

For example. 

```java
    Map<String, Object> testMap = new HashMap<>(64);
```

Secondly, the oldThr, it is stored value of threshold.<br>

What is the threshold?
 - the meaning is a some kind of criteria to satisfy.
 - It means a criterion for increasing size of the HashMap.

How to set the threshold? (line number 18)

```
newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
threshold = newThr;
```

The value of threshold is multiplied by DEFAULT_LOAD_FACTOR and DEFAULT_INITIAL_CAPACITY.
 - DEFAULT_LOAD_FACTOR is 0.75
 - DEFAULT_INITIAL_CAPACITY is 16 (1 << 4)
 
The title The "resize()" method of this article is called by The value of threshold or at the first insert into the HashMap.

Back in to code.

 - line 6 : If the value of oldCap is more than zero.
     - The oldCap is stored value of size of the existing HashMap(HashTable). 
     - So, if this method is executed at the first time, the value is zero.
 - line 7~9 : If the oldCap value is greater than or equal to MAXIMUM_CAPACITY.
     - The MAXIMUM_CAPACITY value is 1073741824.(1 << 30)
     - It is too large value, do we have to store large data in the HashMap?
     - So, if existing the HashMap is too large, the threshold set to more big value. (Integer.MAX_VALUE)
 - line 10 : If the 2 x oldCap value is less than MAXIMUM_CAPACITY and existing the HashMap size is greater than or equals to DEFAULT_INITIAL_CAPACITY.
     - The threshold doubles. (newThr = oldThr << 1)
     
Next code is so important and difficult, but it does not take apply to the first time by execute.

Let's check the code of line number 29.

```java
29 if (oldTab != null) {
30     ...
31     ...
70 }
```

This line is only execute the value of oldTab is not null.<br>  
So, before as i said, this method role is "Initializes or doubles table size".<br>
We talk about initialization until this time, and we will talk about doubles now.

The source code is too complex, but the key point is simple.
Look at the line of code 39 to 40, there are type of The node variables loHead, loTail and hiHead, hiTail.
 - The node variable is the Linked list.<br>
 
The size of HashMap increase by double, so the existing data must be distributed equally among the increased space.<br>

The variables are used at this time. 

The datas are re-stored again based on the value of the HashData.

Let's check the code of line number 44 to 57.

```java
44 if ((e.hash & oldCap) == 0) {
45     if (loTail == null)
46         loHead = e;
47     else
48         loTail.next = e;
49     loTail = e;
50 }
51 else {
52     if (hiTail == null)
53         hiHead = e;
54     else
55         hiTail.next = e;
56     hiTail = e;
57 }
```

It will be stored to the loTail and hiTail by value of the HashValue with the oldCap is a criterion.

And check the following code of line number 59 to 66.

```java
59 if (loTail != null) {
60     loTail.next = null;
61     newTab[j] = loHead;
62 }
63 if (hiTail != null) {
64     hiTail.next = null;
65     newTab[j + oldCap] = hiHead;
66 }

```

If you look at the code, the value of loHead is stored to the existing space and the value of hiHead is stored to new space.

We looks the "resize()" method until now, there are fer things to remember.
 - The "resize()" method is only calling "when Initializes or doubles table size".
 - The HashTable increase to doubles, per calling.
 - The value of threshold is a criterion of for execution this method. 
 
Finally, I excluded explain of the code line 36 to 37.
In over version of the Java 8, the HashMap structure is changed the Linked-List to Tree by data size.<br>

This part will be described as a separate post.

