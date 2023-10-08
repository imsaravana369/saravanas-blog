Factory Constructor in Dart — Part 2
====================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----7db2a5981ac3--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----7db2a5981ac3--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----7db2a5981ac3--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Ffactory-constructor-in-dart-part-2-7db2a5981ac3&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----7db2a5981ac3---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----7db2a5981ac3--------------------------------)·4 min read·Jun 26, 2021

\--

1

Listen

Share

In the [previous article](https://imsaravananm.medium.com/factory-constructor-in-dart-part-1-1bbdf0d0f7f0), we have discussed how we can implement a simple factory design pattern using a factory constructor. Yet we haven’t fully explored and understood the power of factory constructors. In this article, we are going to learn how we can implement caching using factory constructors.

**What is Caching?**

Caching is a method of storing data in local storage so that we can reuse it instead of doing the same computation again.

**Example**: _Your Facebook profile picture is cached in your mobile’s local storage so that it doesn’t need to be fetched from the internet all the time._

But the caching we are going to do with factory constructors in this article is quite different. We are going to cache instances inside a map.

The best example I can give for caching is **caching of different Loggers**, if you don’t know what a logger does, it is used to print messages to the console for debugging purposes. We usually have a logger for each class to print their own debugging messages preceded with their class name(so that we can identify “which message belong to which class”)

Let’s say we have implemented our own simple Logger class

This Logger class is very obvious, it has only one attribute **_name_** and only one method **_void log(String msg)_**. we will create an instance of the logger for each class by passing its class name as the parameter. But if you are creating the same instance every time(from scratch) for the same class, it’s not a good practice and also when the instance is very expensive it will cost a lot of computational time.

Example Scenario,

```
class A{  
 late final Logger \_logger;  
 A(){  
    \_logger = Logger(‘A’);  
 }  
}
```

In the main() method, let’s do create 5 instances of A,

```
main() {  
   for(int i=1;i<=5;i++){  
       print("Creating instance ${i}");  
       A a = A();  
       print(""); //newline  
   }  
}
```

The output will be

Whenever you create an instance of A, a corresponding logger instance will also be created. Is there any way we can reuse the logger instance? Yes, we have, by caching we can achieve that.

Logger class with caching enabled
---------------------------------

> **Note**: Factory constructors have no access to `this`. That’s why we have declared \_cache as **static.**

If you look at this new logger class, I have made some noticeable changes.

1.  Removed the public constructor and added a private constructor Logger.\_internal(), so that we can’t directly create an instance of the Logger class anymore.
2.  Introduced a Map ‘**_\_cache_**’ that is used for storing the previously created instances with their class name as the key.
3.  Added a factory constructor, that will decide whether to return a new instance or an already existing one.

If you run the main() method again, our output will be

As you can see the logger instance is created only for the first time when we initialize A, then it is reused for the subsequent instantiation.

How does it work?
-----------------

1.  When you first create the instance of A, it will ask the factory constructor of Logger to give it an instance of Logger with the name ‘A’.
2.  The factory constructor will look for a Logger instance with key ‘A’ in the \_cache map. Since it is the first time, it can’t find any Logger with key ‘A’. So it creates a new instance of Logger with the name as ‘A’, stores it in the map with key as ‘A’, and returns the same.
3.  For the subsequent calls, since the Logger with key ‘A’ is already existing in the cache, it will not create a new instance and return the cached instance.

This caching technique comes in very handy if the instance we need to create is very expensive(takes a lot of computational time).

You can argue that the cache itself may occupy a lot of space. Yes, you are right but there are various caching algorithms we can use to overcome this problem but if you are having only a few instances to cache, this will do.

In the next article, I will tell you the difference between a named constructor and a factory constructor, and when to prefer one over the other. Thank you.