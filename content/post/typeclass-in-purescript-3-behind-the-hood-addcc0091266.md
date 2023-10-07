Behind the hood — Understanding TypeClasses #3
==============================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----addcc0091266--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----addcc0091266--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----addcc0091266--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Ftypeclass-in-purescript-3-behind-the-hood-addcc0091266&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----addcc0091266---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----addcc0091266--------------------------------)·4 min read·Jan 29

\--

Listen

Share

In the previous [two](https://imsaravananm.medium.com/introduction-to-type-classes-1-2a7d3be0a70c) articles, we have seen how type class work and what is meant by functional dependency. In this article I will be explaining how type class works in low level, that is, how it will get transpiled to its corresponding backend (As we will be using purescript it’s javascript in our case).

Photo by [Shane Aldendorff](https://unsplash.com/@pluyar?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/mQHEgroKw2k?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Let’s say I have a type class,

```
class Addable a where  
  add :: a -> a -> a  
  addSelf :: a -> a
```

What do you think the above code will transpile to ?

Do you think a class `Addable` will be created and two member function will be present inside it?

No!! This is how the above typeclass will get transpiled to,

```
var add = function (dict) {  
    return dict.add;  
};  
  
var addSelf = function (dict) {  
    return dict.addSelf;  
};
```

What does the argument `dict` signifies above?

It’s quite simple but to understand that we have to know how transpiled code of an `instance` of the above typeclass looks like.

Let’s create a instance for our typeclass,

```
instance addInt :: Addable Int where  
  add a b = a + b  
  addSelf a = a + a
```

Now, take a look at the transpiled code,

```
var addInt = {  
    add: function (a) {  
        return function (b) {  
            return a + b | 0;  
        };  
    },  
    addSelf: function (a) {  
        return a + a | 0;  
    }  
};
```

The above transpiled code is quite straight forward, it’s just an object with two keys (our two function names `add` and `addSelf` ) and the values of the keys are their respective implementation.

Now what happens when I try to use one of the functions like,

```
\>>> add 1 2 
```

How the above code will get transpiled to ? Will the compiler directly call `addInt(1)(2)` ?

Can we go back and see the transpiled js version of our type class’s `add` function?

```
var add = function (dict) {  
    return dict.add;  
};
```

So can you think of a way wherein we can wire both the **_polymorphic_** `add` function and add function (`addInt` ) from our **Int** instance?

This is how the above call `add(1)(2)` will get transpiled to

```
add(addInt)(1)(2)
```

Can you see? `add` function is taking 3 arguments, not two? Even though the function signature of `add` is,

```
add :: a -> a -> a
```

Now where we are specifying the type of`dict`?

But behind the hood, actually the add function’s signature looks like,

```
add :: forall a. Addable a => a -> a -> a
```

Here our type class `Addable` is added as a constraint to our function signature, it specifies for any `a` there exists an `Addable` instance for `a`

This `Addable a` is our `dict` argument.

Now, coming back to the js version,

```
var add = function (dict) {  
    return dict.add;  
};  
  
var addInt = {   
   add :  { /\* implementation \*/ },   
   addSelf :  { /\* implementation \*/ }   
}  
  
console.log(add(addInt)(1)(2)) // just assume we are printing the value
```

The first argument— named as dict, **_specifies the Addable instance which we are going to use_**.

Which `add` function we are going to invoke depends on the instance that gets passed as the first argument.

Since the first argument is `addInt` , we are gonna invoke `add` function from `addInt` . If we pass `addString` , then add function will be invoked from that instance.

This is what that makes the type class truly polymorphic and let us do [ad-hoc polymorphism](https://en.wikipedia.org/wiki/Ad_hoc_polymorphism) (different implementation while calling the same function with different types)

When I call `add`function with another type, the **_corresponding instance_** will be passed as the first argument

```
add(addString)("hello")("world") 
```

Here, we know `add` is the polymorphic function, which implementation of `add` to use (`addInt` or `addString` etc) will be chosen by the compiler at **COMPILE TIME**, based on the type of arguments. This process is called [static dispatch](https://en.wikipedia.org/wiki/Static_dispatch).

Static dispatch makes type classes type safe, think about it, can you do

```
\>>> add true false
```

Assume there is no boolean instance specified for our Addable type class, then the compiler will throw the below error

```
 No type class instance was found for  
  
    Main.Add Boolean
```

> (To understand how compiler selects the right instance refer [this](https://medium.com/@imsaravananm/functional-dependencies-understanding-typeclasses-2-5a7826d83c7c) article)

The reason behind this error, is that how can we pass an instance in the first argument when its not present in the first place?

```
add(???)(true)(false) // no instance is available for \`Addable Boolean\`
```

I hope this article helped you get some clarification regarding the low level implementation of type classes and let you debug when the compiler throws `No type class instance was found for xyz`.

Thank you for reading ❤️.

Please take a look at my previous two articles regarding type classes.

[

Introduction to Type Classes #1
-------------------------------

### Let’s understand type classes in functional programming !!

imsaravananm.medium.com

](https://imsaravananm.medium.com/introduction-to-type-classes-1-2a7d3be0a70c?source=post_page-----addcc0091266--------------------------------)[

Functional Dependencies — Understanding Typeclasses #2
------------------------------------------------------

### If you don’t understand functional dependencies, then you don’t understand type classes.

imsaravananm.medium.com

](https://imsaravananm.medium.com/functional-dependencies-understanding-typeclasses-2-5a7826d83c7c?source=post_page-----addcc0091266--------------------------------)