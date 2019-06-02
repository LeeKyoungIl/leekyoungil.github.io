---
layout: post
published: true
title: "How effective is the change in the configuration of the G1GC?"
date: 2019-06-01 10:00:30 -0400
categories: [blog]
tags: [gc, g1, jvm, java, performance]
---

In general, the Developer says not to modify the JVM options, <br>
to the exclusion of the Heap memory part. 

Especially, at the turn of the JDK8, the G1GC shows better <br>
performance than the another GC. <br>

Because of that performance, We don't think need tuning of the GC options. <br>
But sometimes, It may be good to try the GC tuning. <br>

![image](https://user-images.githubusercontent.com/4101636/58749946-017f7780-84c7-11e9-8b59-bc27eb4c4aa6.png){: width="100%" }

You are already have known about the G1GC, let see this picture. <br>

The G1GC structure is similar to the chessboard. <br>
The area divided like a chessboard is called the region. <br>
The region status is to change to the Eden, Survivor, Old <br> 
and that default size is allocated the Max Heap size divided by 2048. <br>

if generate Object over that value (<b>max heap / 2048</b>) in the Heap memory, <br> 
Objects are stored in the partitioned Region area. <br>

I will introduce my case. <br> 

My Application is handling encoded image data by base64 <br> 
and it is over 6M per request. <br> 

First, set it to 8GB Heap memory by default.

```shell
-Xms8G 
-Xmx8G
```

I compared the general options with the changed region sizes <b>for a day</b>. (with few options) <br> 

```shell
-XX:G1HeapRegionSize=n
-XX:InitiatingHeapOccupancyPercent=n
-XX:G1ReservePercent=n
```

<b>Heap Memory</b>
1. Basic options.
![image](https://user-images.githubusercontent.com/4101636/58750546-d436c780-84ce-11e9-970c-bd8f5ff1a969.png){: width="100%" }
2. Changed options.
![image](https://user-images.githubusercontent.com/4101636/58750592-558e5a00-84cf-11e9-876a-8180afce9eb8.png){: width="100%" }

The usage of the Heap memory is decreased at a peak time.

<b>GC Time</b>
1. Basic options.
![image](https://user-images.githubusercontent.com/4101636/58750677-6390aa80-84d0-11e9-8652-42d9f3e2b82b.png){: width="100%" }
2. Changed options.
![image](https://user-images.githubusercontent.com/4101636/58750691-95a20c80-84d0-11e9-9edb-1b9d7f8ebf4c.png){: width="100%" }

The GC time is about 50 percent faster.

<b>G1 Collection Phases statics</b>
1. Basic options.
![image](https://user-images.githubusercontent.com/4101636/58750813-b454d300-84d1-11e9-8b0d-e7a1cddb086b.png){: width="100%" }
2. Changed options.
![image](https://user-images.githubusercontent.com/4101636/58750838-dea69080-84d1-11e9-9de0-7a66298ffa27.png){: width="100%" }

Because of One object was stored in one region, <br>
the STW(Stop-The-World) doesn't occur because the GC affects only <br>
one the region when GC occurs. <br>

<b>this is my speculation.</b>

My conclusion is that you have a large memory size to handle per request.<br>
We have to try it.



