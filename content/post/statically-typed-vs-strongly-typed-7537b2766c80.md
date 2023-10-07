Statically Typed vs Strongly Typed
==================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----7537b2766c80--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----7537b2766c80--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----7537b2766c80--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fstatically-typed-vs-strongly-typed-7537b2766c80&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----7537b2766c80---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----7537b2766c80--------------------------------)·5 min read·Aug 5

\--

Listen

Share

Static typing and strongly typed concepts have been one of the most perplexing topics I’ve encountered. While they seem clear individually, I’ve often struggled to distinguish them from each other, questioning how one can exist without the other. Though I occasionally still grapple with these thoughts, I’ll try to share my understanding in this article.

Statically Typed vs Strongly Typed

Before comparing these two distinct jargons, let’s begin by briefly comparing each of them with their respective counterparts

**Statically Typed vs Dynamically Typed**

They define **when the** **type-check happens**.

**Statically typed** : In a statically typed language, every variable and function must be **explicitly** **annotated with a fixed type signature** by the programmer. This crucial step enables the compiler to determine and validate all the data types during the compilation process.

**Dynamically Typed**: In a dynamically typed language, types are only resolved at runtime based on the values they hold during program execution. As a result, the compiler completely disregards type-checking during the compilation process.

**Thought Experiment**: Let’s say you have a function, it has a if-else branch, inside the `if` you are returning an `**int**` and within `else` you’re returning a string.

*   What would be the return type of your function, string or int?
*   Which of the above typing allows the behavior?
*   Can you have overloaded functions on dynamically typed languages?

Strongly Typed vs Weakly Typed
------------------------------

This topic is quite opinionated and lacks a universally fixed definition on its own.

However, many people agree on the following definition,

The S_trongly/Weakly_ typed nature of a language concerns the implicit type casting performed by the language or, the **degree of flexibility the language exhibits in converting one data type to another**.

**Weakly Typed :** Think of weakly typed languages as individuals who are extremely agreeable. When you attempt to perform operations with completely different data types, they readily handle implicit type conversion on your behalf (Doing all sort of things to keep the party going)

**Strongly Typed :** On the other hand, strongly typed languages are the complete opposite. They do not compromise when it comes to type rules. If you want to add a string with an int, then you have do it explicitly. (No implicit coercion of types) and you cannot randomly cast any type to any other type, there are rules, strict rules.

**Thought Experiment**:

Let’s say you are trying to add a String with an Int

*   Should I convert the `Int` to `String` and do string concatenation or,
*   Should I convert the `String` to `Int` and do arithmetic addition?

This completely depends on the language, That’s why implicit conversions are more susceptible to unexpected behaviors. Look at javascript😂

Now the real question
=====================

So now coming back to the actual question, what’s the difference between statically and strongly typed languages?

From the above comparison, I can already tell a very crucial difference

> Statically typed languages focus on resolving type information of all the expressions at compile time,
> 
> Strongly typed languages prevents implicit type conversion and enforce strict rules for explicit type casting.

I guess the distinction will be much clearer once we look at some snippets where I will be comparing languages that are,

1.  Statically typed but weakly typed (C language)
2.  Dynamically typed but strongly typed (Python)

1\. Statically and Weakly typed — C, C++
----------------------------------------

In order to define a variable/function we have to declare its type signature first, that’s what makes a language statically typed.

But how can a language be weakly typed if it has types predefined?  
Take a look at this example,

```
int add\_one(int a){  
    return a + 1;  
}  
  
int main() {  
    int res1 = add\_one('a');  
    int res2 = add\_one(97);  
    printf("%d %d", res1, res2); // 98 98  
    return 0;  
}
```

Even though our function `add_one` is telling explicitly(statically) that it wants a `int` we are still able to pass a `char` (‘a’) and get our function to work.

The reason behind this behavior lies in C’s weakly typed nature, where it implicitly converts the character ‘a’ to its ASCII representation of 97.

In a weakly typed language, I can write the below code without getting any errors,

```
int num = 42;  
float pi = 3.14;  
          
// Implicit conversion: int to float  
num = pi;
```

Consider Java, which is statically and strongly(mostly) typed language, if I try to do the same it will throw error.

```
int num = 42;  
double pi = 3.14;  
        
// error: incompatible types: possible lossy conversion from double to int  
num = pi;
```

**2\. Dynamically and Strongly typed — Python**

In Dynamically typed languages, there’s no type checks done by compiler.

The strongly typed nature make sure no implicit type conversion happens behind the scenes and there are strict type rules on every operation.

Let’s see what I mean by that with an example,

```
def add\_one(num):  
    return num + 1   
  
def main():  
    # TypeError: can only concatenate str (not "int") to str  
    res1 = add\_one('a')   
  
    res2 = add\_one(97)  
    print(res1, res2) 
```

Python being a dynamically typed language doesn’t put any restriction on the type of the argument to `add_one` , **However, the validity of operations within the function is determined at runtime based on the type of the argument passed.**

For Example, when passing a character as the argument to `add_one`, the arithmetic addition with 1 becomes invalid. The strongly typed nature of python doesn’t do implicit conversion like C. If types are not matching, it will throw `TypeError` at runtime.

To achieve similar behavior as the above C program, I need to explicitly convert the character to its ASCII representation using `ord()`.

```
\>>> add\_one(ord('a'))  
98
```

Strongly typed languages enforce strict rules on data types for every operation. Considering the above example, according to python we can concatenate a string with another string, not any other datatypes.

TLDR;
-----

> Statically declared types make sure your code type checks at compile time
> 
> Strongly typed nature make sure your code also type checks at runtime and the code follows strict type rules.

More Thoughts
-------------

**I used to ponder on this question** : Do we truly need strong typing in languages that are both statically and strongly typed? Reflecting on C’s statically but weakly typed nature, where unrestricted type casting still passes code checks, which is quite scary. I concluded that the combination of both static and strong typing provides the best balance for predictable code behavior.

I hope you enjoyed the article and gained a clear understanding of the fundamental difference between statically and strongly typed languages.

I’m still learning their difference, If you have any insights or thoughts to share, I’m all ears and eager to learn from you as well.