Functional Dependencies — Understanding Typeclasses #2
======================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----5a7826d83c7c--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----5a7826d83c7c--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----5a7826d83c7c--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Ffunctional-dependencies-understanding-typeclasses-2-5a7826d83c7c&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----5a7826d83c7c---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----5a7826d83c7c--------------------------------)·7 min read·Jan 22

\--

Listen

Share

In the [previous article](https://medium.com/@imsaravananm/introduction-to-type-classes-1-2a7d3be0a70c) we have seen a basic introduction to type classes and solved a use case to better understand them. In this article we would be seeing about an important topic in type classes called Functional Dependency.

Before learning what functional dependencies are, let’s first understand in the ocean of instances how the compiler knows which instance to choose.

Photo by [FLY:D](https://unsplash.com/@flyd2069?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/ZNOxwCEj5mw?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

How type class choose the right instance?
-----------------------------------------

Have you ever wondered how type class actually work, if you read my [previous article](https://medium.com/@imsaravananm/introduction-to-type-classes-1-2a7d3be0a70c) you may know that each type class can have many instances defined for it.

For this article, let’s consider `Show` typeclass as an example, `Show` has a single method called `show :: a -> String` , which can convert the passed value `a` to a String.

If you look at the source code how instances are defined for Show, then it would look something like

```
class Show a where  
  show :: a -> String  
  
instance showUnit :: Show Unit where  
  show \_ = "unit"  
  
instance showBoolean :: Show Boolean where  
  show true = "true"  
  show false = "false"  
  
instance showInt :: Show Int where  
  show = showIntImpl -- showIntImpl is a Foreign function   
  
....
```

Having seen some of the defined instances, let me ask you a question…

When I call,

```
\>>> show 1
```

What do you think will happen?

How the compiler chooses the right instance?

When do you think the choosing happens, in compile time or runtime?

(I think I revealed the answer in the above line itself)

**How compiler chooses the right instance?**

This one is very obvious, if the compiler can infer the type of the value being passed, then it can choose the right instance.. for the above example

```
\>>> show 1
```

here we know the type of `1` is Int, so the compiler chooses the `Show Int` instance.

But what if your type class looks something like,

```
class MyCoolTypeClass a b where   
  convertAToB :: a -> b   
  convertBToA :: b -> a
```

what if I write two instances for `MyCollTypeClass` as,

```
import Data.Int(fromString,toNumber,ceil)  
import Data.Maybe(fromMaybe)  
  
.....  
  
instance instance1 :: MyCoolTypeClass Int String where   
  convertAToB someInt = show someInt  
  convertBToA someString = fromMaybe 0 $ fromString someString  
  
  
instance instance2 :: MyCoolTypeClass Int Number  where   
  convertAToB someInt = toNumber someInt  
  convertBToA someNumber = ceil someNumber
```

What would be my return type when I do

```
\>>> let a = convertAToB 12
```

Is `a` an String or Number because we have two possible functions to choose from,

```
convertAToB :: Int -> Number -- coming from instance1  
  
(and)  
  
convertAToB :: Int -> String -- coming from instance2
```

If the chosen instance is `_instance1_` then it would be String, if its `_instance2_` then it would be Number.

Does it depend on the last defined instance, which is _instance2_😐?

No, the compiler will thrown an error

```
 No type class instance was found for  
  
    Main.MyCoolTypeClass Int  
                         t1  
  
  The instance head contains unknown type variables.   
  Consider adding a type annotation.
```

its telling, it can’t decide which instance to pick.

So how do you resolve it?

By Explicitly giving out the type,

```
\>>> let a = convertAToB 12 :: String  
\>>> a  
\>>> "12"
```

We have made the compiler to choose `MyCoolTypeClass Int String`by explicitly mentioning the type of the second parameterized variable in `MyCoolTypeClass` (as String).

Compiler can’t decide which instance to pick unless **_it_** **_knows the_** **_type of all parameterized variables_** in the type class. (read it once again)

Okay, just remember what I just told.

Now let’s move on to the next example.

> **Goal** : I want to create a type class for making api calls, which knows how to create a request object and decode the response.

I will call my type class RestEndpoint,

```
class RestEndpoint req resp where  
  makeRequest :: req -> Headers -> Request  
  decodeResponse :: String -> F resp
```

Consider `Headers` as a List of Tuple and Request as a newtype of record which holds all the neccassary information to make an api call.

```
 type Method = String  
type URL = String   
  
newtype Headers = Array (Tuple String String)  
  
newtype Request = Request   
                  { headers :: Headers  
                  , method :: Method   
                  , payload :: String  
                  , url :: URL }
```

Now let’s create our request and response type,

```
newtype CreateOrderRequest = CreateOrderRequest   
                            {orderId :: String, amount :: Number }    
  
newtype CreateOrderResponse = CreateOrderResponse {status :: String }  
  
\--- derive encode,decode instances
```

If you are following along, the above code still wont compile

Now the compiler tells something new,

```
The declaration makeRequest contains arguments that couldn't be determined.  
  These arguments are: { resp }
```

I told you one thing to remember, I will restate it once again

> Compiler can’t decide which instance to pick unless **_it_** **_knows the_** **_type of all parameterized variables_** in the type class.

If you look at all the type classes(Show and MyCoolTypeClass) we defined before, all the methods have all the type we parameterized the type class with,

E.g, `MyCoolTypeClass`has two parameterized type `a` and `b` , and both of its method `convertAToB` and `convertBToA` has both `a` and `b` in their function declaration.

But in `RestEndPoint` typeclasss, we are only passing `req` to `makeRequest` then how does the compiler know what the type of `resp` is, if it doesn’t know what `resp` is, how does it know which instance to choose?

The same goes with decodeResponse, you can even try type-annotating it,

```
let response = decodeResponse someStringFromApicall :: F CreateOrderResponse
```

but still the compiler can’t infer what is the type of `req` is from the above line, so it doesn’t know which instance of RestEndPoint to pick…

So how can we make this work?

How can we force the compiler to infer the other type when one of the type is known.

Can we have some kind of mapping? Which will let the compiler infer `b` when `a`is known, and vice versa.

Yes, that’s exactly what we can do with functional dependencies.

Let’s add functional dependency to our type class,

```
class RestEndpoint req resp | req -> resp, resp -> req where  
  makeRequest :: req -> Headers -> Request  
  decodeResponse :: String -> F resp
```

If you haven’t noticed, we have added the below lines to our type class,

```
| req -> resp, resp -> req 
```

> Note: The syntax start with a pipe `|` , followed by all the dependencies as `| a1 -> a2, a2 -> a3, .....`

The functional depedencies above are telling the compiler that,

1.  If you know `req` type you can infer `resp`
2.  If you know `resp` type you can infer `req`

So there’s one to one mapping between `req` and `resp`

That means, you can’t create,

```
instance restEndPoint1 :: RestEndpoint Request1 Response1 where  
   .....   
  
instance restEndPoint2 :: RestEndpoint Request1 Response2 where  
   .....
```

The compiler will throw error on the second instance, that you can’t define another instance with `req` as `Request1`

```
Overlapping type class instances found for  
  
    Main.RestEndpoint Request1  
                      Response2  
  
  The following instances were found:  
  
    Main.restEndPoint1  
    Main.restEndPoint2  

```

Because `req -> resp` indicates theres a mapping from `req` to `resp` , in the above case `Request1` is already mapped to `Response1` , so you can’t map `Request1` with another `Response2` ….

The same thing happens if you try to do it in the reverse order, having different `req` for a single `resp` (since `resp -> req` )

```
instance restEndPoint3 :: RestEndpoint Request1 Response2 where  
   .....   
  
instance restEndPoint4 :: RestEndpoint Request1 Response2 where  
   .....
```

There’s not any change in defining the instances,

```
instance instanceCreateOrderRestEndpoint ::RestEndpoint CreateOrderRequest CreateOrderResponse where   
    makeRequest req headers = Request   
                            { headers : headers  
                            , method : "POST"  
                            , payload : encodeJSON req  
                            , url : "https://mydomain.com/create/order"  
                            }  
  
    decodeResponse resp = decodeJSON resp
```

In your code, you can call `makeRequest` and `decodeResponse` with the corresponding `Request` and `Response` type, and the compiler can infer the other type on its own, leading to the selection of the right instance.

It’s not at all possible without the help of functional dependencies.

**Take away :**

When your member function (function inside type class), doesn’t have all the parameterized types specified in the type class, then you want functional dependency to help compiler choose the right instance.

Let’s go through the above line with our `RestEndPoint` type class as an example,

*   When your member function (function inside type class) : **_makeRequest and decodeResponse_**
*   doesn’t have all the parameterized types specified in the type class

```
\--- Doesn't have \`resp\`  
makeRequest :: req -> Headers -> Request   
  
\--- Doesn't have \`req\`  
decodeResponse :: String -> F resp 
```

*   then you want functional dependency to help compiler choose the right instance

```
| req -> resp, resp -> req
```

Bonus: More Dependencies
------------------------

We wrote dependency between one type to another type, like

```
req -> resp, resp -> req
```

But have you wondered whether we can create dependency between n types to m types?

Like when we know 2 of the three types, can we infer the third type? and the other way around?

Yes its absolutely possible,

```
class DummyClass a b c | c -> a b, a b -> c where  
  func1 :: c -> String  
  func2 :: a -> b -> String
```

The syntax is

```
| type1 type2 ... typeN -> type100 type101 ... typeM
```

when we know `type1, type2 .. typeN`, we can infer `type100, type101 ... typeM`

Thanks for reading the article, hope you have learnt a good amount of “functional dependency”. In the next article, lets understand how typeclass work behind the hood.