---
layout: post
published: true
title: "When the Dockerfile builds to image, if an localhost:2375 connection refused on the Mac OS."
date: 2019-01-05 20:35:30 -0400
categories: [blog]
tags: [dockerfile, maven, 2375, connection, refused]
---

When we make the Docker image by the Maven and Dockerfile, on the Spring project.

There are several plugins for making the Docker image, we can use the **[docker-maven-plugin](https://github.com/spotify/docker-maven-plugin)** of them.

This story is about a occurred exception of connection refused, when I use the docker-maven-plugin.

First, let's look at code of the pom.xml.

```xml
<plugin>
    <groupId>com.spotify</groupId>
    <artifactId>docker-maven-plugin</artifactId>
    <version>0.4.9</version>
    <configuration>
        <imageName>${docker.image.prefix}/${project.artifactId}</imageName>
        <dockerDirectory>src/main/docker</dockerDirectory>
        <resources>
            <resource>
                <targetPath>/</targetPath>
                <directory>${project.build.directory}</directory>
                <include>${project.build.finalName}.jar</include>
            </resource>
        </resources>
    </configuration>
    </plugin>
```

I've added the code to the '\<plugins\> ... \</plugins\>'.

If you are using over the JDK 9, you will meet the error message.

```
Caused by: java.lang.ClassNotFoundException: javax.activation.DataSource
```

Then you add the Java activation dependency in the plugin configuration to resolve.

```xml
<plugin>
    <groupId>com.spotify</groupId>
    <artifactId>docker-maven-plugin</artifactId>
    <version>0.4.9</version>
    <configuration>
        <imageName>${docker.image.prefix}/${project.artifactId}</imageName>
        <dockerDirectory>src/main/docker</dockerDirectory>
        <resources>
            <resource>
                <targetPath>/</targetPath>
                <directory>${project.build.directory}</directory>
                <include>${project.build.finalName}.jar</include>
            </resource>
        </resources>
    </configuration>
    <dependencies>
        <dependency>
            <groupId>javax.activation</groupId>
            <artifactId>activation</artifactId>
            <version>1.1.1</version>
        </dependency>
    </dependencies>
    </plugin>
```

And next problem is the connection refused, at the **mvn docker:build** command executed.

```
[ERROR] Failed to execute goal com.spotify:docker-maven-plugin:0.4.9:build 
(default-cli) on project image-reader-api: Exception caught: java.util.concurrent.ExecutionException: 
com.spotify.docker.client.shaded.javax.ws.rs.ProcessingException: org.apache.http.conn.HttpHostConnectException: 
Connect to localhost:2375 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused 
(Connection refused) -> [Help 1]
```

When we look at the Exception messages, it says that failed connect to the the 2375 port of the Localhost. 

The 2375 port is the Rest-API port of docker daemon, if we are using the Windows-os, it's easy to resolve.

Go to settings menu of the Docker for windows, and check to the Expose daemon on.

![image](https://user-images.githubusercontent.com/4101636/50725577-daed2880-1142-11e9-9999-01f5a6a8402c.png){: width="100%" }
<span style="color: #A6A6A6; font-size: 12px;">(https://intellij-support.jetbrains.com/hc/en-us/community/posts/115000327324--Docker-Setting-Connection-refused-on-localhost-2375)</span>

But, we can't find that menu on the Docker for mac-os.

![image](https://user-images.githubusercontent.com/4101636/50725672-1e946200-1144-11e9-9630-6c8dba694a8d.png){: width="100%" }

How should we resolve this issue?

The easiest way is to add the small linux container on the Local docker, and it is redirect the Docker api to tcp port on our the Mac-os host.

```xml
docker run -d -v /var/run/docker.sock:/var/run/docker.sock -p 127.0.0.1:2375:2375 
bobrik/socat TCP-LISTEN:2375,fork UNIX-CONNECT:/var/run/docker.sock

export DOCKER_HOST=tcp://localhost:2375
```

Let's try that one again, perhaps the issue has been resolved.