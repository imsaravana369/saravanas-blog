Let’s play with Heterogeneous data types — purescript-heterogeneous — Exploring purescript-modules #2
=====================================================================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----847391430d00--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----847391430d00--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----847391430d00--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Flets-play-with-heterogeneous-data-types-purescript-heterogeneous-847391430d00&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----847391430d00---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----847391430d00--------------------------------)·5 min read·Sep 24, 2022

\--

Listen

Share

This is the second article in the series `#exploring-ps-modules`. In this article, we are going to look into the `purescript-heterogeneous`package which is exclusively developed for mapping and folding over heterogeneous data structure. Okay what do I mean by heterogeneous data structure here?

All the types that can hold more that one value at a time is called heterogeneous data structure, or types. Example, Tuples can hold more than one value at a time, a left and right value. So they are called heterogeneous data types. But Arrays aren’t heterogeneous as all the elements can be of one type only.

Photo by [Alexander Grey](https://unsplash.com/@sharonmccutcheon?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/different-colors?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

The most common heterogeneous type we deal with in purescript is Record. I always wondered how can we map over Records, then I came across this wonderful package `[purescript-heterogeneous](https://pursuit.purescript.org/packages/purescript-heterogeneous/0.3.0)`

First, lets suppose all the fields in your record is Homogeneous (same type)

```
type Names =   
  {  father     :: String  
  ,  mother     :: String  
  ,  son        :: String  
  ,  daughter   :: String  
  }
```

and you want to uppercase each and every fields, can you do that with normal `map` ? Hell no, why? Because record isn’t a [Functor](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Data.Functor#t:Functor).

So how can we do that?

```
capitalizeNames :: Names -> Names   
capitalizeNames names = hmap toUpper names
```

Look closely, I haven’t used `map` I have used `hmap` which is provided by the package `purescript-heterogeneous.`

I have come across a situation where I have a record and I just wanted to add `Just`to each and every value in the record. I wondered how could I do that? can we do something like the above?

```
justRecords names = hmap Just names -- will throw error
```

No we can’t, why? Because each and every field could be of different types, so whats the type of `Just` would be? `String -> Maybe String` , or `Int -> Maybe Int` etc… It should be ideally `a -> Maybe a`

To encapsulate the `a` we need to create a type, (don’t worry its damn simple)

First create a type,

```
data MakeMaybe = MakeMaybe
```

then derive an instance for the `Mapping` class defined in the heterogeneous package.

```
instance makeMaybeMapping :: Mapping MakeMaybe a (Maybe a)   
 where  
     mapping MakeMaybe = Just
```

Mapping type class takes 3 arguments, the first one is the Monomorphic type that you have created, the second and third one are `a` and `b` in the mapping function `(a -> b).` In our case, it is `a -> Maybe a`

In the above code, I’m telling to convert the type `a` to `Maybe a` using `Just` , you could also put `Nothing` in place of `Just` which will convert every fields to `Nothing` (But who would want such a function?😑)

and using it is also very easy, you just `hmap` with that type that you’ve created.

```
makeMaybe names = hmap MakeMaybe names
```

The type signature of makeMaybe will look something like,

```
type MaybeNames = {  father     :: Maybe String  
                  ,  mother     :: Maybe String  
                  ,  son        :: Maybe String  
                  ,  daughter   :: Maybe String  
                  }makeMaybe :: Names -> MaybeNames   
makeMaybe = ....
```

> Note: In the above example, fields could be of any type, until they are wrapped with Maybe.

See, `hmap`has transformed our record type into completely new type. They are lot of things that we can do with `hmap`, for instance if you want to convert all the field type to string, you can do something like

```
\--- create a type  
data MakeString = MakeString\--- create the Mapping instance   
instance makeMakeString :: (Show a) => Mapping MakeString a String  
  where  
     mapping MakeString = show\--- create a method that does the mapping  
makeString names = hmap MakeString names
```

So easy, isn’t it?

But what if you can’t unify the types like above (by using constraints like `Show` saying that all fields have show instance or by blindly using the universal quantifier like `forall a`) ?

What if you want to have a separate mapping function for each and every fields? can we do that with this package? Yes my friend !!

But you have write some boiler plate while creating the instance, but be with me it’s so simple & you will get used to it very quickly.

First, as usual let’s create a data type which wraps a record (of functions in this case).

```
data ZipProps fns = ZipProps { | fns}
```

Previously we were creating `Mapping` typeclass instance, but in this case we are going to use `MappingWithIndex` which gives us field name via `Proxy`

```
instance zipProps ::  
  (IsSymbol sym, Row.Cons sym (a -> b) tail fns) =>  
  MappingWithIndex (ZipProps fns) (Proxy sym) a b where  
  mappingWithIndex (ZipProps fns) prop = Record.get prop fns
```

Okay, this might be confusing, let me dissect it

MapWithIndex takes 4 parameter

1.  `ZipProps fns`— The Datatype that you have created, in our case its ZipProps which wraps the record of functions.
2.  `Proxy sym` — This gives us the name of the field.
3.  `a` — The type of the field
4.  `b` — The type of the field after transforming it with the function.

```
IsSymbol sym, Row.Cons sym (a -> b) tail fns
```

Now let’s look at the constraints,

1.  `IsSymbol sym` — Indicates that the `sym` in the proxy is a symbol(S[ymbols](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Data.Symbol) are just type level strings, you could use `reflectSymbol` to convert Symbols to Strings)
2.  `Row.Cons sym (a -> b) tail fns` — This constraint is telling field name `sym` has the type `a->b` (a function from a to b) along with the remaining rows `tail` will make the whole record `fns` . It translates to something like the below block

```
fns = { sym :: (a -> b)  
      , ... tail   
      }
```

Now let’s look at what the definition mean,

```
mappingWithIndex (ZipProps fns) prop = Record.get prop fns
```

`Record.get` takes two parameters, a proxy which has the field name as symbol and the actual record and give the value back. Its like accessing

```
fns.prop -- where fns is an object and prop is the field name
```

The above line will return a function that goes from `a -> b` where the type of the corresponding field with the same name is `a` . Example if the `father` field is of type `String` , then `father` field in fns is a function that goes from `String -> sometype` (it must take the same type as the argument)

Now let’s create a zipping function, that takes record of function and apply them to record of the elements with the same field name.

```
\--- the zipping function  
zipRecord fns record = hmapWithIndex (ZipProps fns) record\--- the mapping function   
fns =  { aNumber :  \\num  -> num + 1  
       , aString. : \\str  -> str <> "!!"  
       , aBool    : \\bool -> not bool   
       }\--- the record to be transformed  
num = { aNumber : 2   
      , aString:"Hello"  
      , aBool : false }\>>> zipRecord fns num  
{ aNumber: 3, aString: "Hello!!", aBool: true }
```

> Note : The field names should match each other

The heterogeneous package also provides a way to fold record but we are not going to look at it in this article that would be a topic of other day.

I hope you learnt some cool stuff and got to know how cool😎 the heterogeneous package is, which can make working with record super flexible and easy.

Will see you in the next article with some other cool package. Clap👏 if you’ve liked this article and share it with your friends if you find this article helpful.