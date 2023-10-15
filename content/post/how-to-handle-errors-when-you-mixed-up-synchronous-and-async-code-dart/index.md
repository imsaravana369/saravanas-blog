+++
title = 'how-to-handle-errors-when-you-mixed-up-synchronous-and-async-code-dart'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

How to handle errors when you mixed up synchronous and async code — Dart
========================================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----2e60d55a037f--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----2e60d55a037f--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----2e60d55a037f--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fhow-to-handle-errors-when-you-mixed-up-synchronous-and-async-code-dart-2e60d55a037f&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----2e60d55a037f---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----2e60d55a037f--------------------------------)·3 min read·Jul 2, 2021

\--

1

Listen

Share

Future is one of the most widely used data types in dart. We use them all over the place for returning network responses, for doing heavy computation, or any other asynchronous task.

Error handling in synchronous code is done with the **try-catch** block and in asynchronous code, we handle errors with the help of **catchError()**

But what happens when we have mixed up both the synchronous and asynchronous code, how can we handle it? With both try-catch and catchError()? Yes, we can do it in that way, but it will make our code messy in no time.

In this article, I will tell you how we can exactly handle errors raised from those kinds of mixed-up code.

Photo by [Munro Studio](https://unsplash.com/@universaleye?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/tangled?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

**How does a mixed-up code look like?**
---------------------------------------

If you look at the above code, the function is throwing an error synchronously and also calling a function asynchronously(line 5)

If you try to catch the error with catchError() only, you are going to run into a pitfall very soon now or then.

Let’s look at the main.dart

The error is not caught😱

Look at this short youtube video to understand how the control flows,

I indeed sound funny🤣😥

Even though we are having catchError(), the error raised from `_getPersonNameWithId()_`  is still not caught because the error is **thrown from synchronous code** and not from an asynchronous one. We know that catchError() can catch only errors raised from an asynchronous call.

How can we deal with that?
--------------------------

**1.Use async keyword (most preferred)**
----------------------------------------

Just use the **async** keyword to the function (even it’s not needed) which you feel is mixed up with synchronous and asynchronous code. This will just wrap everything inside the code as an asynchronous call. So all the errors inside it can be handled by catchError().

This function doesn’t need to be an “async” function but to handle the synchronous error it’s needed.

2\. Wrap the code with Future.sync()
------------------------------------

This works **similarly** to using the **async** keyword. But I would prefer the async keyword to Future.sync().

This is an old thing(I think). use async keyword.

3\. Use Zones.
--------------

According to the [docs](https://api.flutter.dev/flutter/dart-async/Zone-class.html),

> A zone represents an environment that remains stable across asynchronous calls.

**Not prevalently used these days**

Usually, a zone is used to catch any **unexcepted error**(non-fatal) thrown from the code(that you have no control over, source code of some third party library) and handle it without interrupting the working of other zones.

Future uses zones behind the hood, we don’t always explicitly use zones, I have given this example to let you know that we can also handle async errors using Zones.

**4\. Use await and try-catch block**
-------------------------------------

If you want your code to be blocking(synchronous), then you can use await and put that inside a try-catch block to handle those errors.

