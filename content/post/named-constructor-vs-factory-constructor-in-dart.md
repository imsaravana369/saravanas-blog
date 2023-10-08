Named Constructor vs Factory Constructor in Dart
================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----ba28250b2747--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----ba28250b2747--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----ba28250b2747--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fnamed-constructor-vs-factory-constructor-in-dart-ba28250b2747&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----ba28250b2747---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----ba28250b2747--------------------------------)·3 min read·Jun 28, 2021

\--

2

Listen

Share

This is also one of the most confusing topics for dart beginners and also for people who are new to object-oriented programming. They are like **_“why do we need all these?”_**  **_“Both of them look almost similar” “when should I prefer one over the other?”_** If you have any of these doubts I’m here to solve that riddle.

**_When we invoke a Constructor?_**
-----------------------------------

We invoke a constructor when we need an object of the class. Sometimes we don’t care whether it’s a new instance or a pre-existing instance or a sub-type instance, all we need is an instance that is **compatible** but sometimes, we need a **new instance and of the exact type**(not above not below). This is where the difference between the two constructors lies. If you don’t understand that, let me explain it more clearly.

**Named Constructor**
=====================

A named constructor is nothing more than a constructor with a name. You may ask why we need a constructor with a name?

If you are from any other object-oriented programming languages like Java, C++, you can write a class with more than one constructor as long as the arguments differ. Sadly we don’t have the feature in Dart😥but Named constructor has our back😃 and I think it is much better than those overloaded Constructors of Java, C++, etc.

Let’s look at an example

In this example, we are creating a named constructor fromJson() that accepts a map as its parameter and generates an object from the map.

We can also move the JSON decoding logic to the class itself,

As you can see from **line 5,** we are using the named constructor similar to a normal constructor but with a name.

**What’s the use of Named Constructor?**
----------------------------------------

1.  **Improves Readability,** as you can see the Person.fromJson() constructor makes it very obvious that we are creating an instance from a JSON.
2.  **Supports Overloaded Constructors,** now we can have as many constructors we need for our class.
3.  It always **returns a new Instance of the exact type**(Person in this case)  like a default constructor.

**_Factory Constructor_**
=========================

I have already written two articles([part-1](https://imsaravananm.medium.com/factory-constructor-in-dart-part-1-1bbdf0d0f7f0), [part-2](https://imsaravananm.medium.com/factory-constructor-in-dart-part-2-7db2a5981ac3)) on this topic. So I’m going to briefly talk about this one.

We use factory constructor when we want to

1.  Decide which instance to return on runtime([_see this article_](https://imsaravananm.medium.com/factory-constructor-in-dart-part-1-1bbdf0d0f7f0))
2.  Cache instances for reusing purposes.

So having read about both of them, let’s understand what’s the real difference between them

1.Access to instance members
----------------------------

*   A named Constructor has access to **_this_** _keyword so it can access any member variables and methods._
*   Factory Constructor is static so it has no access to **this** keyword.

2\. The Return Statement
------------------------

*   Named Constructor works like a normal constructor, it need not return an instance explicitly. (No need for return statement) have you ever seen a constructor with a return statement at the end?
*   Factory Constructor should return an instance explicitly. See all the factory constructors, there’s always a return statement at the end.

3\. Type of instance returned
-----------------------------

*   A named constructor can only generate the instance of the current class.
*   A factory constructor can decide which instance to return on runtime, it can return either the instance of the current class or any of the instances of its descendants class.

4\. New or Old instance
-----------------------

*   This may be a trivial point, but the named constructor will always return a new instance.
*   Factory constructor can return a new instance or a cached instance based on our implementation(more on this [here](https://imsaravananm.medium.com/factory-constructor-in-dart-part-2-7db2a5981ac3))

I hope, now you are very sure when to prefer the one over the other. Give a thumbs up👍 to this article if you liked it and you can also share your ideas in the comment section. Thank you.