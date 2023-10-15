+++
title = '5-must-know-python-things-for-competitive-programmrs'
draft = true
+++


How many of you are doing competitive programming with python? It can be for anything, you want that dream job, you want to climb the python leaderboard in [Hackerrank](https://www.hackerrank.com/dashboard). Whatever reason. There are certain things you must learn to make your journey smooth and fun. I’m going to share 5 things that is making my journey easy and painless.

{{< img-with-credit image_url="thumbnail.jpg" alt="5 must know python things" >}}
Photo by <a href="https://unsplash.com/@jeremyperkins?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Keenan Constance</a> on <a href="https://unsplash.com/photos/7FOSJVtUtac?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
{{< /img-with-credit >}}

1\. Defaultdict
---------------

Dictionaries are one of the most used data structure in python. You can access, store elements in O(1) time. But we when you try to access it with a non-existent key, it will throw a `KeyError`. what if you want to use a default value when the key doesn’t exist.

You can do something like,

{{< highlight python >}}
>>> itemsBought = {1: ['A', 'B'], 2: ['A', 'C']}
>>> itemsBought[3]  # KeyError: 3
>>> itemsBought[3].append('C')  # KeyError: 3
{{< /highlight >}}

How can we avoid keyError in a non-pythonic way,

{{< highlight python >}}
>>> itemsBought.get(3,[]) # if key doesn't exist return \[\]  
output: []

>>> if not itemsBought.get(3):
       itemsBought[3] = ['C']    
    else:  
       itemsBought.get(3).append('C')
{{< /highlight >}}

How can we remove all the boilerplate code and do the same in a more pythonic-way? The answer is `defaultdict`

*   Import `defaultdict` from the `collections` library.

{{< highlight python >}}
from collections import defaultdict
{{< /highlight >}}
*   Syntax of defaultdict is, `defaultdict(function)`
*   Example:

{{< highlight python >}}
>>> from collections import defaultdict
>>> frequencyDict = defaultdict(int)  # default value is 0
>>> frequencyDict[123]
# output: 0
>>> frequencyDict = defaultdict(lambda: 10)  # default value is 10
>>> frequencyDict['z']
# output: 10

#### Setting list as default value ####
>>> itemsBought = defaultdict(list)
>>> itemsBought[123]  # 123 is a non-existent key
# output: []

>>> itemsBought = defaultdict(lambda: ['apple'])
>>> itemsBought[42]
# output: ['apple']
{{< /highlight >}}

2\. Counter
-----------

This one is super useful, have you ever been asked to find the first 5 most common letters in a string in an interview or do you find yourself writing boilerplate code to find the frequency of a letters in a string many a time? The Counter class can reduce the boilerplate code and it is the pythonic way to count objects.

**1.Import Counter from the collections package.**

{{< highlight python >}}
from collections import Counter
{{< /highlight >}}

**2\. What can you do with Counter?**

{{< highlight python >}}
>>> freqDict = Counter("hello world")
>>> freqDict
Counter({'l': 3, 'o': 2, 'h': 1, 'e': 1, ' ': 1, 'w': 1, 'r': 1, 'd': 1})  # not only strings, you can pass any iterables like list, tuple, etc
>>> freqDict = Counter([1, 1, 2, 3, 3, 4])
>>> freqDict
Counter({1: 2, 3: 2, 2: 1, 4: 1})
{{< /highlight >}}

How to find the **N most common element** in Counter

{{< highlight python >}}
>>> freqDict = Counter('counters are awesome')
>>> freqDict.most_common(5)  # find 5 most common letters
[('e', 4), ('o', 2), ('r', 2), ('s', 2), (' ', 2)]
{{< /highlight >}}

Let’s do some inventory management by tallying how many items you bought and how many items you sold using `counter`

{{< highlight python >}}
>>> itemsBought = {'A':10,'B':10,'C':10} #bought items  
>>> itemsSold = {'A':5,'B':10,'C':7}     #sold items  
>>> inventory = Counter()                #create a counter    
>>> inventory.update(itemsBought)      #update it with bought items   
>>> inventory.subtract(itemsSold)   #subtract it from the sold items  
>>> inventory  
Counter({'A': 5, 'C': 3, 'B': 0})   #items remaining!!
{{< /highlight >}}

**3\. Setting Recursion Limit**

Do you remember, what happened when you forget to set the base case while writing your first recursive factorial function?

```
RecursionError: maximum recursion depth exceeded
```

But you should not hate RecursionError, you don’t want to hang your computer for a day just to find the factorial of 5.

Python default recursion limit is 1000. This is quite good for most of the cases, but not all the time. For some problems, you want to increase your stack depth, to allow for more recursive calls.

**1.Import the sys package**

{{< highlight python >}}
import sys
{{< /highlight >}}

**2\. sys.setrecursionlimit(limit)**

{{< highlight python >}}
sys.setrecursionlimit(10000) 
{{< /highlight >}}

> _The highest possible limit is platform-dependent._ The highest possible limit is platform-dependent.

4\. Comparators in python.
--------------------------

Have you ever been confused on how to sort a counter dictionary with its value or how to sort your Person class with age and name? Let’s see how we can do that,

1.  **key — Transform & Sort**

Sometimes you want to sort the data, after transforming it to some other value.

Examples:

1.Sort the dictionary keys, but based on their values.

2\. Sort a circular list based on the third element to its right.🤣🤣 (yes sometimes you may be asked questions like this. So, be prepared)

How to do it? Use **key**!!

Have you ever heard about the `key` parameter in functions like sort(), it does exactly what I mentioned above, **it transforms the elements to some other values and then sort**!!

```
\>>> fruitsBought={‘orange’:17,  
         ’jackfruit’:5,’apple’:200} #  I Like apples\>>> keys = list(fruitsBought.keys())   #convert the keys to list  
\>>> keys.sort( **key= lambda key: fruitsBought\[key\]** )   
  
\>>> keys  
\['jackfruit', 'orange', 'apple'\]
```

What `key` does is it transforms the elements using the function passed.

```
\>>> keys.sort(key=lambda key: fruitsBought\[key\])
```

*   It first transforms `[‘orange’,’jackfruit’,’apple’]` to `**[17,5,200]**`
*   Then sort the transformed value from `**[17,5,200]**` **to** `**[5,17,200]**`
*   Re-transform that to the original values, `[‘jackfruit’,’orange’,’apple’]`

cmp\_to\_key
------------

If you are from a Java background, it acts exactly like a Comparator. The function takes 2 arguments `a and b`, spits out

> **0** if a=b
> 
> **negative number** if a<b
> 
> **postive number** if a>b

Example:

*   when you want to sort letters in a string based on their frequency, but when two letters have the same frequency then sort them alphabetically.

```
\>>> from collections import Counter  
\>>> **from functools import cmp\_to\_key**  
\>>> def compare(letter1,letter2):  
         freqA = counterDict\[letter1\]  
         freqB = counterDict\[letter2\]  
   
         #just a utility function   
         def comp(a,b):  
           if a==b: **return 0    # a==b**  
           elif a<b: **return -1  # a<b**  
           else: **return 1       # a>b**  
   
         isFreqNotEqual = comp(freqA,freqB) # compare the letters if the frequencies are same  
         if **not isFreqNotEqual**:   
                return comp(letter1,letter2) return isFreqNotEqual\>>> counterDict = Counter(‘aabbcccdd’)  
\>>> keys = list(counterDict.keys())  
\>>> keys.sort(key=**cmp\_to\_key(compare)**)  
\>>> keys  
\['a', 'b', 'd', 'c'\]
```

5\. PYPY3
---------

As we all know, python is slow🐢 when compared to other programming languages like C++,Java. But for god sake, we’ve fallen in love with it. Sometimes we’ve written a very optimal python solution but still, that annoying `TLE` error pops up. To overcome that, there’s a hack. We can use the optimized version of python **PyPy3**(A fast Python implementation with a JIT compiler).

Surprisingly many of the coding platforms like Hackerrank, CodeChef, etc (Not leetCode☹ ) supports PyPy3.

Hackerank supports PyPy2,PyPy3

When you get the TLE error next time, just switch over to PyPy3 and copy-paste your python code and see the TLE vanish.

Hope you’ve liked this article, if you have know any other must-know things please share🤗 it in the comment. Clap👏 if you've liked this article.

