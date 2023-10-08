What do they mean by Monad?
===========================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/?source=post_page-----76e856220893--------------------------------)

[Saravanan M](https://medium.com/?source=post_page-----76e856220893--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fimsaravananm.medium.com%2Fwhat-is-a-monad-76e856220893&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----76e856220893---------------------post_header-----------)

6 min read·Nov 6, 2022

\--

Listen

Share

Today I’m going to answer a question that I asked myself and everyone when I entered functional programming. I didn’t get any answer that really explained what a monad is? why we need it? ,in simpler terms, that I could grasp as a beginner.

As time passed and having worked and read a lot about what monad is , from different forums and articles, I figured out how someone could’ve explained it to me when I was beginner, such that my then-newbie-self(still a newbie) would’ve understood and could’ve made sense of the articles that I read about monads.

> Note: This article doesn’t dive deeper into how monads are implemented, this article is more about the `why & what` than the How?

To understand monad, you want to understand two things,

1.  Why Sequential Computation matters in FP
2.  What is Context, in context of Monads😜

Photo by [Bradyn Trollip](https://unsplash.com/@bradyn?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/domino?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Understanding Sequential Computation
------------------------------------

It is a type of computation where the instructions are executed in sequence and instruction in one line may consume the results from the previous lines.

```
//sequential code, where B wants the value of A, C want both A and B  
let A = 5;  
let B = A + 5;   
let C = (A + 42) + (B + 3);
```

Why Sequential Computation matters in Functional Programming
------------------------------------------------------------

So, let’s start with a question. How can you do sequential computation in functional languages ?

You may say function composition, yes, a valid answer but not the exact one.

Consider we have these three functions,

```
firstFunction :: INITIAL\_VALUE -> RESULT1secondFunction :: RESULT1 -> RESULT2thirdFunction :: RESULT2 -> RESULT3
```

> **Note** : For folks who are unfamiliar with the above syntax, `_firstFunction_` takes `_INITIAL_VALUE_` as input & returns `_RESULT1_` as output and so on.

Now we can compose the three functions as ,

```
myComposedFunction :: INITIAL\_VALUE -> RESULT3  
myComposedFunction = thirdFunction . secondFunction . firstFunction
```

> Note: This is a [Haskell syntax](https://medium.com/p/76e856220893/edit), using dot operator, just like in high school maths.

**Question: If thirdFunction also wants the RESULT1, how can we do that with functional composition?**

No, it can only access the result of 2nd function’s output. I.e, We can’t store the intermediary values with function composition.

It’s like a sequence of interconnected pipes, the outflow of one pipe directly goes to the next subsequent pipe, we can’t store the outflow of one pipe somewhere and let the other pipes access it whenever they needed it.

But we can do some hacks,

```
firstFunction :: INITIAL\_VALUE -> RESULT1secondFunction :: RESULT1 -> (**RESULT1**,RESULT2)thirdFunction :: (**RESULT1**,RESULT2) -> RESULT3
```

Hola!! By modifying the output of `secondFunction` and input of `thirdFunction` , we have managed to achieve our goal of making the `firstFunction` result available to `thirdFunction`

**Headache**: Now consider you have 100 functions, and your last function(100th function) wants to use the first function result… Just for that you have to pass that down 99 levels. It’s huge amount of boiler plate code we have to write.

So, we cant really do sequential computation with Functional composition alone.

That is where `let` bindings come into play, we can use them to store intermediary values.

```
myComposedFunction initialValue = do   
   let result1 = firstFunction initialValue  
   let result2 = secondFunction result1  
   let result3 = thirdFunction result1 result2  
   result3
```

Using Sequential computation we can code a program where instruction in one line may consume the results from the previous lines.

With plain functional composition we can’t do sequential computation, we need a mechanism to store the intermediary values and `let` binding let us do that.

To solve real world problems, we want sequential computation as most of the things happening around us come under cause and effect.

Hope you’ve understood what is Sequential Computation and why it matters in functional programming.

**Understanding Context**
-------------------------

Let’s consider two monads, Array and Maybe (yes they are monads).

> **Array String** — zero or more values of String
> 
> Maybe String — zero or one value of String

Here the underlying value is `String` for both the cases, but the context they are wrapped in (Array & Maybe respectively) are different.

If a String is wrapped in IO, `IO String` , then we could say that String is made available after doing some side effect operation, like fetching from DB, reading from file, input from user etc.

Context `m` represent a structure in which a value `a` is wrapped in at any particular time.

I hope you have understood what context is, in context of functional programming.

Putting it together
-------------------

Monads, let us do sequential computation with values that are wrapped in a context `m`. Okay, article over !!

Consider the same functions, but their return type is now wrapped in some context `m`

```
firstFunction :: (Monad m) => INITIAL\_VALUE -> **m** RESULT1secondFunction :: (Monad m) => RESULT1 -> **m** RESULT2thirdFunction :: (Monad m) => RESULT2 -> **m** RESULT3
```

> Note: `(Monad m)` means `m` is of type class `Monad`

If you take a close look, we can’t pass output value of one function directly to the next function as the output values are now wrapped in a monadic context.

To do that, we use something called Monadic Bind

The signature of monadic bind is,

```
(>>=) :: m a -> (a -> m b) -> m b
```

> m a — A value \`a\` wrapped in a monadic context \`m\`.
> 
> (a -> m b) — A function that can take a value \`a\` and can yield a value \`b\` wrapped in the same monadic context \`m\`
> 
> The word \`same\` is very important here

```
myMonadComposedFunction :: (Monad m) => Int -> m String  
myMonadComposedFunction  i =   
     (firstFunction i >>= secondFunction >>= thirdFunction)
```

Imagine monadic bindings like a sequence of pipes, where each pipe can take a value `a` and can yield another value `b` wrapped in monadic context `m` , and between every pipe there’s a filter that convert `m a` to `a` , can you answer why we need those filters?

Okay moving on to our old use case where our `thirdFunction` also wanted the result of `firstFunction` as an argument.

Can we do that with `let` bindings? No… Because if we `let` doesn’t know how to unwrap the value `a`within the monadic context, so it will store the whole thing `m a` , but that’s not we want right?

We could store create intermediary values in variables with the help of `do` notation, which is a syntactic sugar 🍙 of monadic bind.

```
myFunction :: Int -> IO String  
myFunction  i =  do   
     result1 <- firstFunction i  
     result2 <- secondFunction result1  
     result3 <- thirdFunction result1 result2  
     result3
```

You can see the above code is very similar to how we write sequential code in imperative languages like C or Java.

Even though our functions return values wrapped in context `m` , using the symbol `<-` , we are able to unwrap the value `a` from `m a` and store them in the corresponding variable in their purest form(without the context).

The great thing about monad is that you can’t escape the context that you are working on, let’s say you are working on a context `m` , say Maybe, you can’t bind it with another context `m’` , say IO.

If you try to squeeze in a function like the one below, it will fail

```
fourthFunction :: RESULT3 -> m' RESULT4 
```

we can’t compose `fourthFunction` with any of the above 3 functions, as they run on different monad `m`

I’m iterating it once again, Monads, let us do sequential computation with values that are wrapped in a context `m`.

Once you understood, why sequential computation matters and what a context means, then you could make sense of most the articles written about monads.

You may not have understood completely what a monad is, but as you read different articles and work more with them, one day the aha moment will arrive and everything will start making sense.