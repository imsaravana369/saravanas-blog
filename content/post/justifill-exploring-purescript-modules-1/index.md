+++
title = 'justifill-exploring-purescript-modules-1'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Justifill — Exploring Purescript Modules #1
===========================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----c565e73eec1--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----c565e73eec1--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----c565e73eec1--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fjustifill-exploring-purescript-modules-1-c565e73eec1&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----c565e73eec1---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----c565e73eec1--------------------------------)·2 min read·Sep 9, 2022

\--

Listen

Share

I have decided to start writing about Purescript modules which I find interesting and this is the first article in the series **_#exploring-ps-modules_**.

Our frontend team works extensively on Purescript and our application does a lot of api calls, and most of the fields in the request payload are optional and you can find `Maybe`fields all over the place. Maybe fields are good, they let us ignore fields which are not mandatory by passing `Nothing` but let’s say you have 10 fields and out of them 8 are `Maybe` fields, there are times you want to pass `Nothing` to all the 8 fields. \*sighs!!\*

This made us think, can we just pass the fields that are necessary and all the Maybe fields which are not passed are set to `Nothing` by default, in a type safe way and not giving a chance to the compiler to complain.

Photo by [Santiago Lacarta](https://unsplash.com/es/@lacarta?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/fill?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Thats when we found the package named `[JustiFill](https://pursuit.purescript.org/packages/purescript-justifill/0.5.0/docs/Justifill#v:justifill)` which let us do exactly what we wanted to do.

_Quick Example_,

```
type Person = { name :: String  
              , age :: Int  
              , salary :: Maybe Int  
              , children :: Maybe Int  
              }student :: Person  
student = justifill {name : "Mike", age : 14}\--- > student   
\--- > { age: 14, name: "Mike", salary: Nothing, children: Nothing }
```

You can see from the above example that we are only passing the mandatory fields to the function `justifill` and it fills the maybe fields with `Nothing` for us. See, how useful this could be!!

And there are also times when we want to pass **_some maybe fields_** along with the mandatory fields, can we do that with this library? Absolutely yes.

```
freshGrad :: Person  
freshGrad = justifill { name : "Steve"  
                      , age : 21  
                      , salary: Just 200  
                      --  see i'm skipping the \`children\` field  
                      }
```

It also allows us to fill Maybe fields without using the `Just` constructor.

```
familyMan :: Person  
familyMan = justifill { name : "Jim"  
                      , age : 21  
                      , salary: Just 2000  
                      , children : 1 -- we skipped Just   
                      }
```

This Library is so helpful in making your code much cleaner by reducing lot of boiler plate code.

