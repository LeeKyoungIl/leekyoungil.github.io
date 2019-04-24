---
layout: post
published: true
title: "How to get the usage of CPU by a thread in Java Application"
date: 2019-04-23 10:00:30 -0400
categories: [blog]
tags: [cpu, threa, java]
---

There is some way of monitoring Java Applications. 
I will introduce a Simple way of them.

![image](https://user-images.githubusercontent.com/4101636/56628166-bb432700-6683-11e9-8a14-82ded5305282.png){: width="100%" }
There is a Java Applications, the process id is 43413.

And look for a thread id the usage a lot of CPU by ps command.

```
ps -mo pcpu,lwp -p 43413| sort -r -n | head
```

![image](https://user-images.githubusercontent.com/4101636/56628245-0bba8480-6684-11e9-9065-d2d5e22eba6e.png){: width="100%" }
so we can check the usage of CPU by thread ordered.

Look at the right side, that is a thread id, it's a decimal value. we have to convert to a hex value.

use [this](https://www.binaryhexconverter.com/decimal-to-hex-converter) online converter.

Convert the decimal value 75960 to hex is 128B8.

Next, then let's get a thread dump.

Finally, find a dump data by value of 128B8, And check the code.

![image](https://user-images.githubusercontent.com/4101636/56628246-0bba8480-6684-11e9-9eea-77b237fb5cbf.png){: width="100%" }


 