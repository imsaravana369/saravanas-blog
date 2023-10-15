+++
title = 'complete-guide-to-encoding-and-decoding-in-purescript-part-1'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Complete Guide to Encoding and Decoding in Purescript #Part-1
=============================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----b95f81bb9eb5--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----b95f81bb9eb5--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----b95f81bb9eb5--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fcomplete-guide-to-encoding-and-decoding-in-purescript-part-1-b95f81bb9eb5&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----b95f81bb9eb5---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----b95f81bb9eb5--------------------------------)·5 min read·Oct 22, 2022

\--

Listen

Share

While developing applications, most of the time we have to interact with outside world like making API requests, sending response, parsing configuration files etc.

In Purescript, we most of the time have to interact with javascript [Foreign](https://pursuit.purescript.org/packages/purescript-foreign/7.0.0/docs/Foreign#t:Foreign) values and want to convert those values back to our local Purescript types and vice versa.

Encoding and Decoding let us do that in type safe way.

Since there are lot of topics we need to cover, I’m splitting them into 4 parts.

1.  Basic Encoding and Decoding (this article)
2.  Encoding/Decoding newtype and data
3.  Encoding/Decoding Enums
4.  Encoding/Decoding custom types.

This part will be **quite easy to grab** as it will be teaching only the basics of Encoding and Decoding but it is very necessary to help you understand the next upcoming articles on Encoding/Decoding.

Photo by [Rob Wicks](https://unsplash.com/@robwicks?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/left-and-right?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Basic Encoding and Decoding
---------------------------

From Purescript point of view,

*   Encoding is a process of converting Purescript datatypes into JS foreign objects.
*   Decoding is the process of converting JS foreign objects back to their respective Purescript datatypes.

To encode we will be using the function `[**encode**](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class#v:encode)` and to decode we will be using the function called `[**decode**](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class#v:decode)` . As simple as it is.

**Question: Can we encode/decode any type?**

_No_!! For a type to be Encodable/Decodable it needs to implement the respective type classes [Encode](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class#t:Encode) and [Decode](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class#t:Decode) which are defined in `[Foreign.Generic.Class](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class)`

```
class Encode a where    
   encode :: a -> Foreignclass Decode a where    
   decode :: Foreign -> F a
```

**_Encode_** — Given a type `a` , it knows how to convert that particular `a` to a [Foreign](https://pursuit.purescript.org/packages/purescript-foreign/7.0.0/docs/Foreign#t:Foreign) (JS type)

**_Decode_** — Given a Foreign, it knows how to convert it back to the Purescript type `a` (we will learn what that `F` means in the below section)

**Question: Do we need to define Encode and Decode all by ourselves?**

Most of the time it’s a No, because to make our lives easier the above module `[Foreign.Generic.Class](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class)` has defined Encode and Decode instances for lot of types like Int, String, Array, Maybe etc.

Predefined Encode ande Decode instances

The above image shows all the predefined Encode and Decode instances in `[Foreign.Generic.Class](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class)`

In the other cases, the compiler will let us derive Encode and Decode instances for our custom defined types without writing lot of code (Part-2 will cover this)

> Note: **Part-4** of this series will show how we can define our own Encode and Decode instances by ourselves as it will be needed in some scenarios.

Hands On
========

Now let’s look at how we can use those two functions `encode` and `decode` in practise.

Let’s Decode
------------

Consider we have the below JS object in `Main.js`,

In `Main.purs`,

In `[spago repl](https://github.com/purescript/spago)` (Interactive way to run purescript programs)

Decoding JS object to Purescript type

As you can see, the above conversion is very intuitive, we have mapped all the value from the passed JS object to their respective Purescript type.

> _Note:_ See how `**partner : null**`  is mapped to `**partner : Nothing**`
> 
> All the Maybe fields are **optional**, it means we can skip passing those values.

If I change, `partner : Jane Doe` in Main.js,

Now see, partner is now `**Just "Jane Doe"**`

If we pass even a single invalid field from foreign, it will make the whole decode operation fail, for example, if I change `gender : ‘M’` to `gender : "Male"` it will fail as gender is a `Char` but we are passing a `String`

Decode failed, when we passed String instead of Char for gender field

The error would be,

```
(NonEmptyList   
  (NonEmpty   
    (**ErrorAtProperty “gender” (TypeMismatch “Char” “String”)**)  
  Nil))
```

Working of “**runExcept $ decode fgn”**
---------------------------------------

You can skip this section if you find it hard, it will explain how we are using the `decode` function to get `Either` out of it.

Okay, having seen how decode works, some of you might be confused with the line,

```
decodePerson :: Foreign -> Maybe Person   
decodePerson fgn = case **runExcept $ decode fgn** of         
     Right person -> Just person        
     Left err -> Nothing
```

what Exactly are we doing using, `runExcept $ decode fgn` ??

If you look at the type of decode and runExcept

```
\---  decode :: Foreign -> F a  
   
**decode** :: Foreign -> Except (NonEmptyList ForeignError) a**runExcept** :: forall e a. Except e a -> Either e a
```

> Note: type F = Except (NonEmptyList ForeignError)

Calling decode wont give us back the decoded value, it will give an `Except` monad which wraps the result or an Error that occurred while decoding.

To get `Either` out of `Except` (so that we could pattern match and pull the value out ) we need to use `runExcept` which has the ability to convert `Except e a` to `Either e a`

**Encode**
----------

Encode is far simpler to grasp than decode. All you have to do is to call `encode` function, that’s all, no need for runExcept, Error handling.

```
person ::Person  
person =    
  { name : "John Doe"  
  , age : 21  
  , degrees : \["BE","MBA"\]  
  , gender : 'M'  
  , isMarried : false  
  , partner : Nothing  
  }
```

If you do,

```
\>>> encode person
```

> Note: We can’t print Foreign in `repl`, as it doesn’t have any Show Instance

You will get,

```
{  
 partner: null,  
 name: ‘John Doe’,  
 isMarried: false,  
 gender: ‘M’,  
 degrees: \[ ‘BE’, ‘MBA’ \],  
 age: 21  
}
```

Exactly the same as the one in `Main.js` , so if you do encode followed by a decode you will arrive at the same type and it also holds vice versa(on successfully encoding/decoding)

Bonus:
------

If you really want to see the encode result, use `[spy](https://pursuit.purescript.org/packages/purescript-debug/6.0.2/docs/Debug#v:spy)` from [Debug.Trace](https://pursuit.purescript.org/packages/purescript-debug/6.0.2/docs/Debug#v:spy) which can print any value, even those without show instance.

```
main :: Effect Unit  
main = do  
  let \_ =  spy "Encode result" $ encode person  
  pure unit
```spago repl

Hope you’ve learnt about basic encoding and decoding in this article, in the next article we will see how to do Encoding/Decoding of new types and ADTs.

