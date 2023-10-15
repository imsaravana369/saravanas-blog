+++
title = 'where-to-define-typeclass-instances-typeclass-4'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Where to define instances? — Understanding TypeClasses #4
=========================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----412719f66657--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----412719f66657--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----412719f66657--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fwhere-to-define-typeclass-instances-typeclass-4-412719f66657&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----412719f66657---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----412719f66657--------------------------------)·3 min read·Feb 6

\--

Listen

Share

In the last [three](https://imsaravananm.medium.com/introduction-to-type-classes-1-2a7d3be0a70c) articles, we have seen a lot about type classes and have created many type classes, created lot of instances but nowhere I’d specified where we should define the instances.

Can we define it anywhere? If it’s a yes, then I would not be writing this article….

This is a small article but a crucial one.

Photo by [Alexander Schimmeck](https://unsplash.com/@alschim?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/Aohf8gqa7Zc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Where can we define the instances?
----------------------------------

There are only two places where we can define instances for any typeclass.

1.  **The place where the TYPE CLASS is present.**

Let’s say you have a type class, defined in the file `MyShow.purs`

```
module MyShow where   
  
class MyShow a where   
    myShow :: a -> String
```

You can create any number of instances for `MyShow` in `MyShow.purs` file, as it’s the place where its declared in the first place.

```
instance myShowInt :: MyShow Int where  
    myShow a = "An Int :" <> (show a)  
  
instance myShowString :: MyShow String where  
    myShow a = "A String :" <> a  
  
\--- you can create any instance for \`MyShow\` here
```

**2\. The place where the TYPE is present.**

Let’s say I have a file `Type.purs` where I have created a newtype,

```
newtype SpecialInt = SpecialInt Int 
```

I can create any instance for `SpecialInt` in `NewFile.purs` where the type `SpecialInt` is actually present.

```
instance myShowSpecialInt :: MyShow SpecialInt where  
    myShow (SpecialInt a) = "A SpecialInt : " <> (show a)  
  
\-- you can also create any instance for \`SpecialInt\` here,  
\-- e.g Eq, Show etc
```

If your type class has more than one parameterized type, like

```
class MyTypeClass a b where   
    doSomething :: a -> b -> Effect Unit
```

Then the instance can be specified in, module where `MyTypeClass` is present, module where either `a` or `b` is present.

So I can edit the above title _from_,

*   The place where the **TYPE is** present

_to_,

*   The place where the **TYPES are** present

When functional dependency is present in type class, the rule will become quite complicated. If you’re interested, you can refer [this](https://liamgoodacre.github.io/purescript/type/class/instance/orphan/functional/dependencies/2017/01/22/purescript-orphan-instance-detection.html) article written by [LiamGoodCare](https://www.twitter.com/goodacre_liam).

But why only two places?
------------------------

You may wonder why only two places? Why not everywhere?

What happens when we let developers create any type class instance for any type on anywhere?

Remember our above `MyShow` typeclass which is declared in `MyShow.purs` , where we have defined the instances for `Int` and `String` ?

What if in a new file `MyOtherShow.purs` , I do something like,

```
import MyShow  --- the module where our MyShow typeclass is present  
  
instance myShowInt2 :: MyShow Int where  
    myShow a = "A overlapping Int :" <> (show a)
```

By doing the above you just made the compiler go crazy, when you ask for `MyShow` instance for type `Int` , which one will the compiler return?

The one(_myShowInt_) from `MyShow.purs` or the above one(_myShowInt2_) from the `MyOtherShow.purs` ?

**_Preventing Multiple instances_** from getting defined is the reason why we have the above rules, otherwise it would be a mess

So you may ask, if I can declare the instance in any of the two places,

1.  **The place where the TYPE CLASS is present.**
2.  **The place where the TYPES are present.**

What if I declare same instances on both the places?

E.g, Can I declare instance for `MyShow SpecialNumber` in both `MyShow.purs` and `Type.purs` ? Cyclic dependency😜 says no!!

Orphan Instances
----------------

There is an error you will get if you try to break the above rule, that is, if you try to declare instance anywhere other than the above two places you will get the **_Orphan instance_** error.

```
Orphan instance <instance-name> found for  
                     
    <typeclass> <type> 
```

Now, when the above error occurs I hope you know exactly what to do…

Thank you for coming here and reading the article… I would appreciate it more if you share this article with others who may find it helpful like you did🙌.

[

TypeClass in Purescript #3 — Behind the hood
--------------------------------------------

### Ever wondered how typeclass works behind the hood?

imsaravananm.medium.com

](https://imsaravananm.medium.com/typeclass-in-purescript-3-behind-the-hood-addcc0091266?source=post_page-----412719f66657--------------------------------)[

Functional Dependencies — Understanding Typeclasses #2
------------------------------------------------------

### If you don’t understand functional dependencies, then you don’t understand type classes.

imsaravananm.medium.com

](https://imsaravananm.medium.com/functional-dependencies-understanding-typeclasses-2-5a7826d83c7c?source=post_page-----412719f66657--------------------------------)[

Introduction to Type Classes #1
-------------------------------

### Let’s understand type classes in functional programming !!

imsaravananm.medium.com

