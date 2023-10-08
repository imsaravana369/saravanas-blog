Type vs New type — When you should prefer the one over the other
================================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/?source=post_page-----ce4783e00e7a--------------------------------)

[Saravanan M](https://medium.com/?source=post_page-----ce4783e00e7a--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fimsaravananm.medium.com%2Ftype-vs-new-type-when-you-should-prefer-the-one-over-the-other-ce4783e00e7a&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----ce4783e00e7a---------------------post_header-----------)

6 min read·Oct 19, 2022

\--

Listen

Share

When I started with functional programming, I had many questions. One of them was “Whats the difference between type & newtype and when should I prefer the one over the other?” In this article, I will try my best to answer that question.

Photo by [Pablo García Saldaña](https://unsplash.com/@garciasaldana_?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/direction?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

So first let’s see the definition of both,

> `**_type_**` — introduces a synonym for a type and uses the same data constructors
> 
> `**_newtype_**` — introduces a renaming of a type and requires you to provide new constructors

Type
----

As the definition says, it’s just a synonym for a type. Let’s say you are creating a program for printing remarks of students performance with respect to their marks, it’s intuitive to call marks as `Marks` instead of `Int`

```
type Marks = IntgetRemarks :: Marks -> String  
getRemarks mark =   
    mark < 25  = "Not my son"  
    mark <= 50 = "Okay"  
    mark <= 99 = "You could do better" -- typical Asian parent  
    otherwise  = "Now you are my son"
```

and you can call the function with either `Marks` or an `Int`, both will work

```
\>>>  getRemarks (66 :: Marks)   
"You could do better"\>>> getRemarks (24 :: Int)  
"Not my son"
```

If you are coming from C background, it’s nothing but a [typedef](https://www.tutorialspoint.com/cprogramming/c_typedef.htm).

When the code gets compiled, all the `Marks` will be replace by Int.

Most frequently people use type synonym for avoiding redundant code and increasing readability.

*   You could give a type synonym to a record which has lot of fields, instead of repeating the whole structure again and again.
*   You could give a type synonym to a return type which has complex nested structure. For example, (type [F](https://pursuit.purescript.org/packages/purescript-foreign/7.0.0/docs/Foreign#t:F) which is defined in purescript-foreign)

```
type F = ExceptT MultipleErrors\-- another example  
type [**Callback**](https://pursuit.purescript.org/packages/purescript-node-fs/8.1.0/docs/Node.FS.Async#t:Callback) a = [**Either**](https://pursuit.purescript.org/packages/purescript-either/6.1.0/docs/Data.Either#t:Either) [**Error**](https://pursuit.purescript.org/packages/purescript-exceptions/6.0.0/docs/Effect.Exception#t:Error) a -> [**Effect**](https://pursuit.purescript.org/packages/purescript-effect/4.0.0/docs/Effect#t:Effect) [**Unit**](https://pursuit.purescript.org/packages/purescript-prelude/6.0.0/docs/Data.Unit#t:Unit)
```

Newtype
-------

As the definition says, it renames a type. You can create a new type out of any other type by just wrapping it with a `newtype` keyword.

```
newtype Marks = Marks Int
```

The left and Right side names need not to be the same, the below is also a valid newtype.

```
newtype Marks = MkMarks Int
```

Here, `Marks` is the name of the new type and `MkMarks` is the constructor needed to create the newtype.

> Note: `_newtype_` can have only one constructor as opposed to `_data_` which could have more than one construtor.

If you rewrite the above function with the newtype,

```
getRemarks :: Marks -> String  
getRemarks (MkMarks mark) =   
    --- same code
```

> Note: To access the inner type, you have to unwrap it.

You can call the above function only with `Marks` not with Int

```
\>>> getRemarks (MkMarks 66)  
"You could do better"\>>> getRemarks 24  
\-- throws error
```

you will get the following error,

```
Could not match type Int with type Marks
```

**The power of newtypes**
-------------------------

You may ask, “Both of them serves the same purpose, they let us rename the types and for newtype we just have to do the additional step of wrapping and unwrapping, where and why exactly should we prefer the one over the other? Does new type has any use?”

Let me tell you two beneficial ways in which we can use newtypes,

1\. [Smart Constructor](https://wiki.haskell.org/Smart_constructors)
--------------------------------------------------------------------

First let’s consider a scenario,

You want to create a Password type, and your requirement is it should have at least 6 characters. How can you do that?

```
type Password = Stringtype RegisterDetails =   
     { email :: String   
     , password :: Password  
     }createPassword :: Password -> Either String Password  
createPassword password = if length password >= 6   
                               then Right password  
                               else Left "Size should be atleast 6"
```

and we tell the developers that they should always create a password by calling the createPassword function.

```
registerUser :: String -> Password -> Either String RegisterDetails  
registerUser email password =   
  case createPassword password of   
     Right validPassword -> Right {email, password : validPassword}  
     Left err -> Left err
```

But what prevent them from doing😈,

```
myNewRegisteredUser :: RegisterDetails  
myNewRegisteredUser = {email : "hacker@gmail.com", password: "haha"}
```

Since password is just a type synonym of plain String, the type system will let us create it as long as it is a string. So how can we restrict the user/developer from creating their own password? The answer is smart constructors.

> Sometimes you need guarantees about the values in your program beyond what can be accomplished with the usual [type system](https://wiki.haskell.org/Type) checks. Smart constructors can be used for this purpose.

Instead of keeping Password as type, let’s change it to newtype

```
newtype Password = MkPassword String
```

If you look at the above code, createPassword is called the smart constructor. Smart constructors are nothing but functions that let us create the required type but with some additional value level checks.

You may still ask, what prevents us from doing,

```
myNewRegisteredUser :: RegisterDetails  
myNewRegisteredUser =   
    { email : "hacker@gmail.com"  
    , password: MKPassword "a"}
```

Actually we can still do that😅…

Whattt ??

The last important thing that we should is, we should not expose the constructor(`MkPassword` ) of Password… How can we do that..?

We could do that by only importing the`Password`type not along with its constructor `MkPassword`

```
module MyRegisterModule  
  ( Password  -- not Password(..)  
  , ...  
  ) where // the code
```

If you skip `(..)` it only imports the type, now people can’t use `MkPassword` outside your module

```
\>>> MKPassword "a"  
Unknown data constructor "MKPassword"
```

You have prevented people from creating password and added logic for creating the type (should be at least of size 6).

With the help of the Smart constructors, we can have some guarantees about the values in your program beyond what can be accomplished with the usual [type system](https://wiki.haskell.org/Type) checks.

E.g Beside Knowing that our password will be of type `String` (type level guarantee) which is ensured by our type system, we could also assure now that our password will at least be of size 6 (value level guarantee)

2.Create our own instance for type classes
------------------------------------------

Type classes are like interfaces, they only have the method signature but not definition. Each type define their own instance for the type class they want to implement. E.g `Show` is a type class which has a method called `show`

We can derive instances for newtype by using,

```
derive newtype instance showPassword :: Show Password
```

which will derive the instance with respect to the type it wraps, in this case Password will have the show instance of string.

But we don’t want to show our password to anyone, how could we do that?

```
import Data.String.Utils as StringUtils  
import Data.String.Common(joinWith)instance showPassword :: Show Password  where  
  show (MkPassword p)   
              = joinWith ""   
              $ map (const "\*")   
              $ StringUtils.toCharArray p
```

Now if we call show method on Password we will get password masked with asterisk,

```
\>>> show password -- assume (password = MkPassword "hello123")  
\>>> \*\*\*\*\*\*
```

When you want to override the type class instances of already defined types, you have to wrap that type with `newtype` and then you can define new instances for any type class you wish to override.

When Should you prefer the one over the other?
----------------------------------------------

*   When your only intention is to make the code readable and less redundant, use `type` but if you want to make the type behave differently (type class instances) then go for `newtype`.
*   If you want to add restriction on **value level**, create smart constructor using newtypes. When you think, type level checks are enough go with type synonym.

Hope you have learnt the differences between type and newtype, and when you should prefer the one over the other.

Share it with your friends and colleagues, and Clap**👏** if you’ve liked this article.