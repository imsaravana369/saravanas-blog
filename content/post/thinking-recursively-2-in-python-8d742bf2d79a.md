Thinking Recursively #2 in Python
=================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----8d742bf2d79a--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----8d742bf2d79a--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----8d742bf2d79a--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fthinking-recursively-2-in-python-8d742bf2d79a&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----8d742bf2d79a---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----8d742bf2d79a--------------------------------)·4 min read·Aug 19, 2021

\--

Listen

Share

This is my second article on how to think recursively in python. In my [previous article](https://medium.com/nerd-for-tech/thinking-recursively-1-with-python-ac48ae78201a), I’ve solved some basic recursive problems. In this article, we are going to solve 2 complex recursive problems which will improve the way you think recursively. Let’s get straight into that.

Photo by [Grooveland Designs](https://unsplash.com/@groovelanddesigns?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/spiral?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Zig Zag Array
-------------

Given an array, tell whether the elements are in a zig-zag manner. Zig-Zag means the elements at an odd position should be smaller(or greater) than their adjacent elements.

If you look at the problem closely, our logic looks something like this

```
arr\[0\]**<**arr\[1\]**\>**arr\[2\]**<**arr\[3\]**\>**arr\[4\]….. (for low-high zig-zag array)  
DOWN -- UP -- DOWN -- UP -- DOWN -- ...
```

```
def isZigZag(arr):   
    return isUpDown(arr) or isDownUp(arr)
```

The reason why I’ve taken the `**logical or**` is the array is a zigzag array if it is either a **_high-low_** zigzag array or a **_low-high_** zigzag array.

Input: \[1,5,2,4,1,6\]

```
isZigZag(\[1,5,2,4,1,6\])  
\= isUpDown(\[1,5,2,4,1,6\]) or isDownUp(\[1,5,2,4,1,6\])  
\= **False** or isDownUp(\[1,5,2,4,1,6\])  
\= isDownUp(\[1,5,2,4,1,6\])\=**((1<5) and isUpDown(\[5,2,4,1,6\]))**   
\=(True and **(5>2 and isDownUp(\[2,4,1,6\]))**  
\=(True and (True and **( 2<4  and isUpDown(\[4,1,6\]))** )\=(True and (True and (True and **(4>1 and isDownUp(\[1,6\]))**))  
\=(True and (True and (True and (True and **(1<6 and isUpDown(\[6\]))))  
**\=(True and (True and (True and (True and (True and **True**))))#basecase  
\= **True**
```

We can combine the above two functions and write them recursively as,

Permutation of a List
---------------------

I will tell you, how we can arrive at a pure recursive way of finding the permutation of a list( without backtracking). The method is not optimistic but it really makes you understand _recursion_.

Given a list {arr₀, arr₁,…. arrₙ}. We can find the permutation of the list

1.  If we have the permutation of the list starting from {arr₁,…. arrₙ}
2.  Then we insert `arr₀` in all the positions of each of the permutation sub-arrays that we got from step 1. See the below example for better understanding,

Consider the list \[1,2,3\]

```
Step 1: Find the permutation of \[2,3\]. It is **\[ \[2,3\], \[3,2\] \]**Step 2: Insert 1 at all the positions of each of the permutation sub-arrays. Permutation\[0\] = \[2,3\]   //**first sub-array** of permutation(\[2,3\])  
Insert 1 at index 0 =  \[1,2,3\]  
Insert 1 at index 1 =  \[2,1,3\]  
Insert 1 at index 2 =  \[2,3,1\]#############################################Permutation\[1\] = \[3,2\]   //**second sub-array**   
Insert 1 at index 0 =  \[1,3,2\]  
Insert 1 at index 1 =  \[3,1,2\]  
Insert 1 at index 2 =  \[3,2,1\]
```

This is how we can deduce the permutation of a list recursively.

First, let’s write a function interleave() that does only **step 2.**

Consider the input : `arr = **[2,3,4]**, elementTobeInserted = 1`

Here’s how the call stack looks like, (you will surely understand the below explanation😊)

> Below Indentations represent **new call stacks**

```
  
\>>interleave(1,\[2,3,4\])  
1\.  res = \[1,2,3,4\]  #line 12, the possibility that we know for sure  
    head = 2  
    tail = \[3,4\]  
    #line 14 => **interleave(elementToBeInserted,tail)**   
                **interleave(1, \[3,4\] )** will be called  
                res = \[1,3,4\]  
                head = 3  
                tail = \[4\]  
                #line 14 => **interleave(1,\[4\])**  
                            res = \[1,4\]   
                            head = 4  
                            tail =\[\]  
                            #line 14 => interleave(1,\[\])  
                                        **returns \[\[1\]\] #base-case** otherPossiblitiesArr = \[\[1\]\]  
                            add 4(head) to the front => \[\[**4**,1\]\] **returns** \[**\[1,4\],**\[4,1\]\]                otherPossiblitiesArr= \[\[1,4\],\[4,1\]\]  
                Add 3(head) to the front => \[\[**3**,1,4\],\[**3**,4,1\]\]  
                returns \[**\[1,3,4\]**,\[3,1,4\],\[3,4,1\]\]  
                 otherPossiblitiesArr = \[**\[1,3,4\]**,\[3,1,4\],\[3,4,1\]\]  
   add 2(head) to the front => \[\[**2**,1,3,4\],\[**2**,3,1,4\],\[**2**,3,4,1\]\]  
   returns \[**\[1,2,3,4\]**,\[2,1,3,4\],\[2,3,1,4\],\[2,3,4,1\]\]
```

I hope seeing the call stack will clearly tell you how the function works. Let’s code the permutation function which will use the above `interleave()` function to deduce all the permutations of the given list.

```
\>>>permutation(\[1,2,3,4\])  
#call stack  
\>> head = 1  
   tail = \[2,3,4\]  
   tailPerm = permutation(\[2,3,4\])  
            >>head = \[2\]  
              tail = \[3,4\]  
              tailPerm = permutation(\[3,4\])  
                       >>head = 3  
                         tail = \[4\]  
                         tailPerm = permutation(\[4\])  
                                    returns **\[\[4\]\]** #base-case  
                           
                         _loop 1:_ interleave(3,\[4\]) = \[\[3,4\],\[4,3\]\]  
                         returns **\[\[3,4\],\[4,3\]\]**  
                
              _loop 1:_ interleave(2,\[3,4\])= \[\[2,3,4\],\[3,2,4\],\[3,4,2\]\]  
              _loop 2:_ interleave(2,\[4,3\])= \[\[2,4,3\],\[4,2,3\],\[4,3,2\]\]  
              returns **\[\[2,3,4\],\[3,2,4\],\[3,4,2\],  
                       \[2,4,3\],\[4,2,3\],\[4,3,2\]\]**  
     
   _loop 1:_interleave(1,\[2,3,4\]) = \[\[1,2,3,4\],\[2,1,3,4\],\[2,3,1,4\],\[2,3,4,1\]\]  
   .....  
   _loop 6:_ interleave(1,\[4,3,2\]) = \[\[1,4,3,2\],\[4,1,3,2\],\[4,3,1,2\],\[4,3,2,1\]\] returns **\[\[1,2,3,4\],\[2,1,3,4\],\[2,3,1,4\],\[2,3,4,1\],.....,\[4,3,2,1\]\]**
```

As you can see how elegant🦄 the solution is, it's all about understanding the subproblems. Once you see every problem not as a whole but as a bunch of subproblems, it will be very easy to think recursively.

I hope you’ve enjoyed this article and understood the working of recursive functions. If you really like these kinds of recursive functions, I strongly recommend you to learn a functional programming language([Haskell](https://www.youtube.com/watch?v=EfmyKgYjNP8&list=PL3pGy4HtqwD2-bYXI3_4LWQyafXp4-olc) may be a good place to start from).

Thanks🙏 for reading. Clap👏 if you’ve liked this article. I will write more about recursive functions in my upcoming articles.