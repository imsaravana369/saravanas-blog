+++
title = 'unit-testing-streams-in-dart-flutter'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Unit Testing Streams in Dart/Flutter
====================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----6ed72c19f761--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----6ed72c19f761--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----6ed72c19f761--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Funit-testing-streams-in-dart-flutter-6ed72c19f761&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----6ed72c19f761---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----6ed72c19f761--------------------------------)·5 min read·Jul 9, 2021

\--

1

Listen

Share

Stream is one of the building blocks of asynchronous programming in dart. We may not deal with them directly most of the time, but they are working under the hood for many features like Bloc,changeNotifier provider, etc. But sometimes we need to create our own streams, so we need to learn how we can unit test streams. That’s what we are going to see in this article.

Photo by [Rahul Dey](https://unsplash.com/@dynamo10?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/streams?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Since this article is only about unit testing streams, I will just specify the classes that provide streams service to our app.

**What does our simple app do?**

It will just run the counter either in ascending order or descending order according to the switch we have selected.

Let’s create an interface for our counter

counter.dart
------------

```
abstract class MyCounter{  
  Stream<int> countStream(int bound);  
}
```

This creates a contract that the classes implementing MyCounter will **override the countStream() method**.

We will be having two implementations for the interface Mycounter

**1.Forward Counter**

2\. Reverse Counter

Now we are done with the setup, let’s write tests

flutter\_test Dependency
------------------------

We don’t want to add any extra dependencies by ourselves for unit testing since flutter has it already baked in. Make sure you have `[flutter_test](https://api.flutter.dev/flutter/flutter_test/flutter_test-library.html)` in your pubspec.yaml **under your dev\_dependencies.**

```
dev\_dependencies:  
  flutter\_test:  
    sdk: flutter  
  //other dependencies
```

Create test files
-----------------

We usually write the test under the `test` folder, there are some conventions that developers usually follow while writing tests

1.  The structure of your `test` folder should be as same as your `lib` folder.
2.  All the tests must end with `*_test.dart ,`it's not only a convention, it helps flutter to identify those dart files as tests.

Let’s test one of our MyCounter implementations `reverse_counter.dart` and go through them one by one

We have written 4 test cases, let’s go one by one

1.  **emitsInOrder()**

> **emitsInOrder() —** This method makes sure the values are **emitted in the exact same order** as we specified.

*   **_Why do we use emitsInOrder() in the above code?_** — we are testing if the values emitted from the stream are `3->2->1->0` in the decreasing order.
*   **_How to use it?_** — The emitsInOrder() takes `Iterable matchers` as argument. That why we are passing a list of matchers to the method.
*   We could’ve passed `emitsInOrder([ equals(3), equals(2), equals(1),equals(0)] )` but it is not needed since we don’t want to explicitly use _equals()_.
*   **_When we use emitsDone?_** — We use this matcher if we want to verify all the values emitted from the stream are in the exact same order as we specified.
*   If we want to verify all the values are emitted without considering the order, then we can use **_emitsInAnyOrder(Iterable Matcher)_**

> `[_emitsInAnyOrder()_](https://pub.dev/documentation/test_api/latest/test_api/emitsInAnyOrder.html)` works like emitsInOrder(), but it allows the matchers to match in any order.

*   To match only one event use **emits(matcher)** — This is the most simple one and using this only all other complex Streammatcher are build.

2.emitsThrough() & emitsDone
----------------------------

This test looks similar to the first one, right? But not exactly!

emitsThrough
------------

> **emitsThrough (matcher)** — This consumes all events matched by \[matcher\], as well as **all events before**. If the stream emits a done event without matching the\[matcher\], this fails and consumes no events.

*   **_Why do we use emitsThough(0) in the above code_?** — It  consumes all the values until 0( equals(0) ) is matched. So it will consume `3->2->1->0`
*   **_When we use emitThough()?_** — when we don’t care about the values emitted before the value that is matched with the \[matcher\]. In the above test, we don't care about the values 3,2,1.

emitsDone
---------

> **emitsDone —** This matcher is used to verify whether the stream has no more items left. (The stream is Done)

*   _why do we use_ **_emitsDone_** _in the above code_? — we used it to make sure **no other values are emitted after the last value ‘0’** is emitted.
*   _When we use emitsDone_? — To make sure the stream has no other values left to emit.

3.ExpectAsync()
---------------

> **ExpectAsync1(callback) —** This function is used to wrap a callback(with one parameter) and make sure the test framework to keep waiting until the callback is called \[count\] times. If it is not called \[count\] times or any matcher fails(within the callback), the test will fail.

> There are many variation of expectAsync() based on the parameters to the callback like expectAsync2(),expectAsync3(),…expectAsync6()

*   **_why do we use ExpectAsync1(callback) in the above code?_** _—_ we want our callback to **_run exactly four times_** _(which we specified in the_ **_count_** _keyword argument)_ and also we want to check whether all the values emitted are between the range 0 and 3 inclusively(including both the end values 0 & 3).
*   **_When we use ExpectAsyncN(callback)? —_** _When we want to validate all the values passed to the callback comply with the same matcher and to make sure the callback is called exactly called \[count\] times._

4\. neverEmits
--------------

> **neverEmits(innerMatcher)** — This matcher is used to check if the stream has not emitted any value that matches the inner matcher.

*   **_why do we use neverEmits(isNegative) in the above code?_** _— We used to check whether our stream hasn’t emitted any negative values._
*   **_When we use neverEmits(innerMatcher)? —_** _When we want to ensure not any abnormal values(according to our business logic) are emitted from our stream._

Testing Non-deterministic Behaviours
====================================

All the above behaviours are deterministic,

> Deterministic — for a given input, the outputs are always same. In our case, when we pass 3 to our reverse stream, it will always yield 3->2->1->0.

How can we test non-deterministic behaviours, flutter got us covered. We can use `[mayEmit(](https://pub.dev/documentation/test_api/latest/test_api/mayEmit.html)) or [mayEmitMultiple(](https://pub.dev/documentation/test_api/latest/test_api/mayEmitMultiple.html)),` for those behaviours. Let’s understand them with an example.

Let’s create another implementation of the MyCounter interface called **SurpriseForwardCounter**, which works like ForwardCounter but sometimes may print a random number at the end(a non-deterministic behaviour).

This class is the same as ForwardCounter but we have introduced some randomness at the end.

But wait. How can we test that? Let’s see

1.mayEmits()
------------

> mayEmits(matcher) — This matcher will always succeed, it will consume the value from the stream if it matches the \[matcher\] otherwise not.

*   **_why do we use_ mayEmits(matcher) _in the above code? —_** _Since the stream may not always emit a random value at the end, we have used mayEmit() to consume the random value only if it's emitted without failing the test case._
*   **_When we use_ mayEmits(matcher)_? —_** _When we want to consume a value only when it is matched with the \[matcher\], if not proceed without failing the test case. It is used to deal with non-deterministic behaviours._

> mayEmitMultiple(matcher) — works like `mayEmit()`, but it matches events against the matcher as many times as possible.

> **Scenerio** — When you replace the  `**if**(random.nextBool())` statement of SurpriseForwardCounter with `**while**_(random.nextBool())_.` Then the counter can emit values like _0->1->2->3->random value1 -> random value2 -> … -> random valueN, until the random boolean becomes false. In those scenario we must use mayEmitMultiple() to consume all the random values._

I’ve covered most of the topics regarding unit-testing streams. To explore more you can check out this [official document](https://pub.dev/packages/test) of the test package.

