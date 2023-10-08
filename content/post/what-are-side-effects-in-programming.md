What are Side-Effects in Programming?
=====================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----51f7ef340f98--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----51f7ef340f98--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----51f7ef340f98--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fwhat-are-side-effects-in-programming-51f7ef340f98&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----51f7ef340f98---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----51f7ef340f98--------------------------------)·3 min read·Dec 19, 2021

\--

Listen

Share

If you’ve started learning functional programming chances are high that you often come across the term side effects. But have you ever wondered what that term actually means? I will try to demystify what it actually means in this article.

Photos by [Spmemory](https://www.istockphoto.com/portfolio/SPmemory?mediatype=photography) on [istock](https://www.istockphoto.com/)

Side-Effects
------------

A function is said to have a side-effect when the function changes a non-local state or when its output is not deterministic.

A function as we know has its own scope, it’s safe if we mutate variables within its scope. We call them side-effects when it **uses or changes** stuff outside its scope like a variable passed by reference, global variable, reading user input from the console, logging to console, doing database operations, etc.

1\. Mutating Non-Local State
----------------------------

The _no\_of\_adds_ global variable here is acting like a counter to keep track of how many times the add function is called.

2\. Reading non-local state
---------------------------

Global states don’t only necessarily be global variables, it can be anything. It can be a file in your disk, a remote database, your console screen, etc.

**YES, Database writes, printing to console, etc** are also considered as side-effects because they are mutating something in the outside world. If you are trying to write something to your remote database, it depends not only on the arguments that you pass but on many factors like internet connection, the permission you have, whether the table exists, etc **which is non-deterministic**.

In the case of printing to console, the console belongs to your OS so writing to a console is considered as mutating a global state.

> You may try to do something like  
> \>>>writeToDb(“person\_table”, {‘name’: ‘Thanos’, ‘age’: 1001})

*   The first time, it fails due to the fact you don’t have write-permission to the _person\_table_.
*   You set the permission now and you can successfully write to the table.
*   Now assume you are passing the same arguments, now this time it fails because you have violated an integrity constraint. i.e name is a primary key and Thanos already exists (you added it 😂)
*   Now as you can see, the result not only depends on the arguments passed but also the history & outside context which **may or may not be in our control.**

Programs with side effects become really hard to debug as our program’s behavior becomes non-deterministic. That’s why people prefer writing pure functions ( Functions without side effects) but it’s literally **impossible** to write real-world applications without any side effects.

How to Handle Side Effects?
---------------------------

1.  Try to separate pure functions from impure functions. So that you can mock impure functions when testing.

we can mock getAge() function while testing.

2\. The golden principle used by many functional programming like Haskell, Purescript, etc is **“Make side-effects explicit”** The function signature itself tells that it has side effects. For e.g, Consider the getLine function signature in Haskell which is used to get input from the user.

```
getLine :: IO String
```

Here we are explicitly telling in the method signature itself that the function is going to do an IO operation. So whichever function that’s using the getLine() must also be aware of it.

In a nutshell, a function is said to have side effects when it depends on or modifies a state outside its scope. Even though it is not possible to write real-world applications without side effects we must handle them with care to avoid hours of debugging or if possible use a functional programming language that makes programmers be more disciplined in handling side effects. It’s hard for a programmer to be always disciplined as we got deadlines😵‍💫, so opt for FP when possible.

Thank you very much for reading. Clap👏 if you’ve liked the article, share your thoughts in the comment section.