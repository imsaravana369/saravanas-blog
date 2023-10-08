How default parameters could cause Havoc— Python
================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----e6cb3d8fefb8--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----e6cb3d8fefb8--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----e6cb3d8fefb8--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fhow-default-parameters-could-cause-havoc-python-e6cb3d8fefb8&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----e6cb3d8fefb8---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----e6cb3d8fefb8--------------------------------)·3 min read·Jul 19, 2021

\--

Listen

Share

This article is something I write from my personal experience. Many a time I got stuck for hours because of the strange behavior of default parameters in python. That’s what I’m going to share in this article.

What are Default parameters?
----------------------------

Default parameters are parameters with a default value, which are optional to pass while calling the function. If the function is called without the argument, the argument will be assigned the default value.

```
def callPerson(name='guest'):  
 print(f'hello {name}')
```

If you invoke the function,

```
\>> callPerson('saravana') #  hello saravana\>> **callPerson() #  hello guest**
```

This is how the default argument works,

*   You pass it a value, it whole-heartedly accepts and uses that.
*   If you don't pass any value, it doesn’t complain, it uses the value it has.

Photo by [Mehdi](https://unsplash.com/@messrro?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/bomb?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

**Then what’s the problem with default arguments?**

Default arguments don’t have any problems of their own. It’s when it is assigned a **mutable object like** a **list, dictionary, set,** or any **user-defined class.**

> Using Mutable objects as default argument values may cause Havoc

As you know, mutable objects can change, mutate.

```
myList = \[1,2,3\]  # list - mutable  
myList\[0\] = 10    # Fine✌myTuple = (1,2,3) # tuple- immutable  
**myTuple\[0\] = 10   # ERROR🚫**
```

Now let’s see why mutable objects shouldn’t be used in default arguments.

Let’s start with an example.

```
\>>> def buyStuff(item,**alreadyBought=\[\]**):  
          alreadyBought.append(item)  
          print('You bought ',alreadyBought)\>>> buyStuff('apple',\['mango','jackfruit'\])  
You bought  \['mango', 'jackfruit', 'apple'\]   #fine\>>> buyStuff('apple')  
You bought  \['apple'\]                         #this is also fine\>**\>> buyStuff('apple')  
You bought  \['apple', 'apple'\]**           #Wait, free apple?
```

We just wanted one apple, but we have been given two apples and there’s not `any buy one🍎 get one🍏` offer either🤔

To understand why this has happened? we have to first understand how default arguments work.

> Python’s default arguments are evaluated _once_ when the function is defined, not each time the function is called

*   The first time you define the function with `**alreadyBought=[]**` The `alreadyBought` variable start pointing to an empty list.

alreadyBought variable pointing to an empty List

*   When you append data to it. It will become,

After appending an element to the list.

*   Since the **_alreadyBought variable always points to that list_**, the same list is reused every time, that is why we are getting that strange behavior.

How to avoid this?
------------------

1.  Try to replace the mutable objects with corresponding immutable ones.

```
list() -> **tuple()**  
set()  -> **frozenset()  
**dict() -> [**frozendict(**](https://pypi.org/project/frozendict/)**)**
```

2\. But the above method is not always preferable. What if we really want to have a mutable one?

The safest thing we can do is to assign `**None**` to the default argument in the function definition and assign mutable value to it within the function.

```
\>> def buyStuff(item,alreadyBought=None):  
      **if not alreadyBought:  
           alreadyBought = \[\]**  
      alreadyBought.append(item)  
      print(‘You bought ‘,alreadyBought)\>>> buyStuff(‘apple’)  
**You bought \[‘apple’\]  
**\>>> buyStuff(‘apple’)  
**You bought \[‘apple’\]**
```

Now each time we call the function without `alreadyBought` argument, we will assign an empty list to it, explicitly within the function. But the sad thing is we’ve received only one apple🍎 ☹.

Everyone in the world is blessed!!
----------------------------------

Mutable objects in the default arguments are not an exception for the saying. We can **take advantage** of the strange behavior(not strange anymore) in some cases.

> Sometimes you can specifically “exploit” (read: use as intended) this behavior to maintain state between calls of a function. This is often done when writing a caching function. — [docs](https://docs.python-guide.org/writing/gotchas/)

```
\# ith fibbonaci number using dynamic programmingdef fibbonaci(i,**memo={0:0,1:1}**):  
 if memo.get(i)!=None:  
       return memo\[i\]  
 memo\[i\] = fibbonaci(i-1)+fibbonaci(i-2)  
 return memo\[i\]
```

As you can see we don’t want to pass the `memo` dictionary in each call, it is maintained for us in the default argument.

I hope the next time you know, what to do when you get that `_extra apple🍏_`.Thank you for reading. Clap👏 if you’ve learned something new. If you want to know more, give this [article](https://docs.python-guide.org/writing/gotchas/) a read.