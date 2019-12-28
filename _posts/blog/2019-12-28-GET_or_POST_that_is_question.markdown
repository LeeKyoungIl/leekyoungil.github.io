---
layout: post
published: true
title: "GET or POST, that is question."
date: 2019-12-28 19:00:30 -0400
categories: [blog]
tags: [http, get, post, method, question]
---

![image](https://user-images.githubusercontent.com/4101636/71541301-2cb54100-299a-11ea-9116-da71030360d8.png){: width="100%" }

## Before this post begins.

This post is from '[homoefficio.github.io](https://homoefficio.github.io/2019/12/25/GET%EC%9D%B4%EB%83%90-POST%EB%83%90-%EA%B7%B8%EA%B2%83%EC%9D%B4-%EB%AC%B8%EC%A0%9C%EB%A1%9C%EB%8B%A4/?fbclid=IwAR0P4GM-aR9dv0bNMi9RV1gmQ6fgtXNDonsT0HPmSZKdwjzAUAoLfBphqNY)' blog.
I translated from Korean to English.

---

There are some conclusions in this post. But these are not the perfect answers.
Also, this post doesn't talk about the REST, talk about the content of the HTTP method only.

## Question

Generally, When requesting a new resource over provide the contents by the client side, You can send by the POST with include the contents. 

But, The client side did not provide contents to the server, just response some resource from the server, actually, the server is a response by generating new resource in this case, Do we have to use the GET or POST?

For example, if the client is requested to the server by empty contents.
In other words, If the client doesn't matter about whether the returned quiz is a new one or an existing one.

 - GET send '/quizzes/new’ (It is the GET but the Server takes care of generating a new one.)
 - POST send with empty contents ‘/quizzes' (It is the POST but the Server return generating a new one.)

Which is a better way, the GET or POST method? or, what is a better way?
I collected some stories about this issue.

## Opinion to use the POST method

 - The GET, If it can keep idempotent. the POST if not. That is a precondition. So, if a new quiz is generated, that is not idempotent. the POST is correct.

 - Explicitly, The URI must be for a type of resource. If the Client request missing resources then must be returned the HTTP status 404 not found. I think it seems like we must be using the POST because the server needs to generate and return a new resource.

 - I don't use the GET to change the DB status. If we use the GET then keep idempotent like a pure function.

 - The POST, PUT, DELETE was born out of after the HTTP 1.0 version. That is control of the inside of the server. Because. If there is some change in DB, always used the method of change of the status. (in terms of resource side, DB is a part) The method area in the HTTP protocol, that is whether, it's the server or client side, people can see it differently. But if we think about the history of the HTTP, the method is related to resource and the weight is placed on the server side owned the resource.

 - The POST is correct. GET path of generated resource put the location header and to returns 201 code of HTTP seems to be correct.

## Opinion to use the GET method

 - The Client just wants the only a quiz, does not have to worry about a new one or existing one. There is only a meaning about the read side.

 - The Client doesn't know is this new one or existing one, firstly they want to get a quiz so the GET is correct. For example, there is a bakery. in the act of buying bread, this is the same behavior whether you buy an existing one or a new one. (GET) I want to buy this bread make please or if you make this bread, I will buy it. (POST) this is another purpose and the bakery should take another action accordingly.

## Not both Opinions.
 
 - The API should be behavior oriented, not status oriented. I learned this knowledge from OOP and DDD.
 
## Let’s take a break
 
It is very confusing. And the difficult keyword is also called 'idempotence'.
To sum up. We can summarized as follows.
  
  - Prefer the GET. Considering the intent of the client side of the requester.
  - Prefer the POST. The HTTP is a resource. So, considering the intent of a resource.
 
## What is a specification.
 
At this point. We have to check the HTTP/1.1 specification. The related specification is '[Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content](https://tools.ietf.org/html/rfc7231)'. And of them, all about the HTTP method is [here](https://tools.ietf.org/html/rfc7231#section-4).

To summarize the opinion of support to the POST. 

 - If change the resource must be the POST method.
 
So, there is that content in the specification?

## Safe Methods

There is the **Sage Methods** content in the specification.

```text
Request methods are considered “safe” if their defined semantics are
essentially read-only; i.e., the client does not request, and does
not expect, any state change on the origin server as a result of
applying a safe method to a target resource. Likewise, reasonable
use of a safe method is not expected to cause any harm, loss of
property, or unusual burden on the origin server.
```

If change a resource. We must not use the GET.
But there is some different content in the next contents.

```text
This definition of safe methods does not prevent an implementation
from including behavior that is potentially harmful, that is not
entirely read-only, or that causes side effects while invoking a safe
method. What is important, however, is that the client did not
request that additional behavior and cannot be held accountable for
it. For example, most servers append request information to access
log files at the completion of every response, regardless of the
method, and that is considered safe even though the log storage might
become full and crash the server. Likewise, a safe request initiated
by selecting an advertisement on the Web will often have the side
effect of charging an advertising account.
```

## Conclude

As I said before. There is a subjective conclusion in this post, that is not the perfect answer.

I think we can use the GET.

The reason is...

 - The API is a contract of two sides.
 - If The Client just wants only the get of some resource.
 - Even if included the non-idempotence process at the generated resource in the Server side.
 - There is no problem with the specification, about in the act of 'GET' by the Client side rater than the Server processing.
 
Moreover if supposing the next situation, I think the GET is better.

Firstly the quiz generates and to returns at the request of the Client. And it is the resource generates so will be the POST.
Later, If quiz service succeeds, begin having problems with the server side performance issue. So, we think need to precompose quiz and just use it. At this time the resource generate does not occur and has to use the GET.

Client requirements did not change. But the server side processing has to change from a resource generate to existing resources.
Do we have to change the API from the GET to the POST in this situation? And we can persuade to change method to the POST? At first, if we made it the GET. we could avoid this situation.

And so if we think about it. When we make the API, like 'Information Hiding' more generally higher level design principle is more important.

## Addition consideration

After posted this article. I received some comments.

 - In this issue, the User Interface and actually the HTTP client has to separate and judgment. The User Interface is of course just want to get resources. And the HTTP client(server side) will be thinking, there is no problem to generate resources in the server side process. (So, the Inner HTTP client is to generate resource by the POST and get the resource by the GET again.)
 - If resource generated by the POST, it returns an id and how about get the resource as the id?
 
Both are similar opinions. If the client is not interesting to generate resources. if generate resources is right, firstly generate resources by the POST and get generated resources by the GET.

As I said, My opinion remains unchanged. (the GET is better) The reason is first beginning to generate quiz and will be likely to change to the read. The GET is very flexible because the client's intention is more important than resources.

The reason for wrote more opinions. Because I'm worried that someone always thinks that the GET is better.

If it will be don't change to read later. as mentioned earlier, to use the POST + GET method. But if we want to decrease even one the HTTP request. Use the GET is better.

Eventually, this post does not the perfect answer. It is just only a reference, You can have to choose in a situation.  