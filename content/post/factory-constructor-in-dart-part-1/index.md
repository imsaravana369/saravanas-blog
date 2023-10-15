+++
title = 'factory-constructor-in-dart-part-1'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Factory Constructor in Dart — Part 1
====================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----1bbdf0d0f7f0--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----1bbdf0d0f7f0--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----1bbdf0d0f7f0--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Ffactory-constructor-in-dart-part-1-1bbdf0d0f7f0&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----1bbdf0d0f7f0---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----1bbdf0d0f7f0--------------------------------)·2 min read·Jun 25, 2021

\--

2

Listen

Share

Factory constructor is one of the confusing topics for beginners in dart. To understand it better, one must understand the factory design pattern first.

Image src : [https://www.freepik.com/jcomp](https://www.freepik.com/jcomp)

What is Factory Design Pattern?
-------------------------------

**Definition:** _In a Factory pattern, we create objects without exposing the creation logic to the client and refer to newly created objects using a common interface._

If you’re confused, let me try to explain it via code and the **factory** construct.

If we need to create the object of these subclasses with the following criteria,

1.  Give **Doberman** instance, if the user wants a dog to guard
2.  Give **Labrador** instance, otherwise.

How can we naively do that?

This is fine in one place, what if you want this logic in multiple places? You have to repeatedly use the if-else statement. How can we simplify this? The answer is **factory constructor.**

Now we have moved the instance creation logic to the parent class. How can we use the construct?

To create a guard dog, use

```
Dog myGaurdDog = Dog.createDog(name:’Rocky’,gaurdDog:true);
```

Otherwise use,

```
Dog myPetDog = Dog.createDog(name:’Tommy’,gaurdDog:false);
```

Now if you look at the factory design pattern definition, it is more understandable

1.  **_we create objects without exposing the creation logic to the client_**

yes, we haven’t exposed the object creation logic to the client(_main()_ method), it’s hidden inside our parent class ‘Dog’, the client needs to call the factory constructor with the required parameters to get the needed object.

2\. **_We_ _refer to newly created objects using a common interface._**

This is also true, we are returning an instance of Labrador(or Doberman) with type **Dog,** not as **Labrador(or Doberman).** The parent class is the common interface here as it is compatible with both the sub-classes.

