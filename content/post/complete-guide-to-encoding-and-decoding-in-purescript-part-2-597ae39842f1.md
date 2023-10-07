Complete Guide to Encoding and Decoding in Purescript #Part-2
=============================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----597ae39842f1--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----597ae39842f1--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----597ae39842f1--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fcomplete-guide-to-encoding-and-decoding-in-purescript-part-2-597ae39842f1&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----597ae39842f1---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----597ae39842f1--------------------------------)·6 min read·Oct 24, 2022

\--

Listen

Share

This article is the second part in the series of Complete Guide to Encoding and Decoding, in the previous article, I’ve explained the basics of encoding and decoding in Purescript.

[

Complete Guide to Encoding and Decoding in Purescript #Part-1
-------------------------------------------------------------

### Basics of Encoding and Decoding in purescript.

imsaravananm.medium.com

](https://imsaravananm.medium.com/complete-guide-to-encoding-and-decoding-in-purescript-part-1-b95f81bb9eb5?source=post_page-----597ae39842f1--------------------------------)

In this article, I will be explaining how we can encode/decode newtypes and ADT data types. Let’s dive deep

Photo by [Jakob Owens](https://unsplash.com/@jakobowens1?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/dive-deep?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Okay, in the previous article we have seen how simple and straight forward is encoding and decoding primitive data types are in purescript. How simple it is to convert a Int, String, Array to a JS object and vice versa. But tell me how could we encode the below ADT to a Foreign Object.

```
data Fruit = Apple Color Diameter  
           | Banana Length  
           | Mango IsRipen  
           | Strawberry
```

> Note: Here `Color, Diameter, Length, IsRipen` are type synonyms of `String, Number, Number,Boolean` respectively.

How could you represent those types in foreign? Can you pass them as raw string ? like “Apple”, “Banana” etc… But what about the arguments like `Color, Diameter` how can you pass them?

Purescript constructors and their arguments will be encoded like the below JS object.

```
{ tag :: String   --- constructor name  
, contents :: Array Foreign  --- array of arguments  
}
```

So we can represent the ADT `Fruit` with the below JS object

and to test whether they work, let’s import them in our `Main.purs`

```
foreign import apple :: Foreignforeign import banana :: Foreignforeign import mango :: Foreignforeign import strawberry :: Foreign
```

If you try to write a function that can decode `Fruit`,

```
decodeFruit :: Foreign -> Maybe Fruit  
decodeFruit fgn = case **runExcept $ decode fgn** of   
    Right fruit -> Just fruit  
    Left \_ -> Nothing
```

> Note: See the previous article to understand how this decode function works

This function will throw the below compile time error, telling that we haven’t defined Decode instance for our custom defined `Fruit` datatype.

```
No type class instance was found for  
                                        
    Foreign.Generic.Class.Decode Fruit
```

So, how can we define Decode/Encode instance for our type?

It’s quite simple, we just have to create an instance for a type class called `[Generic](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Data.Generic.Rep#t:Generic)` and the Purescript compiler will do all the heavy lifting for us.

```
derive instance genericFruit :: Generic Fruit \_
```

The above line opens a lot of door for us… With the above single Generic instance we can derive a hell lot of instances like [Eq](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Data.Eq.Generic), [Show](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Data.Show.Generic), [Bounded](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Data.Bounded.Generic), Encode, Decode etc..

```
instance encodeFruitInstance :: Encode Fruit   
   where encode = **genericEncode** defaultOptionsinstance decodeFruitInstance :: Decode Fruit   
   where decode = **genericDecode** defaultOptions
```

Once we define the Generic instance for our `Fruit` datatype we can define our encode and decode instances in terms of functions `genericEncode` and `genericDecode` which we got for free by deriving the Generic Instance.

> We will look what that `defaultOptions`means in a second.

Now our decode function compiles successfully, and in `spago repl` we will try decoding our `foreign` values defined in Main.js to their respective Fruit type.

Decoding Foreign value to Fruit in spago repl

Hola !! Everything works as expected.

Having achieved what we wanted to do now we are looking for ways to customise things.

I want to

1.  Rename the `tags` and `contents` to `type` and `args`
2.  Pass the constructor name as lowercase, “apple”, instead of directly passing the exact constructor name, “Apple”

How can I do that?

Remember the defaultOptions, that we’ve used while defining encode/decode instance via genericEncode and genericDecode

```
instance encodeFruitInstance :: Encode Fruit   
   where encode = genericEncode **defaultOptions**instance decodeFruitInstance :: Decode Fruit   
   where decode = genericDecode **defaultOptions**
```

Let’s see how defaultOptions is defined,

```
defaultOptions :: Options  
defaultOptions =  
  { sumEncoding:  
      TaggedObject  
        { tagFieldName: **"tag"**  
        , contentsFieldName: **"contents"**  
        , constructorTagTransform: identity  
        }  
  , unwrapSingleConstructors: false  
  , unwrapSingleArguments: true  
  , fieldTransform: identity  
  }
```

Okay, let’s see what the above fields mean

*   **unwrapSingleConstructors** — When this field is true, types having a single constructor, would not be wrapped in tags and contents.

For example,

```
newtype Name = MkName String
```

When **unwrapSingleConstructors = false,** to decode this value we want to pass,

```
{  
  tag: "MkName"  
, contents : "John Doe"  
}
```

But when **unwrapSingleConstructors = true**, passing `“John Doe”` is enough to decode it to `Name` type.

> Note: It’s  default value is `**false**`

*   **unwrapSingleArguments —** Constructor’s **a**rguments needs to be passed in an **Array**, but when **unwrapSingleArguments** is true, for type with only one arguments we can pass them as a single value instead of array.

For example,

> Assume, `unwrapSingleConstructors = false` and `unwrapSingleArguments = false`

```
newtype Name = MkName String
```

When you encode name,

```
name :: Name  
name = MkName "John Doe"\--- >>> encode name
```

this will result in,

```
{ tags : "MkName"  
, contents : \["John Decode"\]  
}
```

See, even though we have a single argument (a String) it’s wrapped in an Array, to prevent this behaviour we can set `**_unwrapSingleArguments = true_**`

When you do so, the result would be,

```
{ tags : "MkName"  
, contents : "John Decode" -- no more Array wrapping   
}
```

> Note: It’s default value is **true**, that’s why while defining foreign object of mango we passed `true` and not `[true]`

**fieldTransform** — This is specifically for working with record type, with this function we can transform our field names in Purescript record to the one we want to see in foreign object.

For example, let’s suppose you have the newtype which wraps a record,

```
newtype MyPerson = MkPerson   
       { name :: String  
       , isMarried :: Boolean  
       , fatherName :: String  
       }
```

> Note: Look at the camelcase field names

The api that you are using is responding with JS object that has field names in lowercase,

```
{ name : "John Doe"  
, **ismarried** : false  
, **fathername** : "John Doe snr"  
}
```

`ismarried` & `fathername` are in lowercase, but the Purescript record fields requires them in camelcase. How can we fix this?

By Setting, `fieldTransform = toLower`

Suddenly the API that I’m using has started sending`fathername` as `papaname` How can I map it now? From `fatherName -> papaname`

I can write my own transform function.

```
myFieldTransform :: String -> String  
myFieldTransform fieldName = case fieldName of  
    "fatherName" -> "papaname"  
    others ->  toLower others
```

and set `fieldTransform = myFieldTransform`

> Note: It’s default value is **identity,** a function that returns its arguments unchanged… `identity x = x`

**sumEncoding** — SumEncoding is used for encoding types that has more than one constructors, [sum types](https://www.quora.com/What-is-a-sum-type).

`sumEncoding` is of type `[TaggedObject](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class#v:TaggedObject)`, which is just a wrapper around a record of the below fields.

```
data SumEncoding = TaggedObject   
      { tagFieldName :: String  
      , contentsFieldName :: String  
      , constructorTagTransform :: String -> String  
      }
```

*   **tagFieldName** — defines the field name for constructor.
*   **contentsFieldName —** defines the field name for Arguments.
*   **constructorTagTransform** — a transformer function similar to fieldTransform, but deals with constructor names.

Okay, that was quite an explanation, now I want you figure out how can I fulfil the requirements that I’ve mentioned far above,

> I want to
> 
> 1\. Rename the `tags` and `contents` to `type` and `args`
> 
> 2\. Pass the constructor names as lowercase, e.g “apple”, instead of directly passing the exact constructor name, i.e “Apple”

Try doing it yourself, I will attach the answer below for your reference,

I’m using purs version 0.13.8.

The corresponding Main.js file is,

> Note: I’m using purs version 0.13.8, some packages are migrated to different module path in the new version . Refer [Pursuit.org](https://pursuit.purescript.org/) for fixing the import issues.

Output of the above code

Hope you did it yourself😊 and got it right, congrats🥳.

In the next article we will look at how we can Encode/Decode Enums.

Clap👏 if you’ve liked this article and share it with your friends and colleagues. Thanks.