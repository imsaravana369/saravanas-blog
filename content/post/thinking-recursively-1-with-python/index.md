+++
title = 'thinking-recursively-1-with-python'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Thinking Recursively #1
=======================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----ac48ae78201a--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----ac48ae78201a--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----ac48ae78201a--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fthinking-recursively-1-with-python-ac48ae78201a&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----ac48ae78201a---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----ac48ae78201a--------------------------------)·6 min read·Aug 17, 2021

\--

Listen

Share

Recursion is one of the hard concepts to grasp in programming. Even though we all started our programming journey by writing a recursive factorial function, well after that, most of us take the iterative approach(loops) for solving problems. Even I’ve done the same. But I found how fascinating recursive functions are after taking a Haskell Course. So I thought of sharing it with you.

I’ve decided to replicate the Haskell recursive functions in python. I will also provide pseudo-codes so that anyone can understand the logic.

This article will introduce you to some basic recursive functions, which are very relevant for grasping recursion concepts, I will write about more advanced ones in future articles.

Photo by [Ludde Lorentz](https://unsplash.com/@luddelorentz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/infinite-spiral?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Base Case
---------

Recursion is nothing but a function calling itself. But how does a function know it’s time to stop calling itself. That is called **base cases**. Every recursive function has **at least one base case**.

How do we know what are the base cases?
---------------------------------------

They are the smallest units of the recursive function whose output we know in advance. For example

> •We know the factorial of 0 is 1, so it is the base case of the factorial function.
> 
> •We know the 1st Fibonacci number is 1 & 2nd Fibonacci number is also 1. So they are the base conditions for finding the nth Fibonacci number recursive function.

In this article, we will see how we can solve the below-given problems recursively

> 1\. Factorial
> 
> 2\. GCD of a number
> 
> 3\. Reverse a Number
> 
> 4\. Integer Log of base K
> 
> 5\. Largest Divisor of a number
> 
> 6\. Length of a list

1.Factorial
-----------

Consider the below recursive factorial function,

```
\>> factorial(5)  
**120**
```

If you look at how the function call takes place, it will look something like

```
factorial(5)  
5\*factorial(4)  
5\*(**4\*factorial(3)**)  
5\*(4\***(3\*factorial(2))**)  
5\*(4\*(3\***(2\*factorial(1))**))  
5\*(4\*(3\*(2\***(1\*factorial(0))**))) //base-case  
5\*(4\*(3\*(2\*(1\***1**))))   //factorial(0) returns 1  
5\*(4\*(3\*(2\*1)))  
5\*(4\*(3\*2))  
5\*(4\*6)  
5\* 24  
120
```

If I don’t specify the base case, the function keeps on calling itself which will result in Stack Overflow.

```
#if base case isn't specified  
5\*(4\*(3\*(2\*(1\***(0\*factorial(-1))**))))  
5\*(4\*(3\*(2\*(1\*(0\*(-1\***factorial(-2)))**))))  
...  
...
```

**2.Computing GCD**
-------------------

Do you know how we can compute the [gcd](https://en.wikipedia.org/wiki/Greatest_common_divisor) of a number recursively? Its quite simple

```
FUNCTION INTEGER GCD (INTEGER NUM1, INTEGER NUM2)  
        if NUM1==0   
            RETURN NUM2  
        else  
            RETURN GCD(NUM2, NUM2 MOD NUM1)
```

python code for gcd```
gcd(20,25)    
gcd(25%20,20) => gcd(5,20)    
gcd(20%5,5)  =>  gcd(0,5)  
**5 is returned  since basecase is met (num1=0)**
```

3.Reversing a Number
--------------------

Given a number “1234”, our goal is to reverse it as “4321” How can we do that recursively?

```
//PSEUDOCODE  
FUNCTION INTEGER **REVERSENUMBER**(INTEGER N)  
     return REVERSENUMBER\_UTIL(N,0)FUNCTION INTEGER **REVERSENUMBER\_UTIL**(INTEGER N, INTEGER RES)  
     IF N==0  
         RETURN RES   
     ELSE  
         INTEGER REM = N MOD 10  
         INTEGER QUOTIENT = N DIV 10  
         RETURN REVERSENUMBER\_UTIL(QUOTIENT, RES\*10 + REM ))
```

If you look at the pseudo-code, I have separated the reverse() function into `**reverse(n)**` and `**reverseUtil(n,res)**`  This is very common in recursive functions. Inside the `reverse()` function(the function that is called by the user) we can do configuration changes like setting the default values, do some validation checks, etc, then call the utility function from the function, which is the real recursive function.

*   I’m passing the default value as **0 to the parameter ‘res’.** So that user can call the function with `reverse(n)` instead of `reverse(n,0)` (We are hiding the implementation details here)
*   **Validation Checks** — Our function will fail if we pass negative values. So before calling the actual recursive function. We can throw an error if the value passed is a negative number or we can change it into a positive number then pass it to the utility function.

```
FUNCTION INTEGER **REVERSENUMBER**(INTEGER N)  
    IF N>=0  
        return REVERSENUMBER\_UTIL(N,0)  
    ELSE  
        return **\-1 \* REVERSENUMBER(-N)**
```

Python code

In python, we have a concept called default parameter. If you don’t specify a value to that parameter its default value is used. So you can call the above function with

```
\>>> reverse(1234)     
4321
```

Let's see how the functions are resolved behind the hood,

```
1.**reverse(1234)**2.reverse(1234/10, 0\*10+ 1234%10)   
  reverse(123, 0+4)  
  **reverse(123, 4)**3.reverse(123/10, 4\*10 + 123%10)  
  reverse(12, 4\*10 + 3)  
  **reverse(12,43)**4.reverse(12/10, 43\*10 + 12%10)  
  reverse(1, 430+2)  
  **reverse(1,432)**5.reverse(1/10,432\*10 + 1%10)  
  reverse(0, 4320 + 1)  
  reverse(0,4321)6\. Base case hit (n=0)  
   so, return 4321 
```

4\. Computing Integer Log of base k
-----------------------------------

> _Log of a number is the power to which the base should be raised to get the number._

For eg. Logₖ(N) = x . The expression says ‘**k’ raised to the power x gives N.**

```
log₂(8) = 3  
2³ will give 8
```

In, Integer Log we will floor the result, for example

> log₂(9) = **3.169925**

We fill floor it and return the result as 3

```
FUNCTION INTEGER\_LOG(INTEGER N, INTEGER BASE) IF N<BASE OR BASE<=1:  
              RETURN 0 ELSE  
            RETURN 1 + INTEGER\_LOG(N DIV 10, BASE)
```

The base condition is

1.  `N<Base` that means if the number is less than the `base` then return 0 because the `base` raised to any power(≥1) will always yield value more than n. E.g logₙ(1),logₙ(2),…logₙ(n-1) will always yield 0.
2.  `Base≤1` This is very apparent, logₖ(n) = undefined for any k≤1.

```
intLog(20,2)  
\= **1+intLog(10,2)**  
\= 1+**(1+intLog(5,2))**  
\= 1+(1+**(1+(intLog(2,2))**))  
\= 1+(1+(1+**(1+(intLog(1,2))**))  
\= 1+(1+(1+(1+**0**))))  #base-case hit, n<base, 1<2  
\= 4
```

5\. Largest Divisor
-------------------

Given a number, find the largest divisor of that number.

> E.g
> 
> Largest Divisor of 50 is 25
> 
> Largest Divisor of 25 is 5
> 
> Largest Divisor of 17 is 1

The PseudoCode is

```
FUNCTION INTEGER **LARGESTDIVISOR**(INTEGER N)  
     IF N>=0   
         RETURN LARGESTDIVISOR\_UTIL(N, N DIV 2)  
     ELSE  
        RETURN LARGESTDIVISOR(-N)  
\-----------------------------------------------------  
FUNCTION INTEGER **LARGESTDIVISOR\_UTIL**(INTEGER num, INTEGER divisor)  
     IF (divisor==1) OR ((num MOD divisor)==0)  
         RETURN B    
     ELSE  
         RETURN **LARGESTDIVISOR\_UTIL**(num,divisor-1)
```

1.  If N≥0, we are calling the utility function with N and N/2. The reason why N/2 is, it is the upper bound of the largest divisor, meaning the largest divisor of any number is half the number `n`.E.g

```
Divisor of 30 is  2,3,5,6,10,15.  
Divisor of 15 is  3,5. 
```

Because for any number k after N/2, `k*2>N` So it’s just a waste of computation to search after N/2 because it’s always going to fail.

2\. If N<0, we convert the negative number to a positive number and pass it to the same function once again. E.g

```
LARGESTDIVISOR(**\-5**) WILL CALL **LARGESTDIVISOR(5)**
```

The logic behind the Util function is we are trying all the numbers from `N/2 … 1` So the first number that divides the Number should be the largest divisor.

In the Util function, the base condition is

1.  If the `divisor` parameter reaches 1, which means it can’t be divided by any other number so it is a prime number. Divisors of any prime number are **1 & itself**. So the largest divisor is 1. (we can’t take the number itself as its largest divisor)
2.  When the ‘**num’ modulo the ‘divisor’ is 0**, that means the `divisor` variable is a divisor of the number. Then we can return the `divisor`.

python code```
largestDivisor(15)   
\= largest\_div\_util(15,15/2)  
largest\_div\_util(15,7)  
largest\_div\_util(15,6)  
**largest\_div\_util(15,5)**  #base-condition met: a%b==0 so return 5  
5
```

6\. Length of a list
--------------------

Have you ever thought of how we can find the length of a list recursively? Let’s see

```
FUNCTION INTEGER LENGTH(LIST L)  
     IF L.ISEMPTY()   
           RETURN 0  
     ELSE  
          RETURN 1 + LENGTH\[1..n\] 
```

Base Condition: We know the length of an empty list is 0

Logic: The length of a nonempty list is, 1 plus the **length** of the remaining elements excluding the first element. We call it the **tail of the list**.

```
tail of \[1,2,3,4\] is \[2,3,4\] 
```

```
length(\[1,2,3,4,5\])  
\=1+length(\[2,3,4,5\])  
\=1+(**1+ length(\[3,4,5\]))**  
\=1+(1+**(1+length(\[4,5\]))**)  
\=1+(1+(1+**(1+length(\[5\]))**))  
\=1+(1+(1+(1+**(1+length(\[\]))**)))  
\=1+(1+(1+(1+(1+**0**))))  #base condition: length(\[\]) = 0  
**output: 5**
```

The iterative approach is more optimized than the recursive approach but yet as a programmer, we all need to experience the magic of recursion and since the world is slowly moving from object-oriented to functional programming, learning to solve a program recursively will surely make you a better functional programmer.

