Better Error Handling with Either type in Dart
==============================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----b91bef20d716--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----b91bef20d716--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----b91bef20d716--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fbetter-error-handling-with-either-type-in-dart-b91bef20d716&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----b91bef20d716---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----b91bef20d716--------------------------------)·3 min read·Jun 29, 2021

\--

3

Listen

Share

Have you ever wondered “Is there any Wrapper class that can wrap both the good response and the bad response into a single type?” If you’ve never wondered that, let me explain why it’s a handy feature.

Let’s consider we have these two classes,

*   The Failure class is a class we return when some exception occurs.
*   The Person class is the model class that we want to return when we have a valid response.

Let’s say we want to wrap both of them in a single class, how can we do that? Here’s a very naive approach.

Here's how we can use it,

This class is cool. What’s the problem with this🙄? Let us understand

*   The response object **can have both the person and failure attributes** initiated at the same time. This is surely not the behavior we want. It should hold either a Person or a failure. Both of them shouldn’t exist at the same time.

```
 Response res = Response(failedReponse); res.person = validResponse; //now 'res' has both person and failure
```

*   You may forget to check the error.

```
void main(){  
    Failure failedReponse = Failure('something went wrong');    
    Response res = Response(failedReponse); //still valid, compiler doesn't complain, but prints 'null'  
    print('Response : ${res.person?.name}');  
}
```

So we need something,

1.  To Make sure only one type is available at the same time.
2.  To Enforce the error handling (make the compiler complaint).

Dartz Package
-------------

Dart doesn’t have any built-in type to make these happen but we have [_dartz_](https://pub.dev/packages/dartz)**_,_** _a_  _functional programming_ package in dart. It supports a type **Either<Left, Right>** that meets our exact use-case.

First, add the [package](https://pub.dev/packages/dartz/install) to your **_pubspec.yaml_** file,

```
dependencies:  
  dartz: ^0.9.2
```

What is the Either Type?
------------------------

The `Either` type is used to represent a value that has any one of the two specified types. It is common to see `Either` used to represent a success value or a failure value, although that doesn't have to be the case.

```
Either<int, String> response = Right("Hello, im right");
```

This is how simple it is to use Either(), you declare the Left and Right type inside the generic type parameters in the respective order.

To assign value use `Left(value)` or `Right(value)` . In the above code, I specified `_Right(“Hello, im right”)_` to put the String as the Right value, in this case, the Left value will be empty (the integer value is empty).

The fold method here is responsible for handling both the values, if the left value is available, it will call the first callback method `print(‘Integer : $integerValue’)` , otherwise, it will call the second callback `print(‘String : $stringValue’)`

This is exactly what we wanted, we want to have

1.  Only one of the values to be available at a time.
2.  Corresponding actions should be taken only after evaluating the availability of both the Left & Right values.

**Error handling with Either**
------------------------------

Now let’s use the power of Either to restructure our **Response** model class.

We no more have two separate instances for Failure & Person. We combined both of them to a single instance **_‘person’_** using Either Class.

Here we must handle both of the cases for Failure & Person object using fold(), otherwise, our code won't compile.

**What we did with Either is,**

1.  We made sure only one type is available at any point in time.
2.  We made sure the error is always handled.

I have used very simple examples to explain the concept of Either type but it is quite powerful💪 to solve many complex problems. There are many other types and functions in dartz package which make a flutter developer's life easier🤗. I will try to cover them in the subsequent articles.

If you’ve liked this article, please give a thumbs up 👍 and I will meet you with another Dart article. Thank you🙏 and Happy learning.