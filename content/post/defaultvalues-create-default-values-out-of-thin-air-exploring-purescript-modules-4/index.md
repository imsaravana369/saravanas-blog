+++
title = 'defaultvalues-create-default-values-out-of-thin-air-exploring-purescript-modules-4'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

DefaultValues- Create Default Values Out of Thin Air — Exploring-purescript-modules #4
======================================================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----a80f1210d06b--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----a80f1210d06b--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----a80f1210d06b--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fdefaultvalues-create-default-values-out-of-thin-air-exploring-purescript-modules-4-a80f1210d06b&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----a80f1210d06b---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----a80f1210d06b--------------------------------)·3 min read·Oct 23, 2022

\--

Listen

Share

Have you ever been in a place where you wanted to create placeholder values, like for a big record, so you have created a variable that holds the dummy value and used it for `fromMaybe` or decode failure etc ?

E.g, let’s suppose you have a record which holds a person’s Info,

```
type Person =   
      { name :: String  
      , age :: Int   
      , height :: Number   
      , ....  
      }
```

Let’s say you want to create an initial state for your form component where all the above details will be filled, what the initial state would be?

```
initialState :: Person  
initialState =   
      { name : ""  
      , age : 0  
      , height : 0.0  
      , ....  
      }
```

> _Note: Ideally they should be wrapped in Maybe type, but please bear with me for explanation purpose._

We can create a record with dummy/placeholder values with some 5–10 fields but what if the number of fields exceeds 10 or 20 or more. Do we have to write these boilerplate code to create the dummy values? Wouldn’t be better if some package just give us values filled with default values? Won’t it save lot of developer’s time?

Is there any package that does this? Yes, there is a package called [**purescript-default-values**](https://pursuit.purescript.org/packages/purescript-default-values/1.0.1) which exactly does this job of creating default values. We will explore on how to use that package in this article.

Photo by [Jørgen Håland](https://unsplash.com/@jhaland?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/twins?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

It’s a very simple module, that has a type class called `DefaultValue` which has a single method called `defaultValue` , calling this particular method will provide us with the defaultValue for that particular type.

```
myDefaultInt :: Int  
myDefaultInt = defaultValue myDefaultString :: String  
myDefaultString = defaultValue\>>> myDefaultInt  
\>>> 0\>>> myDefaultString  
\>>> ""
```

Now let’s suppose you have a `Maybe Int` value and you are using fromMaybe to get the actual Integer from the Maybe wrapper. Most probably we would be giving 0 as a fallback in case of Nothing, instead of hardcoding `0` we could do it as follows,

```
\>>> fromMaybe defaultValue (Just 100)  
\>>> 100\>>> fromMaybe defaultValue (Nothing :: Maybe Int)  
\>>> 0
```

_Note: If you are using repl, type Annotating_ `_Nothing_` _is needed, otherwise compiler can’t infer the type._

Providing default values are not much of a hassle when it comes to primitive types like Int, String, Number etc. But this package really shines when working with insanely nested and big records.

```
type PersonInfo =   
      { name :: String  
      , age :: Int   
      , height :: Number  
      , father :: Person   
      , mother :: Person  
      , degrees :: Array String  
      , address :   
            { city :: String  
            , pincode :: Int  
            , street :   
                 { line1 :: String    
                 , line2 :: String  
                 , ....  
                 }  
            }  
      , .....   
      }
```

If you are trying to decode a `foreign` to the above type most probably you will be using `[decode](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class#v:decode)` . What if you want to return the value for the above type no matter what, do you have to create a dummy record with all the fields filled with empty values in case of failure? Absolutely no, you can just use `defaultValue`

```
decodePerson :: Foreign -> PersonInfo  
decodePerson fgn = case decode fgn of   
               Right person -> person   
               Left \_ -> defaultValue
```

When the decode fails, `defaultValue` will provide you with the record where all the fields are filled with dummy values.

But what if you want to provide default value to custom created types ?

```
data Color = RED   
           | YELLOW  
           | GREEN
```

To use `defaultValue` on this type, you just have to create a `DefaultValue` instance for this particular type.

```
instance defaultColor :: DefaultValue Color where   
    defaultValue = GREEN\>>> defaultValue :: Color  
\>>> GREEN
```

**Bonus Tips**

There are scenarios, where we want to provide different default value for a a type which is **already defined** in this module.

For example, we want our `age` field’s default value to be 18, since it’s an Int defaultValue will yield `0` . So we can wrap the Int in a newtype and provide our own DefaultValue Implementation for it.

```
newtype Age = Age Int  
instance defaultAge :: DefaultValue Age where   
    defaultValue = 18\>>> defaultValue :: Age  
\>>> 18
```

