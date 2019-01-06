---
layout: post
published: true
title: "How to throttle the TPS on Nginx."
date: 2019-01-03 20:31:30 -0400
categories: [blog]
tags: [Nginx, tps, throttle, module]
---

Sometimes, we have to limit the application request, it's called the TPS throttling.

If we use the application with the spring boot, we can't throttle the TPS.<br>
However, if we use the Nginx which is located in front of the spring boot application and is named the reverse proxy, the Nginx can throttle the TPS.

There is a module of the limit_req_zone on the Nginx, generally, it is used to protect a web server from the DDOS.

I tried to apply the module for regulating the TPS.

Let's look at this configuration.

```editorconfig
limit_req_zone $binary_remote_addr zone=my_zone:10m rate=30r/s;
```

This configuration is meaning of making a limit zone, it's name of my_zone, and client ip address used for key, and the keys are saving to maximum 10M of memory.

And when request of clients are more than 30 times per second, it is blocked. 

Let's apply the zone to our configuration.

```editorconfig
server {
  location / {
    limit_req zone=my_zone burst=10 nodelay;
    proxy_pass http://spring-boot-application;
  }
}
```

In this way, it can use the my_zone configuration to apply spring-boot-application.

There is one more thing, you should also check that the Burst keyword.<br> 
It is meaning of make 10 queues, when server is over a limit of client request.

But, this configuration is not result I want.

What's the problem?

Let's look it again.

```editorconfig
limit_req_zone $binary_remote_addr zone=my_zone:10m rate=30r/s;
```

This $binary_remote_addr is built-in variable of the Nginx, it has client ip address.

So, change the code to the $request_uri, it is also built-in variable of the Nginx, it has the uri of client request.

So, we can throttle client request per the uri.

If the same uri requested is over a limit, the Nginx will be return to client the 503 http status.

If the another the Nginx is placed in front of role of the Proxy-Nginx, when the Proxy-Nginx is to return the 503 status, the request of client redirect to another the Proxy_Nginx by front the Nginx.

And finally, I will explain by system configuration map.

![image](https://user-images.githubusercontent.com/4101636/50675336-d5072280-1030-11e9-8179-65086f04e9ad.png){: width="100%" }

![image](https://user-images.githubusercontent.com/4101636/50675340-d7697c80-1030-11e9-849d-9be014979df0.png){: width="100%" }

![image](https://user-images.githubusercontent.com/4101636/50675343-da646d00-1030-11e9-9046-5e8f2b42b221.png){: width="100%" }

![image](https://user-images.githubusercontent.com/4101636/50675346-de908a80-1030-11e9-8428-df3333f6f7a4.png){: width="100%" }