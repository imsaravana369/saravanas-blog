+++
title = 'effectfnaff-lets-create-async-foreign-functions-in-purescript-exploring-purescript-modules-3'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

EffectFnAff — Let’s create Async Foreign Functions in purescript — Exploring purescript-modules #3
==================================================================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----b0e168547851--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----b0e168547851--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----b0e168547851--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Feffectfnaff-lets-create-async-foreign-functions-in-purescript-exploring-purescript-modules-3-b0e168547851&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----b0e168547851---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----b0e168547851--------------------------------)·3 min read·Oct 5, 2022

\--

Listen

Share

This is my third article in the series **_#exploring-ps-modules._** In this article we will be exploring a very cool purescript module.

Let’s accept it, we can’t do all the things with purescript alone sometimes we need the help of javascript, for that purpose we use FFI(Foreign Function Interface) which enables communication from PureScript code to JavaScript code, and vice versa.

Photo by [Adrien CÉSARD](https://unsplash.com/@adriencesard?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/bridge?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Let’s say you want to implement `Euclidean algorithm` for finding GCD of two numbers, but you don’t want to write it in purescript so you create the function in JS.

```
//example.jsexports\["gcd"\] = function (a){  
  return function(b){  
        //.....   
        return result;  
    }  
}
```

Then we foreign import it from purescript side

```
//example.purs  
foreign import gcd :: Int -> Int -> Int 
```

This is quite straight forward. But have you tried foreign importing a async function?

```
foreign import myAsyncGCDFunction :: Int -> Int -> Aff Int
```

Can we use `Aff`as the return type for foreign imports?

No we can’t do that. Why? Because Aff is a complex purescript data structure it’s not just a plain function that we can return from JS.

For these kind of use cases we have a special type called `EffectFnAff` which will let us create a purescript interface for async javascript functions.

For demonstration purpose, we will create a async function `addWithDelay` that will take two integers and return the result after 1 second.

```
function adddWithDelay(a,b) {  
   return new Promise((resolve, reject) => {  
           setTimeout(() => resolve(a+b) , 1000);  
          });  
}
```

> **Note:** I’m not importing this function

How can we convert this to a foreign function that is compatible with purescript?

Okay, let’s understand the above function by dissecting it piece by piece.

**Line 4:** `EffectFnAff` will give us two callbacks `onError` & `onSuccess.` One can be called with an error, the other can be called with the actual value that our function has to return.

**Line 8:** We are calling `onSuccess` with the result of the promise that is `r`

**Line 10:** EffectFnAff needs to return a canceller which is just a function that takes 3 arguments, the first one being the `error` that is responsible for triggering the canceller, the second argument is a function that will get called if we can’t cancel the operation, the third one is a function which we have to call when we are done with cancelling the async operation (like clearing resource, closing db connection etc).

In the above example, we are not handling any cancellation errors we are directly calling `onCancelerSuccess()` to tell that we have cancelled the operation successfully.

Now that we understood how to write `EffectFnAff` from JS side, let’s create an interface from purescript side so that we could make use of it.

```
foreign import addWithDelay\_ :: Int -> Int -> EffectFnAff Int
```

Having foreign imported the function, we have to write another purescript interface that could convert this “not of any use” `EffectFnAff` to `Aff.` If you are searching on [pursuit](https://pursuit.purescript.org/packages/purescript-aff/7.1.0/docs/Effect.Aff.Compat#v:fromEffectFnAff) for a function that converts `EffectFnAff -> Aff` then you will find a function named `fromEffectFnAff`

```
addWithDelay :: Int -> Int -> Aff Int  
addWithDelay a b = fromEffectFnAff $ addWithDelay\_ a b
```

Yes, my friend, thats all it takes to convert your beautiful async function to an `Aff` which you can use from purescript side.

**Bonus**
---------

If you are interested to see how the canceller of `EffectFnAff` works, just kill the `Aff` that will call the canceller automatically.

Hope you’ve liked the article and learnt how we can make a bridge between async Javascript and Purescript.

