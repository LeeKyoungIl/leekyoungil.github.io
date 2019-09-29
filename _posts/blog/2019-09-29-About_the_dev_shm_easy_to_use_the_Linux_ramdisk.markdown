---
layout: post
published: true
title: "About the '/dev/shm', easy to use the Linux ramdisk"
date: 2019-09-29 10:00:30 -0400
categories: [blog]
tags: [nginx, cache, proxy]
---

## What is the dev shm?

You can check disk partition in linux by the "df" command, the "/dev/shm" can be found. 

![image](https://user-images.githubusercontent.com/4101636/65818103-4931c800-e249-11e9-948a-753db12b3eba.png){: width="100%" }

Now, let's have a look at the screenshot. The size is 2G, the size is set half of the main memory.<br>

Don't worry. It is not actually assigned half of the main memory.
It is only assigned to memory when data save to that space.

The "/dev/shm" is the Virtual Memory FileSystem. It can access all of from the Linux Processes.

And You will see the "tmpfs". It's a filesystem. simply, H\W memory can use a like disk.

There is something similar. It's a Ramdisk. The Ramdisk and the "tmpfs" are the same as to save them in memory.

The difference is, the Ramdisk has a limit of space. But the "tmpfs" is If other processes are located in the memory When the sum of the processes used memory size and the "/dev/shm (tmpfs)" size over the memory size.<br>
 
The Linux will be using a swap partition. You know, When the swap partition is using, the system is slow down.

## What should We check before using?

As mentioned above, The "/dev/shm" can access all of the processes.
Because. We should be careful about file and directory permission.

We do better make a personal directory.

And the "/dev/shm" is a memory, and the memory is volatile. Because, When rebooting the system, all data will be deleted in the space.

## Where should we use it? 

In application. Sometimes we use a temporary file. In this situation easily change the path to the "/dev/shm", we will get fast I/O,
or We might be used for storage of batch process.