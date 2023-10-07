Enhanced Error Handling with V: A Superior Alternative to Either
================================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/?source=post_page-----d5fd68f82164--------------------------------)

[Saravanan M](https://medium.com/?source=post_page-----d5fd68f82164--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fimsaravananm.medium.com%2Fenhanced-error-handling-with-v-a-superior-alternative-to-either-d5fd68f82164&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----d5fd68f82164---------------------post_header-----------)

5 min read·Jun 8

\--

Listen

Share

How many of you are using Either to handle errors? What if I tell you it’s hiding🫣 some stuff from you?

Photo by [Conor Samuel](https://unsplash.com/@csbphotography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/pMsebqxRnxs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Let’s suppose I have a `Person` type and I want to validate it.

and I’ve decided to write my validator function using`Either` like,

and when I call,

```
\>>> validatePerson {name : "", age : 21, email : "saravana@gmail.com" }
```

It will give me,

```
(Left "Name shouldn't be empty")
```

So far so good, it’s really capturing the error,

but when I do,

```
\>>> validatePerson {name : "", age : -273, email : "youmail.com" }
```

It will still give me the same error.

```
(Left "Name shouldn't be empty")
```

But seriously? Shouldn’t it have shown all the errors at once? I mean, this way it kind of misleads us into thinking that only the name is wrong, when in reality, there are also issues with other fields as well.

Imagine if compilers adopted the same approach, showing one error at a time, forcing developers into a never-ending cycle of fixing and recompiling.

Why only one Error?
-------------------

The implementation of the [bind](https://pursuit.purescript.org/packages/purescript-prelude/6.0.0/docs/Control.Bind#t:Bind) instance in Either follows a short-circuiting behaviour, where encountering a Left value leads to the immediate termination of the computation, disregarding any remaining code within the Either function.

How to accumulate Errors?
-------------------------

While Either allows the inclusion of any value in its Left position, when it comes to error accumulation, we want our Left type to be at least a [Semigroup](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Data.Semigroup#t:Semigroup).

> Semigroup is a category that supports the append (<>) operation.

Semigroup let us concatenate errors on the go.

Either is not **enforcing Semigroup/Monoid instance** **for its Left type** in any manner, which is why it is unable to accumulate errors.

> **For example:** Do you think we can accumulate the Errors if your left value is `_Boolean_` ? How can you accumulate Booleans? By ‘and’, ‘or’, ‘xor’?

What exactly do we want?
------------------------

We want to,

*   Capture all errors without halting the program’s execution.
*   Have a Semigroup constraint on Error type so that it can always be accumulated.

It becomes evident that Either is not a suitable choice. Therefore, the question arises: **Is there an alternative type that satisfies both of these criteria?**

We have V to the rescue
=======================

The package `[purescript-validation](https://pursuit.purescript.org/packages/purescript-validation/6.0.0/docs/Data.Validation.Semigroup#t:V)` provides a type named [**_V_**](https://pursuit.purescript.org/packages/purescript-validation/6.0.0/docs/Data.Validation.Semigroup#t:V)  that fulfills all the requirements mentioned above.

The applicative instance of `V` is designed to accumulate all errors while ensuring that its **_Left type always adheres to the semigroup constraint_**.

Although it may sound complex, V is essentially just a wrapper around Either.

```
newtype V err result = V (Either err result)
```

> Note: The semigroup instance is enforced in its Apply instance. You can check the implementation [here](https://github.com/purescript/purescript-validation/blob/v6.0.0/src/Data/Validation/Semigroup.purs#L89).

How to Use V?
-------------

If you are planning to shift from Either To V, the only adjustment required is to update your error type to any type that is a [semigroup](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Data.Semigroup#t:Semigroup).

> Example of Semigroups are **String, Array, List** etc.

For example, I changed `validateName` function as

```
validateName :: String -> V String String  
validateName name = if null name  
                  then invalid "Name shouldn't be empty"  
                  else pure name
```

Observe here that,

*   Instead of returning `Left` I’m using the `[invalid](https://pursuit.purescript.org/packages/purescript-validation/6.0.0/docs/Data.Validation.Semigroup#v:invalid)` function
*   Instead of `Right` I’m doing `pure` (actually we could’ve used pure in `Either` function also)

Although not necessary, it may be interesting to examine the implementation of “invalid” and “pure” for V,

```
invalid = V <<< Left --- first convert to Left and then lift to V  
pure = V <<< Right --- first convert to Right and then lift to V
```

Assume now that you have converted all the above validation function from `Either String a` to `V String a` , how should the `validatePerson` function be written?

If you have already done some applicative functor stuff, the syntax that i’m going to throw will be less weird, or else😅

```
validatePerson :: Person -> V String Person  
validatePerson person = {name : \_, age : \_ , email : \_}  
                      <$> (validateName person.name)  
                      <\*> (validateAge person.age)  
                      <\*> (validateEmail person.email)
```

> Note: If you want to actually understand the syntax, you can read from [here](https://pursuit.purescript.org/packages/purescript-prelude/6.0.1/docs/Control.Applicative#t:Apply).

But what if I tell there’s a much easier and more readable alternative?

The syntax above bears a striking resemblance to the Either function we previously implemented. But there’s a catch, we are no more using `do` and `pure`. They are replaced with `ado` and `in`

*   `ado` is a syntactic sugar for `<*>` , just like how `do` is for `>>=`
*   Finally the ado block needs to end with `in`

Writing the Actual Code
-----------------------

After examining the syntax for utilizing V with ado, I have a slight modification to my requirement. Instead of utilizing `String` as the Left type, I now wish to **accumulate errors in an Array**. Therefore, in the below code snippet, I will adjust my error type to `Array String`.

Let’s swiftly test our validation function on the REPL.

```
\> validatePerson {name : "", age : -273, email : "youmail.com"}  
  
invalid (\["Name shouldn't be empty", "Age shouldn't be less than 0", "Email ID should have @"\])
```

Impressive, isn’t it?

Our modified version of validation function using V is indeed working and serving our exact purpose of accumulating all the errors that happened during our validation process

Some Final Insights
===================

While it is true that Either can provide performance benefits by short-circuiting when a computation fails, but it’s lack of informative error messages makes troubleshooting way challenging.

**V** addresses this limitation by providing better and whole error messages, improving the debugging experience.

If my goal is to handle errors, I would **personally choose V over Either**.

In my view, receiving a single error is akin to receiving no result at all. So if I desire the short-circuiting behaviour of Either, I would rather opt for Maybe, which also offers short-circuiting behaviour.

Another alternative is to use [WriterT](https://pursuit.purescript.org/packages/purescript-transformers/6.0.0/docs/Control.Monad.Writer.Trans#t:WriterT), which can be used to achieve the same behaviour. Here’s an example code [snippet](https://try.purescript.org/?code=LYewJgrgNgpgBAWQIYEsB2cDuALGAnGAKEJWAAcQ8AXOABQKgjCJPMpoBEkqkA6AMRBQwSAEaw4ACgBmQsAEpWFanACi06TADGNSes07FpZTQAqeAJ60IBAMpa8KMruwBGADRxsAJk9lPVDAAHlSeUCgAzqFw6Mxo0eFoANaeBGjMeJ5a4DBGbCoAwiDxeEK8CMVIYLwA6o6BeErscFw8vKooVLiNxs2tfMgWokS9Kv28tlSOaADmUtnxqGgRnmjQUHkmLdx8k9MzvLTcDRiSR1Qnkry88pt9O7ymEGSwkk8vMFc3ioRUFmTwWj4CLFOAAXjgAG80EhgPAAFzwuB7dAzTxIGYIpEASXinhgwFQUDgiORU1RAF9iAA3JDhESBABysKxZP2cAAtAA%2BOB1Tr4KQAQTweCQFjZqPkUkGwwls0UtPp3BgzLhcBhaohKGk6vW6pZhDgRuNJtNxq6MAwgSgxIA2gAiVXwCLYEDQMBoADkNFlBOcFntAF04AAqHlkGzwRkgLqow1mhMmmBQCLwCMEOAAEjgACkIFF9WqaXSUAyYILMSScfFOTy%2BQ0hSKxXKZlLJDL4LiqAqS2WK-AMfAtTrB3AADxwAAM8cTiYtVuTdvt-bgLrdwi9PvgsAiETgXSQGEnQdD4cjcGjsdmM9nZuTqbg6fg2bzBdHxEIitLytUhJQxNJFFZlrXl6gFSRhVFcUgNbaUxVlGCeyVQJfyJOACTQ4c4AWHh0D3M5jnwDB7QAAXtKUMP-G9bxNedH3PF98xoSjiWomijXveBrSXVD-zgbEOFXV13S8JBqXgMjgzDeiM0vbA40-XtlSBPAQQwUkVLUkD63AyDm0QuChkBYFiiQ79Ak00EAVU0EITAEA2LgYAnXHDk4C-MsXOstTeA1IgE2AFcxzcjzlRXbzil4QdHOAXjiWC9ylJQv9iQitBeBYxynyzOB7Mc00-NcpynXyk1RwSwLMVK40WKK2KUuqo1suzaEWXRTF8RSqkE2IP91KRfRtBoABVNBOkIPrwVyhyjVgXR3gkAg93wPApQhPAIDQHS8By0KLJMjBIULBE4Hte12pOjlvAAdgAZk6tCkXtCw3RS3hsmAe1urgNIMhy2RhDgG9bS8VwcsCEIcvtIpyAgHgqBQUElugKgnvHHk10wH6YAiG9PDccHghobN7VUEVKDgAB5LQtEjMB4XtdGhJALGVpvQMb0IIA).

Photo by [Susan Holt Simpson](https://unsplash.com/@shs521?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/H7SCRwU1aiM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I hope you found this article insightful and informative👨‍💻. I would like to hear your thoughts in the comments section: **_Do you prefer V over Either_**? Let me know your opinion.