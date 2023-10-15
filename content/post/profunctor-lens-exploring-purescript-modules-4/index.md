+++
title = 'profunctor-lens-exploring-purescript-modules-4'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Profunctor-lens — Exploring-purescript-modules #4
=================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----89aba69405ef--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----89aba69405ef--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----89aba69405ef--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fprofunctor-lens-exploring-purescript-modules-4-89aba69405ef&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----89aba69405ef---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----89aba69405ef--------------------------------)·5 min read·Oct 5, 2022

\--

Listen

Share

Let’s say you have the below complex data structure,

```
type NestedData =  
  Maybe (Array   
     { foo :: Tuple String (Either Int Boolean)  
     , bar :: String })
```

If I tell you to flip the deeply nested boolean value at a particular Index, how would you do that?

```
flipBool :: Int -> NestedData -> NestedData  
flipBool index = case \_ of   
    Nothing -> Nothing   
    Just arr -> modifyAt index modifyFooFoo arr  
    where  
      modifyFooFoo rec = rec { foo = modifyTuple rec.foo}  
      modifyTuple (Tuple first sec) = Tuple first (modifyEither sec)  
      modifyEither ei = not <$> ei
```

Do we need to write a complex function like the one above? What happens if the structure of `NestedData` changes? We have to again make a lot of changes to our function. So, Is there any easy way to modify & retrieve data inside these complex data structures🧐? Yes, there is, they are called Optics. With Optics you could do something like

```
flipBool :: Int -> NestedData -> NestedData  
flipBool index nestedData = over boolGetter not nestedData  
    where  
       boolGetter = (\_Just <<< ix index <<< \_foo <<< \_2 <<< \_Right)
```

See the line of code is reduced by 50%, even though I haven’t explained anything about the above syntax, you could easily grab it by yourself by just looking at the above code blockPhoto by [James Bold](https://unsplash.com/@jamesbold?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/lens?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

The below are contents are inspired largely from [this](https://thomashoneyman.com/articles/practical-profunctor-lenses-optics/) article published by [Thomas Honeyman](https://github.com/thomashoneyman/).

Photo by [James Bold](https://unsplash.com/@jamesbold?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/lens?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Types of Optics
===============

Before diving into how the above function works, let’s understand some core concepts in Optics.

There are four types of optics that are used often. They are Prism, Lens, Traversal and Iso. Every optic describe a relationship between a structure `s`and a zero, or more values of type `a`.

```
Optic s a   
// s => Structure like Maybe a, Either a, Array a etc  
// a => (one or more) Value (the \`a\` inside the above types)
```

`Prism` represents optics which represent structure `s` from which we may or may not get a value of type`a`. Example, a Maybe type.

`Lens` represents optics where we can surely retrieve a value of type `a` from the structure `s`. Example, a Tuple

`Traversal` represents optics where we get zero or more values of type `a` from the structure `s`. Example, a Array

`Iso` represent optics where the structure `s` and value `a` are isomorphic to each other. Example, a newtype

```
newtype Name = Name String  
// here \`Name\` and \`String\` are isomorphic to each other  
// one of them are enough to create the other
```

Dissecting the example
----------------------

```
(\_Just <<< ix index <<< \_foo <<< \_2 <<< \_Right)
```

*   One of the powerful thing we can do with optics is composing them.
*   Optics are conventionally prefixed with an underscore and need to be read from left to right (when we left compose it).
*   As we move to the right we are going one layer deep into the structure. From the above optic, we can conclude that

```
1st Layer - A Maybe  
2nd Layer - Array like structure  
3rd Layer - A Record  
4th Layer - A tuple  
5th Layer - An Either 
```

If your recall that’s what exactly our `NestedData` is,

```
type NestedData =  
  Maybe                      -- 1 : \_Just  
   (Array                    -- 2 : ix index  
     { foo ::                -- 3 : \_foo  
        Tuple String         -- 4 : \_2  
        (Either Int Boolean) -- 5 : \_Right  
     , bar :: String })
```

Most of the above optics are predefined in the module [profunctor-lens](https://pursuit.purescript.org/packages/purescript-profunctor-lenses/8.0.0), except `_foo` which is also quite easy to define.

```
import Data.Lens.Record(props) \_foo = prop (Proxy :: Proxy "foo")
```

Diving deeep
============

Let’s understand one by one of the four optics,

1.Lenses
--------

We use lenses for product types like Tuples and records. Lenses lets us get and modify a value of type `a` when it is sure to be present in the structure `s` . Example the lens `_2` will fetch the second element of the tuple, which we are sure is always present in any given tuple.

```
\-- This lens focuses on the second element of a tuple and is implemented  
\-- in the Data.Lens.Lens.Tuple module.  
\_2 :: forall a b. Lens' (Tuple a b) b  
  
\-- This lens focuses on the "name" field of a record; we have to construct  
\-- this one ourselves.  
\_name :: forall a r. Lens' { name :: a | r } a  
\_name = prop (SProxy :: SProxy "name")
```

You can use functions like `view`to get the value `a` from the struture `s` and use functions like `set` and `over`to modify the value in it.

Consider you have the type

```
type Person = {name :: String, age :: Int}
```

and you have created a lens that work on the field `name`

```
\_name :: forall a r. Lens' { name :: a | r } a  
\_name = prop (SProxy :: SProxy "name")
```

If you want to get the `name` field’s value, you can use `view`

```
\>>> view \_name {name : "Saravanan", age : "22"}
```

If you want to override the value, you can use `set`

```
setName :: Person -> Person  
setName p = set \_name "Saravanan M" p\>>> setName {name : "Saravanan", age : "22"}  
\>>> {name : "Saravanan M", age : "22"}
```

If you want to override the value with respect the previous value, then you can use `over`

```
setName' :: Person -> Person  
setName' p = over \_name (\\name -> "Mr." <> name) p\>>> setName' {name : "Saravanan", age : "22"}  
\>>> {name : "Mr.Saravanan", age : "22"}
```

2\. Prism
---------

Unlike Lenses, which work on Product types and always the structure `s` it works on has the value `a` , Prisms works on Sum types(like Maybe, Either etc) and the structure `s` it works on may or may not have the value `a` it asks for.

Let’s suppose we are working on the type

```
type APIResponse = Either String Person
```

To get the left and right value you can use the predefined Prisms `Left` and `_Right` respectively.

```
getErrorResponse :: APIResponse -> Maybe String  
getErrorResponse  =  preview \_Left getSuccessResponse :: APIResponse -> Maybe Person  
getSuccessResponse = preview \_Right\>>> getErrorResponse (Left "Failed")  
\>>> Just "Failed"\>>> getSuccessResponse (Left "Failed")  
\>>> Nothing
```

> Note: The value returned from **preview** is **Maybe a** unlike `view`which returns `a`

You can also use `over` , `set` for Prism as used for Lens.

If you want to learn about the remaining optics Traversals, Iso, and also want to read more on this topic, I highly suggest you to read [this wonderful blog](https://thomashoneyman.com/articles/practical-profunctor-lenses-optics/) by ThomasHoneyman.

