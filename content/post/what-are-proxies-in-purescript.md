What are Proxies in Purescript?
===============================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----b4ebe38aa919--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----b4ebe38aa919--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----b4ebe38aa919--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fwhat-are-proxies-in-purescript-b4ebe38aa919&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----b4ebe38aa919---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----b4ebe38aa919--------------------------------)·3 min read·Aug 19, 2022

\--

Listen

Share

Have you ever been in a situation where you want to pass a type instead of Value or are you confused by what I just said? Let me explain.

Photo by [Abolfazl Ranjbar](https://unsplash.com/@ranjbarpic?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/paper-rocket?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Let’s first understand, whats the difference between type and value.

```
myFavoriteNumber :: Int  
myFavoriteNumber = 3
``````
myName :: String  
myName = "Saravanan"
``````
newtype Email = Email String  
  
myEmail :: Email   
myEmail = Email "saravanan.m@gmail.com"
```

Here all the things that appears after \`::\` are called types and the things that appears on the left are called values.

If you consider `myFavoriteNumber` , `3` is the value and `Int` is the type.

We always pass values to a function, what a function could do if we plainly pass `Int` to it, instead of specifying its value? (Add two Integers, what is the output?)

Is there any place where we want to pass the type instead of Value? Is it even possible? Yes it is possible and useful in many scenarios.

I hope all of you are familiar with the type class `[Bounded](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Data.Bounded#t:Bounded)` which has two values `top` and `bottom` which give the highest and lowest value respectively of the respective type in which it is defined. (not a big deal if you don’t know, just continue reading)

Consider you want to create a function that prints the lowest and highest possible value of a particular type

```
getRange :: forall a. Bounded a => {lowest :: a , highest :: a }  
getRange  = { lowest :  bottom  
            , highest :  top  
            }
```

But this won’t work, why? How the compiler can decide which top, bottom we want..? Do we want the top of String or Int or any other type? How could we specify the type here?

we could do something like,

```
getRange :: forall a.(Bounded a) => a -> {lowest :: a,highest :: a }  
getRange \_ = { lowest :  bottom  
             ,  highest :  top  
             }
```

and we can call this function like

```
\>>> getRange 1  
{lowest: -2147483648, highest: 2147483647 }  
  
\>>> getRange false  
{lowest: false, highest: true }  
  
\>>> getRange 1.0  

```

Now the purescript compiler knows which `top` , `bottom` we want.

But passing a value doesn’t make sense here, we aren’t even using the value. So why are we passing a value like `1`, `false`, `1.0`here?

Can we pass only the type `Int` , `Boolean` , `Number` ?

Yes, we can, that’s exactly what Proxies are for. Let’s look at the definition of Proxy

```
data Proxy a = Proxy
```

Proxy has only one Constructor(Proxy) which has no arguments, the interesting part is the `a` which is on the left side, with that `a` (called [phantom types](https://wiki.haskell.org/Phantom_type)) we can `encode` the type information.

What exactly do I mean by `encode` here?

Proxy will act as a T**ype Holder,** you can encode (hold) a type within it, look at the below example

```
\_intProxy :: Proxy Int  
\_intProxy = Proxy\_numberProxy :: Proxy Number  
\_numberProxy = Proxy
```

Here the value of both `_intProxy` and `_numberProxy` are same (**Proxy**) (yes, they are actually useless)

The interesting part is their type.

Their types differ in a very subtle way (**Proxy <type>**) here the **_<type>_** helps in carrying the _extra type information._

For `_intProxy` its `Int` for `_numerProxy` its `Number`

So how could we use the encoded type information in the above example?

In the above function `getRange`, instead of passing `a`, we can pass `Proxy a`

```
getRange :: forall a. (Bounded a)   
           -> Proxy a  
           => {lowest :: a , highest :: a }  
getRange \_ = { lowest :  bottom  
             ,  highest :  top  
             }
```

Now you can do something like

```
\>>> getRange \_intProxy   
{lowest: -2147483648, highest: 2147483647 }
``````
\>>> getRange (Proxy :: Proxy Boolean)-- boolean proxy defined inline  
{lowest: false, highest: true }
``````
\>>> getRange 1.0   
{ lowest: -Infinity, highest: -Infinity }
```

> Note: We have to explicitly specify the type for Proxies to indicate what's the type of `a` in the Proxy is.

Proxies are nothing but a way to pass around type information, they are used extensively in places where the type information is enough to take a decision, like type class instance selection.

There are other kind of Proxies like SProxy (which captures Symbol), RLProxy(which is used for Row types) etc. But those are deprecated and so knowing `Proxy` is enough😉