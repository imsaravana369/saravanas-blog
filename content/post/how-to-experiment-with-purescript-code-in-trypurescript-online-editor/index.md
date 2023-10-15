+++
title = 'how-to-experiment-with-purescript-code-in-trypurescript-online-editor'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Experiment with Puresript code in TryPurescript online Editor
=============================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----4a074659b2aa--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----4a074659b2aa--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----4a074659b2aa--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fhow-to-experiment-with-purescript-code-in-trypurescript-online-editor-4a074659b2aa&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----4a074659b2aa---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----4a074659b2aa--------------------------------)·2 min read·Oct 5, 2022

\--

Listen

Share

This is a very short article on how you could use [https://try.purescript.org/](https://try.purescript.org/) to quickly test the concept that you have learned in purescript.

Photo by [Diana Polekhina](https://unsplash.com/@diana_pole?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/experiment?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

I’m a person who try to put into practise whatever new thing I learned ASAP and online IDEs & compilers helped me a lot when it comes to programming.

As I was learning Purescript, I wanted to experiment the concepts in an online IDE, thats when I found the Purescript’s official online code editor, [Try Purescript](https://try.purescript.org/).

Even though it’s a very good platform and has lot of modules bundled in it, many people I met were not using it, when I asked for the reason they told they didn’t know how to use it for experimenting their code.

It made sense, because many people are used to [console log](https://pursuit.purescript.org/packages/purescript-console/6.0.0/docs/Effect.Class.Console#v:log) or [spy](https://pursuit.purescript.org/packages/purescript-debug/6.0.2/docs/Debug#v:spy) their output. But it’s not possible with Try Purescript code editor as it can only render HTML.

I will tell you a quick way or a hack to make the code editor works like console.

1\. Go to [https://try.purescript.org/](https://try.purescript.org/)
--------------------------------------------------------------------

2\. Remove the Extra stuff,
---------------------------

when you arrive at the online editor, the whole editor is filled with a lot of code.

```
module Main whereimport Prelude.......main :: Effect Unit  
main =  
  render $ fold  
    \[ h1 (text "Try PureScript!")  
    , ...  
    , ...  
    \]  
   where   
     .... 
```

**Remove everything** and only have the minimal imports and main function

```
module Main whereimport Preludeimport Effect (Effect)  
import TryPureScript  (render, h1, text)main :: Effect Unit  
main =  
  render $ h1 (text "Try PureScript!")  

```

3\. Create a function and put your experimental code in it.
-----------------------------------------------------------

```
myAddFunction :: Int -> Int -> Int   
myAddFunction a b = a + b
```

4\. Call the function from main
-------------------------------

```
main :: Effect Unit  
main =  
  render $ h1 (text $ **show** $ **myAddFunction 1 2**)
```

Hola !!

using **try.purescript.org** as console

> Note: Always make sure to use `show` before calling your function in main, because `text` function wants a string

Even though the above steps are very small and silly, I’ve written it with the hope that it will help the developers newly joining the beautiful purescript community.

