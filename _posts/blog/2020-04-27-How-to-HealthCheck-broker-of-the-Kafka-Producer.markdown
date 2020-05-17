---
layout: post
published: true
title: "How to healthCheck broker of the Kafka Producer."
date: 2020-04-27 19:00:30 -0400
categories: [blog]
tags: [kafka, java, healthCheck, healthcheck, producer, isopen]
---

Generally, The Kafka cluster is composed of one more brokers. 
Normally, there is no problem with the services, if at least one broker remains.

But, The Kafka broker failure may occur. Because. We have to periodic checks are carried out on the status of the broker.

There are several ways of the health check of the Kafka broker.

## Using monitoring tools

This way is inconvenient need to install external solutions. And developers impossible to always monitoring the system.

## Using The Kafka Topic for a health check.

Make The Topic for a health check. And publish messages to the Topic. But this way can not check per the brokers.

## So what should we do?

Generally. The Kafka broker is used as a port number of '9092'. So, How about trying to connect with that socket number '9092'?

Simply I made a static method about connecting socket.

[NetworkUtil.java](https://github.com/LeeKyoungIl/illuminati/blob/3a21ca189577ee114696865eb460c74a2badb103/illuminati/illuminati-common/src/main/java/me/phoboslabs/illuminati/common/util/NetworkUtil.java#L5)

```java
public static boolean canIConnect(final String hostName, final int portNumber) {
    try (Socket socket = new Socket(hostName, portNumber)) {
        return true;
    } catch (Exception e) {
        return false;
    }
}
```

So, for example, there are three brokers in the cluster. (123.12.12.1:9092, 123.12.12.2:9092, 123.12.12.3:9092)
I make a method for trying to connect those brokers and count the number to connectable broker.

The detailed code is [KafkaInfraTemplateImpl.java](https://github.com/LeeKyoungIl/illuminati/blob/master/illuminati/illuminati-processor/src/main/java/me/phoboslabs/illuminati/processor/infra/kafka/impl/KafkaInfraTemplateImpl.java#L138-L172) check this out.

Below is a simple code.
```java
int canIConnectCount = 0;

List<String> clusterList = Arrays.asList("123.12.12.1:9092", "123.12.12.2:9092", "123.12.12.3:9092");
for (String clusterAddress : clusterList) {
    final String[] clusterAddressInfo = clusterAddress.split(":");
    boolean connectResult = NetworkUtil.canIConnect(clusterAddressInfo[0], Integer.parseInt(clusterAddressInfo[1]));
    if (connectResult) {
        canIConnectCount++;
    }
}

if (canIConnectCount > 0) {
    System.out.println("There is " + String.valueof(canIConnectCount) + " Kafka broker.");
}
```

Use this way, It is possible to respond to failure whenever a message occurs or periodically by checking the broker status in real time. 