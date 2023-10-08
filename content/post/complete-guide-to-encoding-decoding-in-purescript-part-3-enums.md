Complete Guide to Encoding/ Decoding in purescript — Part #3 — Enums
====================================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----cd686f88cd3--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----cd686f88cd3--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----cd686f88cd3--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fcomplete-guide-to-encoding-decoding-in-purescript-part-3-enums-cd686f88cd3&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----cd686f88cd3---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----cd686f88cd3--------------------------------)·3 min read·Oct 29, 2022

\--

Listen

Share

This article is the continuation of the 4 part series of _Complete guide to Encoding and Decoding in purescript_. In the last article we have taken a deep dive on how we can encode/decode new types and ADTs. If you haven’t read it, I highly recommend giving it a read, it will surely be of great use.

[

Complete Guide to Encoding and Decoding in Purescript #Part-2
-------------------------------------------------------------

### Diving deep into Encoding and Decoding.

imsaravananm.medium.com

](https://imsaravananm.medium.com/complete-guide-to-encoding-and-decoding-in-purescript-part-2-597ae39842f1?source=post_page-----cd686f88cd3--------------------------------)

In this article, we will be looking at how we can encode and decode Enums in Purescript. This article will be very short unlike the previous article, as this will be very easy and straight forward.

What are Enums?
---------------

Okay, let’s start with the question, what are Enums?

Photo by [Greyson Joralemon](https://unsplash.com/@greysonjoralemon?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/color?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Enum — [Sum type](https://www.schoolofhaskell.com/user/Gabriel439/sum-types) which has no arguments. Thats all it is. (Don’t confuse with `[Enum](https://pursuit.purescript.org/packages/purescript-enums/6.0.1/docs/Data.Enum#t:Enum)` typeclass)

```
data Color = RED  
           | YELLOW  
           | GREEN
```

When you add arguments to any of the constructors, e.g `OtherColor String` , our `Color` type would no longer be a Enum.

**Encoding/Decoding Enums**
---------------------------

To encode/decode enums, we can still use the `genericEncode/ genericDecode` specified in the previous chapter.

If we do it that way, for representing `RED` from JS foreign object, we have to write

```
{  
  tags : "RED",  
  contents : null  
}
```

We know, `contents` field will always be null since no constructor in `Color` has any arguments, its a ENUM !!

So, can we just pass, `“RED”` and make it work?

Yes, we can !! and the good news is its very simple.

Let’s do that step by step,

1\. Derive Generic Instance for the Enum type.
----------------------------------------------

```
derive instance genericColor :: Generic Color \_
```

2\. Deriving Encode/Decode Instance
-----------------------------------

This is where it differs from the normal encode/decode instance deriving. Instead of using the well known`genericEncode` and `genericDecode` , we will be using `genericEncodeEnum` and `genericDecodeEnum` which are specifically designed for handling Enums.

```
instance decodeColor :: Decode Color  
   where decode = **genericDecodeEnum** defaultGenericEnumOptionsinstance encodeColor :: Encode Color  
    where encode = **genericEncodeEnum** defaultGenericEnumOptions
```

Now, user could pass “RED” as foreign, it will be decoded to `RED :: Color`

> Note: It’s also **type safe,** try adding a non-enum constructor to Color, and see the compiler throwing an error.

Customizing
-----------

Let’s say you don’t want to pass the exact name of the Enum from foreign object instead you want to pass them in lowercase and still want them to work.

Example, you want to pass “red” instead of “RED”, but you still want it to be decoded to `RED :: Color`

If that is your use case, you can create your own version of `GenericEnumOptions` which you are passing as an argument to the generic enum methods above.

`GenericEnumOptions` is a record with just a single field `constructorTagTransform` **,** which is a transformer function that takes our enum name as a string and emit a String which the foreign JS object should have.

```
type GenericEnumOptions =   
    { **constructorTagTransform** :: String -> String }
```

To do the above you can write your own `GenericEnumOptions`

```
myGenericEnumOptions :: GenericEnumOptions  
myGenericEnumOptions = {constructorTagTransform : toLower}
```

and use it in your decode/encode instance,

```
instance decodeColor :: Decode Color  
   where decode = genericDecodeEnum **myGenericEnumOptions**instance encodeColor :: Encode Color  
    where encode = genericEncodeEnum **myGenericEnumOptions**
```

**Main.js**

```
exports\["redColor"\]    =  "red"  
exports\["yellowColor"\] =  "yellow"  
exports\["greenColor"\]  =  "green"
```

**Main.purs**

**Output:**

spago repl

This is how simple it is to work with enums in Purescript and I hope you’ve learnt that in this article.

In the next article, which is the fourth and the last part of this series, we will look at how we can create our own encode/decode instance without relying on Generic Instance( which could be costly at times, will explain about this in another article).

Clap👏 if you’ve liked this article and share it with your friends and colleagues. Will meet you in the next article.