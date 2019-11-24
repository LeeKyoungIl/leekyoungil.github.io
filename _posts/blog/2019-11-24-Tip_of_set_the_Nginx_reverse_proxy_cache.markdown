---
layout: post
published: true
title: "Tip of set the Nginx reverse proxy cache."
date: 2019-11-24 19:00:30 -0400
categories: [blog]
tags: [nginx, reverse, cache, proxy, tip]
---

## What is the Nginx reverse proxy

The Proxy is to connect another network through the server by indirect.

## Why do we need reverse proxy 

 - security
     - User doesn't know connected servers, All connections are to come into the Reverse proxy server. Users get mapping information from The Reverse proxy server. So The Reverse proxy server can hide information on the inner server from users.
 - load balancing
     - The Reverse proxy server knows the inner servers. So load balancing can be according to momentary load.

![image](https://user-images.githubusercontent.com/4101636/69491513-a6f53000-0ed9-11ea-98eb-71831c424643.png){: width="100%" }

## What if we added to this the Cache?

The Web Application service is included a static image, CSS, javascript contents. If the static contents are processed on the Nginx, the backend servers can have lessened the burden.

Also, for example, once a request needs many resources. so some service logics are needed a cache.

![image](https://user-images.githubusercontent.com/4101636/69491589-a5783780-0eda-11ea-8e26-0e3cea3899ff.png){: width="100%" }

## How to work the Nginx reverse proxy cache?

 1. Requests come into the Nginx server.
 2. Check already cached by the Key.
 3. If there is no cached(MISS), the Requested go to the backend server and get contents.
 4. The Response from the backend server is saved the cache area.
 5. Next time if the Request comes in by the same key, get the Response from the cached area. (HIT)

## How to set the Nginx reverse proxy cache?

```
proxy_cache_path /home/user/cache/nginx levels=1:2 keys_zone=select_cache_zone:10m max_size=2g inactive=15m;
proxy_cache_key $request_method$request_uri$args;

...

server {
  ...
  location / {
    proxy_cache select_cache_zone;
    proxy_cache_methods GET HEAD POST;
    proxy_cache_use_stale error timeout invalid_header updating http_500 http_502 http_503 http_504;
    proxy_cache_background_update on;
    proxy_cache_revalidate on;
    proxy_cache_lock on;
    proxy_ignore_headers X-Accel-Expires Expires Cache-Control;

    ...
  }
}
```

#### Options to check today
 - proxy_cache_path : Local disk directory path for saving the cache.
    - levels : this sets up a second-level directory hierarchy under the "proxy_cache_path"
    - keys_zone : cache area name.
        - 10m : space for saving metadata. (10m, you can increase or decrease)
    - max_size : sets the upper size limit of the cache area.
    - inactive : cache purge time.
    
 - proxy_cache_key : key of cache. (you should include $request_method, default value is "$scheme$proxy_host$request_uri")
 
The remaining options, check the [Nginx official document](http://nginx.org/en/docs/http/ngx_http_proxy_module.html).
 
### Conclusion 
 
So look at the "proxy_cache_path", the Nginx reverse proxy cache use a disk basically.
Because of this the IO access performance not good, So how to use memory in this part?

very simple. use the "/dev/shm".

The "/dev/shm" is the Ramdisk to speak simply. check my last [post](https://leekyoungil.github.io/blog/2019/09/29/About_the_dev_shm_easy_to_use_the_Linux_ramdisk.html).

If you use this, the IO access performance increase easily.
