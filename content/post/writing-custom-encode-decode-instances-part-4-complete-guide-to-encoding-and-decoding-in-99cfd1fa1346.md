Writing Custom Encode/Decode Instances —#Part-4 Complete Guide to Encoding and Decoding in Purescript
=====================================================================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----99cfd1fa1346--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----99cfd1fa1346--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----99cfd1fa1346--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fwriting-custom-encode-decode-instances-part-4-complete-guide-to-encoding-and-decoding-in-99cfd1fa1346&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----99cfd1fa1346---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----99cfd1fa1346--------------------------------)·5 min read·Nov 12, 2022

\--

Listen

Share

This is the fourth and the last article in the series of [Complete Guide to Encoding/ Decoding in purescript](https://imsaravananm.medium.com/complete-guide-to-encoding-and-decoding-in-purescript-part-1-b95f81bb9eb5).

In the previous three articles we have covered almost all aspects of encoding and decoding in Purescript where we have learnt how to use the builtin functions like genericEncode, genericDecode and also leveraged compiler’s support to do the job for us, but there are instances where we want to write our own encoding/decoding logic.

We will look at how we can do that in this article.

Photo by [Kelly Sikkema](https://unsplash.com/@kellysikkema?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/lego-house?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

If you are following along, the Purescript type decides how the encoded foreign object will look like, for example, for the below type

```
\-- example ADT from the previous articles  
  
data Fruit = Apple Color Diameter  
           | Banana Length  
           | Mango IsRipen  
           | Strawberry 
```

The foreign representation of Apple will look like,

```
{  
  tag : "Apple",  
  contents : \["#FF0000",50\]  
}
```

If we create encode instance using the genericEncode, the foreign object structure will be decided by the Purescript type that we are trying to encode and the [options](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class#t:Options) (refer the [second article](https://imsaravananm.medium.com/complete-guide-to-encoding-and-decoding-in-purescript-part-2-597ae39842f1) in this series) that we pass to the genericEncode method.

So, whats the problem with that?

We have to follow strict structure for the corresponding types (like for ADTS we have to specify the constructors in `tag` field and the arguments in the `content` field wrapped in an array) otherwise we can’t do decoding.

With the traditional genericEncode and genericDecode, there is not much flexibility we can impose on the foreign object’s structure that we encode to or decode from.

Lets consider a scenario where an API is sending Apple as an array like below,

```
\["Apple", "#FF0000", 50\]
```

or like,

```
{ fruitType : "Apple"  
, color : "#FF0000"  
, diameter : 50  
, length : null  
, isRipen : null  
}
```

Using genericEncode or genericDecode isn’t an option anymore, we have to write our own encode/decode instance with the logic we want.

Writing encode instances are always easy, so let’s start by writing them.

First scenario, when the foreign is an array

```
instance encodeFruit :: Encode Fruit where   
   encode fruit =   
        encode $ case fruit of   
            Apple color diameter -> \[ encode "Apple"  
                                    , encode color  
                                    , encode diameter \]  
            Banana length ->  \[encode "Banana", encode length\]  
            Mango isRipen ->\[encode "Mango", encode isRipen\]  
            Strawberry -> \[encode "Strawberry"\]  

```

Second scenario, when the foreign is an object,

```
type FruitForeign =   
    { fruitType :: String   
    , color ::  Maybe Color  
    , diameter :: Maybe Diameter  
    , length :: Maybe Length  
    , isRipen :: Maybe IsRipen  
    }  
  
instance encodeFruit :: Encode Fruit where   
   encode fruit =   
    let   
        result = {fruitType : "", color : Nothing, diameter : Nothing, length : Nothing, isRipen : Nothing }  
    in   
        encode $   
            case  fruit of   
                Apple color diameter -> result {fruitType = "Apple"  
                                               , color = Just color  
                                               , diameter = Just diameter}  
  
                Banana length -> result {fruitType = "Banana"  
                                        ,length = Just length}  
  
                Mango isRipen -> result {fruitType = "Mango"  
                                        ,isRipen = Just isRipen}  
                Strawberry -> result {fruitType = "Strawberry"}
```

Writing encode instances is quite straight forward, but writing decode instance is where the real challenge resides.

Before jumping into decoding, let’s understand some useful function provided by `Foreign.Index` package that let us read data from foreign object.

> _readProp_ — Let us read a particular property(key) from a foreign object.
> 
> **_readIndex_** — Let us read a value at a particular index if the foreign is an array.
> 
> **_hasOwnProperty_** — Tells whether the given property(key) is present in the foreign object.

Let’s try to write decode instances for the above 2 scenario,

```
\-- consider the foreign of Fruit looks like  
\-- \["Apple","#FF0000",50\]  
  
instance decodeFruit :: Decode Fruit where   
   decode fgn  = do  
        fruitType <- (readIndex 0 fgn) >>= decode  
        case fruitType  of   
            "Apple" -> do   
                colorFgn <- readIndex 1 fgn  
                diameterFgn <- readIndex 2 fgn  
                Apple <$> (decode colorFgn) <\*> (decode diameterFgn)  
            "Banana" -> do  
                    lengthFgn <- readIndex 1 fgn  
                    Banana <$> (decode lengthFgn)  
            "Mango" -> do   
                    isRipenFgn <- readIndex 1 fgn  
                    Mango <$> (decode isRipenFgn)  
            "Strawberry" -> pure $ Strawberry  
            \_ -> fail $ ForeignError "Not a valid fruit"
```

1.  `fruiteType <- (readIndex 0 fgn) >>= decode`

we are reading the 0th index from the foreign `fgn` and then we are decoding the 0th index (to String, inferred automatically by the compiler)

2\. Then we are pattern matching the `fruitType` and if its not any of the specified fruit type, we are throwing an Error (last case)

3\. In every case, we try to decode the subsequent elements in the foreign array and only if all of them(all of the intermediate `readIndex` and `decode` operation) succeeds we are able to create our indented type.

> **Example:** If the foreign is `[“apple”]`, we will enter the case match of “apple” but the line ,`colorFgn <- readIndex 1 fgn` , will fail (as there is no element in the 1st index). So the subsequent lines below it won’t execute (**short circuiting behaviour of exceptT** **monad**) and it will throw a Foreign error.

If you are confused with the syntax like`Apple <$> (decode color) <*> (decode diameter)` I highly recommend reading the explanation to that syntax in this [documentation](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Control.Apply), but you could always rewrite it as,

```
"Apple" -> do   
      colorFgn <- readIndex 1 fgn  
      diameterFgn <- readIndex 2 fgn  
      color <- decode colorFgn   
      diameter <- decode diameterFgn  
      pure $ Apple color diameter  
  
\--- or   
"Apple" -> do   
      color <- (readIndex 1 fgn) >>= decode  
      diameter <- (readIndex 2 fgn) >>= decode  
      pure $ Apple color diameter
```

> Note: Since `decode and readIndex` works on the same Monad(ExceptT). We were able to write very readable code with the **do** notation.

Now let’s write the decode instance for the 2nd scenario,

```
\-- { fruitType : "Apple", color : "#FF0000", diameter : 50  
\-- ,length : null, isRipen : null }  
  
  
instance decodeFruit :: Decode Fruit where   
   decode fgn  = do  
        fruitType <- (readProp "fruitType" fgn) >>= decode  
        case fruitType  of   
            "Apple" -> do   
                color <- (readProp "color" fgn) >>= decode  
                diameter <- (readProp "diameter" fgn) >>= decode  
                pure $ Apple color diameter  
            "Banana" -> do  
                    length <- (readProp "length" fgn) >>= decode  
                    pure $ Banana length  
            "Mango" -> do   
                    isRipen <- (readProp "isRipen" fgn) >>= decode  
                    pure $ Mango isRipen  
            "Strawberry" -> pure $ Strawberry  
            \_ -> fail $ ForeignError "Not a valid fruit"
```

This code is very similar to the one above, we just swapped `readIndex` with `readProp`

I hope this article has given a very short, yet useful insight into creating encode/decode instance with your own custom logic.

Share it with your friends who may find it helpful and clap👏 if you’ve liked this article.

If you haven’t read the previous three articles in the serious, please give it a read. You will surely find it helpful.

[

Complete Guide to Encoding and Decoding in Purescript #Part-1
-------------------------------------------------------------

### Basics of Encoding and Decoding in purescript.

imsaravananm.medium.com

](https://imsaravananm.medium.com/complete-guide-to-encoding-and-decoding-in-purescript-part-1-b95f81bb9eb5?source=post_page-----99cfd1fa1346--------------------------------)[

Complete Guide to Encoding and Decoding in Purescript #Part-2
-------------------------------------------------------------

### Diving deep into Encoding and Decoding.

imsaravananm.medium.com

](https://imsaravananm.medium.com/complete-guide-to-encoding-and-decoding-in-purescript-part-2-597ae39842f1?source=post_page-----99cfd1fa1346--------------------------------)[

Complete Guide to Encoding/ Decoding in purescript — Part #3 — Enums
--------------------------------------------------------------------

### Encoding & Decoding Enums in Purescript.

imsaravananm.medium.com

](https://imsaravananm.medium.com/complete-guide-to-encoding-decoding-in-purescript-part-3-enums-cd686f88cd3?source=post_page-----99cfd1fa1346--------------------------------)