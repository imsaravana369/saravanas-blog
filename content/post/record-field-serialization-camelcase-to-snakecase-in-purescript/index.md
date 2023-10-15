+++
title = 'record-field-serialization-camelcase-to-snakecase-in-purescript'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Record Field Serialization: Camelcase to Snakecase in Purescript
================================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----798a8133de8b--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----798a8133de8b--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----798a8133de8b--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Frecord-field-serialization-camelcase-to-snakecase-in-purescript-798a8133de8b&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----798a8133de8b---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----798a8133de8b--------------------------------)·4 min read·May 27

\--

Listen

Share

Have you ever encountered a situation where the field name of your Purescript type follows one format ([Camel case](https://en.wikipedia.org/wiki/Camel_case), e.g `_firstName_`), while the response type you receive from the backend or any other source follows a different format ([Snake case](https://en.wikipedia.org/wiki/Snake_case), e.g `_first_name_`)

If you attempt to directly decode the response, it will result in failure due to mismatched field names between the sent field names and the PureScript record field names.

How can you handle this issue?

[https://www.pagerduty.com/resources/learn/what-is-a-pull-request/](https://www.pagerduty.com/resources/learn/what-is-a-pull-request/)

You can either,

*   Request the backend to change the field names to your format (Really?)
*   Adjust your purescript field names accordingly (Lot of changes, [PR](https://www.pagerduty.com/resources/learn/what-is-a-pull-request/) won’t get merged)

Fortunately, there is an alternative approach available.

**_You can incorporate the logic of converting field names in your encode/decode instance._**

Encode/Decode Options
---------------------

The solution lies in using `[Options](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class#t:Options)`. When performing encode/decode operations on Purescript types, we can additionally pass this options with which we can customize the behaviour of default encode and decode.

Options is just a record with type,

```
type Options = { fieldTransform           :: String -> String  
               , sumEncoding              :: SumEncoding  
               , unwrapSingleArguments    :: Boolean  
               , unwrapSingleConstructors :: Boolean   
               }
```

By making adjustments to the `fieldTransform` function, we can achieve the desired functionality of converting field name from one format to the other.

> **Note:** If you want to understand what the other fields does, I’ve already covered them in a [separate article](https://medium.com/@imsaravananm/complete-guide-to-encoding-and-decoding-in-purescript-part-2-597ae39842f1).

Some Theory
-----------

The `fieldTransform` function is designed to accept a Purescript field name as a string and return the corresponding field name that will be present in your encoded JavaScript object.

While encoding a record, this `fieldTransform` function gets invoked recursively on every field, to get back the corresponding key in your encoded Foreign Object.

Similarly, during the decoding process, the same mechanism is applied in reverse.

To demonstrate this behaviour, I have created a JavaScript program which mocks the decode. However, to avoid overwhelming this article with excessive details, you can checkout the implementation using the link [here](https://gist.github.com/imsaravana369/a4a0340249125fcdb12d9caf1a53869f).

1\. Setting up
--------------

Consider this is my Purescript type,

```
newtype Person = Person { firstName ::  String  
                        , lastName :: String  
                        }
```

and the response that I’m getting from backend is like,

```
{ first\_name : "Saravana", last\_name : "Murugesan"}
```

Note, one is in _camelcase_ and other is in _snakecase_.

2\. Function to convert CamelCase to snake\_case
------------------------------------------------

Since our purescript fields are in camelcase and our response keys are in snakecase. Our `fieldTransform` has to take camelcase and gives snakecase.

So let’s write a utility function for it,

```
import Data.String.CodePoints (singleton, toCodePointArray)  
import Data.String (toLower) as STR  
import Data.Foldable (foldMap)  
import Data.CodePoint.Unicode (isUpper) as CU  
  
camelCaseToSnakeCase :: String -> String  
camelCaseToSnakeCase str = foldMap go (toCodePointArray str)  
          where go l = do   
                      let str' = singleton l  
                      if CU.isUpper l  
                        then "\_" <> (STR.toLower str')  
                        else str'
```

In this function, we iterate through each character of the input string. If a character is uppercase, we return an underscore followed by the lowercase version of the character. Otherwise, we simply return the same character. Finally we append them together(done by `foldMap`) to get the snakecase string.

3\. Creating Options
--------------------

Now we are all set, so let’s create the `Options` which will get our job done.

But how could we create an Options?

```
type Options = { fieldTransform :: String -> String  
               , sumEncoding :: SumEncoding  
               , unwrapSingleArguments :: Boolean  
               , unwrapSingleConstructors :: Boolean   
               }
```

Do we have to create one from scratch? When all we want is to override `fieldTransform` field.

Wouldn’t it be lovely if the other fields were magically of the `Maybe` type, so we could simply assign them `Nothing`?

No Worries, Purescript got us covered. It actually provides a default value for options called `[defaultOptions](https://pursuit.purescript.org/packages/purescript-foreign-generic/10.0.0/docs/Foreign.Generic.Class#v:defaultOptions)` .

So I can override only `fieldTransform` like below,

```
import Foreign.Generic.Class(Options, defaultOptions)  
  
\--- my namings are wierd indeed..  
snakeOptions :: Options  
snakeOptions = defaultOptions { fieldTransform = camelCaseToSnakeCase }
```

4\. Creating Encode/Decode Instances
------------------------------------

Now it’s time to define the encode and decode instance in terms of our `snakeOptions` which we have created above.

In order to employ our custom options, we can make use of `encodeWithOptions` and `decodeWithOptions`

```
import Foreign(F)  
import Foreign.Generic.Class (decodeWithOptions, encodeWithOptions)   
  
decodePerson :: Foreign -> F Person  
decodePerson jsObj = decodeWithOptions snakeOptions jsObj  
  
encodePerson :: Person -> Foreign  
encodePerson psObj = encodeWithOptions snakeOptions psObj
```

5\. Experiment Time
-------------------

Now that we have created the `encodePerson` and `decodePerson` functions, it's time to put them to the test.

To mock backend response, In my `Main.js`, I have defined this foreign export.

```
// Main.js  
export const response = { first\_name : "Saravana"  
                        , last\_name : "Murugesan"  
                        }
```

In Main.purs,

```
import Control.Monad.Except (runExcept)  
import Debug (spy)  
import Effect (Effect)  
import Effect.Console (log) as Console  
import Data.Either(Either(..))  
  
foreign import response :: Foreign  
  
main :: Effect Unit  
main = do  
  let \_ = spy "Encode Result" $  
            encodePerson {firstName : "Saravana", lastName : "Murugesan"}  
  
  Console.log $   
      case runExcept $ decodePerson response of  
          Right a -> "Decode Success : " <> (show a)  
          \_       -> "Decode Failed"
```

The output I got is,

```
\>>> spago run  
Encode Result: { last\_name: 'Murugesan', first\_name: 'Saravana' }  
Decode Success : { firstName: "Saravana", lastName: "Murugesan" }
```

As we can see, that our code actually worked and is able to encode/decode correctly regardless of the field names being in different formats.

I hope this article has helped you gain a better understanding of how to leverage the `Options` feature in PureScript for customizing your encode/decode instances.

To learn more about serialization on purescript, you can checkout this articles.

[

Complete Guide to Encoding and Decoding in Purescript #Part-1
-------------------------------------------------------------

### Basics of Encoding and Decoding in purescript.

imsaravananm.medium.com

](https://imsaravananm.medium.com/complete-guide-to-encoding-and-decoding-in-purescript-part-1-b95f81bb9eb5?source=post_page-----798a8133de8b--------------------------------)[

Complete Guide to Encoding and Decoding in Purescript #Part-2
-------------------------------------------------------------

### Diving deep into Encoding and Decoding.

imsaravananm.medium.com

](https://imsaravananm.medium.com/complete-guide-to-encoding-and-decoding-in-purescript-part-2-597ae39842f1?source=post_page-----798a8133de8b--------------------------------)[

Writing Custom Encode/Decode Instances —#Part-4 Complete Guide to Encoding and Decoding in…
-------------------------------------------------------------------------------------------

### You are independent developer no need for compiler support, Encode/Decode with your custom logic !!

imsaravananm.medium.com

