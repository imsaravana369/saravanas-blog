+++
title = 'unlocking-efficiency-exploring-the-st-monad-for-imperative-code-in-purescript'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Safe Local Mutation : ST Monad in Purescript
============================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----e66d6c5b8393--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----e66d6c5b8393--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----e66d6c5b8393--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Funlocking-efficiency-exploring-the-st-monad-for-imperative-code-in-purescript-e66d6c5b8393&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----e66d6c5b8393---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----e66d6c5b8393--------------------------------)·5 min read·May 20

\--

Listen

Share

Immutability is widely recognized as one of the major strengths of functional programming languages like Purescript and Haskell.

However, when attempting to write a factorial function without any form of recursion or folding, you may find yourself challenging this very notion.

Immutability, at times, can be more of a burden than a benefit.

Disclaimer : If used correctly…

So can we fall back to the good old mutable variable and write some thing similar to the below python code.

```
def factorial(n):  
  res = 1  
  for i in range(2,n+1):  
     res = res \* i  
  
  return res
```

How can you do re-assignment in Purescript?

The answer that might have recently crossed your mind is [Ref](https://pursuit.purescript.org/packages/purescript-refs/6.0.0/docs/Effect.Ref#t:Ref).

For people who don’t know `**Ref**` , it represents a mutable reference, allowing for  **_mutable state operations_**.

Does our pursuit of breaking free from the immutability paradigm finally reach a conclusion?

**_Not exactly._**

Even though `Ref` provides us with a way of doing immutable state operation, we want an `Effect` context to use `Ref` . Consequently, the type signature of our factorial function would change from `Int -> Int` to`**Int -> _Effect_ Int**`

Is it logical to enclose our factorial function within Effect when there are no apparent [side effect](https://medium.com/nerd-for-tech/what-are-side-effects-in-programming-51f7ef340f98) operations being performed within the function?

So whats the solution?

**ST Monad**
------------

Meet `[**_STRef_**](https://pursuit.purescript.org/packages/purescript-st/6.2.0/docs/Control.Monad.ST.Internal#t:STRef)` a more safer and a pure alternative of `**Ref**`

According to pursuit, the official [Purescript](https://pursuit.purescript.org/packages/purescript-st/6.2.0/docs/Control.Monad.ST.Internal#t:STRef) documentation site

> The type \``**STRef r a**`\` represents a mutable reference holding a value of type \`a\`, which can be used within the \``ST r`\` effect.

I want you to read the definition again, especially the last sentence

> “… within the `ST r` effect”

So we are not inside `Effect` Monad anymore but what is this `ST r` ?

Let’s again see what pursuit is telling,

> The \``ST`\` type constructor allows _local mutation_, i.e. mutation which does not "escape" into the surrounding computation.

**_“Local Mutation_**” is the aspect that makes STRef safer than Ref. While a comprehensive understanding of this topic would require a [separate article](https://ghc.gitlab.haskell.org/ghc/doc/users_guide/exts/impredicative_types.html), our current focus is on exploring how it can be utilized rather than delving into its inner workings.

But in a nutshell, `**ST**` acts as a container that facilitates mutation operations through the use of STRef.

`**ST**` and `**STRef**` are closely associated and often used together to enable mutable state operations within a controlled context.

Available Functions
===================

The `[Control.Monad.ST.Internal](https://pursuit.purescript.org/packages/purescript-st/6.2.0/docs/Control.Monad.ST.Internal)` module provides a variety of functions that can be utilized for constructing programs using the ST monad.

Let’s not burden ourselves and check out just a handful of functions from the module.

*   **_new_** —function to create a mutable variable

*   **_read_** — function to read value from the mutable variable.

*   **_write_** — function to write value into the mutable variable

*   **_run_** — function to execute our `_ST_` monad and extract the value that it returns (more on it in below section)

Writing Factorial function with STRef
-------------------------------------

“Enough, Show me the code” must be on your mind right now. So let me write the code…

First let’s write code for factorial of 5 and then move on to a generic solution.

```
def factorialOf5():  
    acc = 1  
    acc = acc \* 2  
    acc = acc \* 3  
    acc = acc \* 4  
    acc = acc \* 5  
    return acc
```

The corresponding Purescript code will looks like,

```
factorialOf5 :: forall r. ST r Int  
factorialOf5 = do  
    acc <- new 1 --- creating mutable variable \`acc\` with initial value as 1  
    \_ <- modify (\\prev -> prev \* 2) acc  
    \_ <- modify (\\prev -> prev \* 3) acc  
    \_ <- modify (\\prev -> prev \* 4) acc  
    \_ <- modify (\\prev -> prev \* 5) acc  
    read acc
```

*   The `**modify**` function accepts two arguments: the first argument is a function that modifies the value of a mutable reference passed as the second argument.

It returns the new value, thats why we are discarding it using underscore (you can also use \`void\`)

*   Finally we have to return value stored in `acc`. The final line `**read acc**` does this.

Note the signature of our `_factorialOf5_` function is `**ST r Int**` . How can we get a **_pure_** **_Int_** value out of it.

Remember the `**run**` function that we have seen before ?

```
\--- run          :: forall a. (forall r. ST r a) -> a  
\--- factorialOf5 :: forall r. ST r Int  
  
computeFactorial :: Int  
computeFactorial = run factorialOf5
```

Our function remains pure, yet it accommodates the use of mutable references. Isn’t it cool?

But how can we make it generic like the below python code.

```
def factorial(n):  
    acc = 1  
    for i in range(2,n+1):  
        acc = acc \* i  
          
    return acc 
```

_Control.Monad.ST.Internal_ offers a range of pre-defined looping functions such as `while, for, and foreach`

Let’s see how we can write the “actual” factorial function with the `for` function provided by the module.

```
factorial :: forall r. Int -> ST r Int  
factorial n = do  
    acc <- new 1 -- creating the ref  
  
    for 2 (n + 1) \\i -> do  --- looping from 2 to n  
      \_ <- modify (\\acc\_val -> acc\_val \* i) acc --- updating the value   
      pure unit  
  
    read acc --- returning the value
```

The `**for**` function executes the given computation (third argument) for a range of integers starting from the first argument (inclusive) up to the second argument (exclusive).

In our case, it runs `acc = acc * i` where i = 2 to n

Final step is calling the **_run_** function,

```
computeFactorial :: Int -> Int  
computeFactorial n = run (factorial n)  
  
\>>> computeFactorial 5  
\>>> 120
```

> Task : Try doing `run $ factorial n` and figure out why it’s failing.
> 
> Question: Can you store `**_STRef_**` in a state and use it again? Can you even get it outside the ST Monad? [Try this](https://try.purescript.org/?code=LYewJgrgNgpgBAWQIYEsB2cDuALGAnGAKEJWAAcQ8AXOABQKgjCJPMpoBEkqkA6AMRBQwSAEaw4ACgBmQsAEpWFanACi06TADGNSes07FpZTQAqeAJ60IBAMpa8KMruwBGADRxsAJk9lPVDAAHlSeUCgAzqFw6Mxo0eFoANaeBGjMeJ5a4DBGbCoAwiDxeEK8CMVIYLy2prwAkvH4aEhQSuxwXDy8AIJ4eEgWxADmMFQASjDScABcM3CyA1BQcHi8cLWrUrWT03gbVI5ow4qjE1NwALxwaDCYcABEEdoENOiyD4Rw33DEhxYAGRgSCS6GGu1m80WrRWaw2pgh%2B1shzBhH%2BQJBYIh1zwEAwZ12xGAqAwczUGm0NAAqmgUFRCMT0FcvqsYOl8HAACQLOQs74AbS8rikgRCXLgEWwIHu3IArHB5ABdIA)

Materials:
----------

*   [Gist link](https://gist.github.com/imsaravana369/06eaea460f8f1d3d382de78be2d41207) — Factorial implementation using all the three looping functions.
*   [Code Playground](https://try.purescript.org/?code=LYewJgrgNgpgBAWQIYEsB2cDuALGAnGAKEJWAAcQ8AXOABQKgjCJPMpoFEAzLmAYxoAKbrwEBKVhWpwR-KgDoAwiDQBnELDiCoIAOYBlbCEwTSUmsrRU8G%2BQhVIw8-QBV5ASSv40SKINcANFyUATgosEGUMEh82AFoMJgBeBBooXgoVDDJ0WABoGAoXACepmzSACJIVEjyAIJ4eEjFgoLy8mISxFwxIFQovgCqqui6AGKUcABcU3DBTVBQcHjycJ40ALQAfHCuy2tWhD18fQNQw6MTeHAYALxwYCCEcC9wMXxwADwbN4lwAIzPV7zOAAJi0GAA1ACxHAADooODbOBA15wABuIBQYDgABI4AUisUtHCyAR0UidmSYBSAFRwFCw97ENEERxvPh8VEolHHU5DEZoXQAdWw4XgMzmlF8SxWB02Oz213WR16-QFo1F4pucHuj25iO%2Bv0wALRLw2FrgqiolFGcCouDgFHQWWu6KQGSQACNNNz3l8fgkTYC0WFNIItAB9L73NCwz64naCNk4xmwx5Iy2xfgAaztRQZMZ13LRfAgjUjmXwAeWuQZJde0aNhJKUbg9LLFareCZnIbLybP0wGSyWk7eErrrg0P%2BsMR5st6D4bMFuntjudXjw-ad5fgqUyO%2B5KY5XO6MRtnvOq6uHBi2Gms3mMuWq3WlN2Ln2KuOl7OFyFW97x1PUQB5V5-SNINTW5eZoliLRQXaON4URZEd0xbE8QJcAiRJakKWRAj2wZXsPmPOtmUIE5yAgLIxgvW1fEfeUPxVGiyDomAGIEJilnuFIME%2BYS5jVf9Vy1WBiGAVAMElWQBDgQY0EPGT0F1B4wNRHQDCME18UErQ%2BXVa9LkmABWCRXh0wxjGwwzBGM8TNTFTRLO0vRbP05ZUiMxirwA8ZKDvBDLKAA) — for experimenting with the code.

Instead of struggling to implement complex functionalities that involve extensive variable mutation in a functional manner, consider embracing the ST monad as an easier and cleaner imperative approach.

> Fact : The ST monad is often **preferred over recursion** when aiming to write efficient algorithms.

The capability to use mutable variables in a safer manner, without relying on monads like Effect, is not only helpful but also fascinating.

