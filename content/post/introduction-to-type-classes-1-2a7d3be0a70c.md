Introduction — Understanding TypeClasses #1
===========================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----2a7d3be0a70c--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----2a7d3be0a70c--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----2a7d3be0a70c--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fintroduction-to-type-classes-1-2a7d3be0a70c&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----2a7d3be0a70c---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----2a7d3be0a70c--------------------------------)·5 min read·Jan 2

\--

Listen

Share

If you are from Object oriented programming background, you might have heard about method overloading or operator overloading. You might want to create a function that behave differently for different data types.

Let’s say I want to create a function that takes two arguments (of same type) and gives me an Integer.

*   When I add two integers, I just want the sum of them.
*   When I add two decimal numbers, I want their sum rounded off.
*   When I add two strings, I want the sum of their lengths.

How can we do it?

In java I can do something like,

> Note: The function name is `add` for all the three usecase.

The result would be,

```
Int add 3  
Double add 6  
String add 10
```

But in Purescript/Haskell how can we do that?

Can we do,

```
add :: Int -> Int -> Int   
add a b = ...  
  
add :: Number -> Number -> Int   
add a b = ....   
  
add :: String -> String -> Int   
add a b = ...
```

The compiler will complain,

```
The value \`add\` has been defined multiple times
```

So, we want something like,

```
add :: forall t. t -> t -> Int 
```

But how do you define the function for different types??

```
add :: forall t. t -> t -> Int  
add a b = ???
```

We have no clue what `t` is, so we can’t do any operation on it.

The maximum you can do to make it compile is,

```
add :: forall t. t -> t -> Int  
add \_ \_ = 42  --- Hardcoded Integer value
```

Seriously, what’s the use of returning `42`? even though people consider it as meaning of life…

We will look at two solutions to this problem. The first one solves it partially, the second one will be the right solution. Let’s build our way up through the solution.

**First Solution**
------------------

As I told above, the issue is we have no clue what the type `t` is, so let’s try to give some subtle clue to compiler what our `t` is capable of doing.

I’m going to create a type class `IntegerValue` which will help us to provide the subtle clue,

> Note: Read the code snippets patiently, there are lot but not that complex

```
class IntegerValue a where  
   toInt :: a -> Int 
```

The subtle clue that this class is going to provide is, given any type `a` we can convert it to an Integer by using `toInt` function.

But If I try,

```
toInt "Hello" 
```

I will get the below error,

```
 No type class instance was found for  
  
    Main.IntegerValue String
```

Why? Because we haven’t yet implemented any instance for our newly created type class `IntegerValue`

How to define an instance ?

```
import Data.String(length)   
  
instance stringIntegerValue :: IntegerValue String where   
  toInt a = length a
```

the syntax for defining instance is,

```
instance <nameOfInstance> :: <TypeClass> <Type1> .. <TypeN> where   
    ...
```

> Note: Name is also made optional post purescript 15

Now,

```
toInt "Hello" --- result : 5
```

But if I try,

```
toInt 5    
  
\--  Same error as above  
\--- No type class instance was found for  
\---     Main.IntegerValue Int  

```

We defined the instance for String only, so the compiler is throwing the error that we haven’t defined an instance for `Int`…

Let’s define it for Int and Number (double),

```
import Data.Int(round)  
  
instance intIntegerValue :: IntegerValue Int where   
  toInt a = a  
  
instance doubleIntegerValue :: IntegerValue Number where   
  toInt a = round a
```

Now I can define my function `add` with the help of the above type class,

```
add :: forall t. IntegerValue t => t -> t -> Int  
add a b = (toInt a) + (toInt b)  
  
\--- >>> add 1 2   
\--- 3  
  
\--- >>> add 5.5 6.3  
\--- 12  
  
\--- >>> add "Hello" "World!"  
\--- 11
```

Now the only thing I know about the type `t` is, it should have `toInt` function.

The statements to the left of fat arrow `=>` are called **constraints**. We specify them to add more clue what the open-types(like `t` above) are capable of doing.

Here by specifying `IntegerValue t` we are telling that

> “<t> could be of any type I don’t care about it, but it has `**toInt**()` function with which you can convert that value to an Integer”

**The above functionality looks more like** [**INTERFACE**](https://www.javatpoint.com/interface-in-java), thats why when people ask me what type class is, I often tell “Type classes are to purescript what interfaces are to java.”

It’s a Contract between the type and the compiler. The `type` promising certain functionalities that it will provide for sure.

Here `IntegerValue` is promising the compiler that

> “I can extract an integer value from whatever type that has an instance of me”
> 
> (via `_toInt_` function obviously its not a magic!!)

Photo by [Cytonn Photography](https://unsplash.com/@cytonn_photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/n95VMLxqM2I?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

You can have any number of constraints,

```
add :: forall t. Show t => IntegerValue t => t -> t -> String  
add a b = "Adding "   
        <> (show a)   
        <> " and "   
        <> (show b)  
        <> " = "  
        <> show (toInt a + toInt b)
```

Here, the above function has an open type `t` which has two constraints `[Show](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Data.Show#t:Show)` and `IntegerValue`

Hope you have understood what type class mean in general and why we use it and how we can use it…But theres a reason why I called this solution partial, can you see the issue?

Our add function might return wrong value❌ for `Number` type .

Let’s say, `add 5.4 6.2` should return `12` but our function is returning `11`

Because we are rounding off the decimals individually then doing the sum, but we should only round off the total sum…

Second Solution
---------------

The issue is, we are trying to solve the problem in wrong way. We don’t want to convert each individual unit to Int, our use case wants us to create a function that can take two argument of same type and emit an Integer after adding them in some way.

Some I’m going to create a typeclass that’s going to do exactly that

```
class AddToInt a where   
  add :: a -> a -> Int
```

Note that the add function takes arguments of same type `a` and gives an Integer.

Now let’s define instances for our type class,

```
instance intAddToInt :: AddToInt Int where   
  add a b = a + b  
  
instance numberAddToInt :: AddToInt Number where   
  add a b = round $ a + b   
  
instance stringAddToInt :: AddToInt String where   
  add a b = length $ a <> b
```

If you look closely, its polymorphism at its best.. It looks exactly like function overloading, we have the same function name `add` and the definition differs with respect to the type of the variable we are passing.

```
\>>> add 1 2   
3  
\>>> add 5.4 6.2  
12  
\>>> add "Hello" "World"  
10
```

This is exactly what we wanted to implement, but we didn’t know how to implement function overloading with plain functions.

```
add :: forall t. t -> t -> Int  
add a b = ???
```

But now with the help of type class we are able to achieve something similar to function overloading. (It’s actually called [ad-hoc polymorphism](https://en.wikipedia.org/wiki/Ad_hoc_polymorphism), more on it later)

In the next article we will look at how type class chooses the right instance from all the instances defined and much more advanced type class topics.

If you’ve liked this article please clap for it(remember you can clap 50times in a single go😅😅) and share it with people whom you think might find this article helpful.