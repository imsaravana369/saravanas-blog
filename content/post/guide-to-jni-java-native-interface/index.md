+++
title = 'guide-to-jni-java-native-interface'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Guide to JNI (Java Native Interface)
====================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----5b63fea01828--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----5b63fea01828--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----5b63fea01828--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fguide-to-jni-java-native-interface-5b63fea01828&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----5b63fea01828---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----5b63fea01828--------------------------------)·4 min read·Dec 11, 2021

\--

Listen

Share

Have you ever wondered “Can we call C/C++ code from Java code?” Yes, we can do that using JNI, an interface provided by JVM to let your java code call a native C/C++ code.

Recently, I’ve found my friend working on JNI in his internship and was really fascinated by the value it can provide. Value? Why in the world do we need to call a C/C++ code in a Java code?

We all know Java is platform-independent (write once, run anywhere) but it comes at a cost, reduced performance when compared to native code. Suppose if you want to write a program that runs as fast⚡ and efficient as native code or you want to use a functionality that a C library provides which is not available in Java. Of course, you can re-write that whole C library in Java but you don’t want to reinvent the wheel again JNI has got your back.

> The primary reason why I’m writing this article is, I and my friend **failed a lot** while trying to replicate a simple JNI program from the web and I don’t want you to go through the rough rut that we’ve gone through.

I’m going to demonstrate this in windows. But it’s easily replicable in any OS once you got an understanding of how to connect the dots.

**Pre-requisites**:

> Java and g++/gcc should be installed on your pc.
> 
> [**JAVA\_HOME**](https://confluence.atlassian.com/doc/setting-the-java_home-variable-in-windows-8895.html) variable should be set.
> 
> [**JDK's** bin](https://www.javatpoint.com/how-to-set-path-in-java) & [MinGW g++](https://stackoverflow.com/questions/48612744/how-to-add-g-from-mingw-to-path/48828104) should be in your path.

1\. Declare a function with the **native** keyword.
---------------------------------------------------

*   We are loading a dll library called **_native(_**it can be of any name). The reason why it’s inside a static block is we need to load the library as soon as our class is loaded.

Run the below command

> **javac -h . HelloWorldJNI.java**

*   \-h . — create a header file that has all the native function declarations that we’ve declared in the java file. The DOT indicates the file should be created in the current directory.

It will generate a header file named “HelloWorldJNI.h” which declares a single function with the same signature(in JNI-Style) as sayHello().

Here’s the **auto-generated** **header** **file** (after removing all the comments)

2\. Create a CPP file and generate an Object file from it.
----------------------------------------------------------

Now we gonna create a C++ file that has a function with the same method signature as in “HelloWorldJNI.h”. (copy-paste the signature from the header file, ctrl+C/ctrl+V our favorite thing)

**Make sure the function signature is the same.**

*   In this c++ file, we are trying to call a native method(_sayHello()_) from our JNI styled-c++ function.
*   Make sure to include the “HelloWorldJNI.h” header file. (if you don’t, You will get **UnSupportedLinkError**)
*   If you’re using any code editor, _#include<jni.h>_ may be underlined with squiggly red lines, its because your IDE can’t find the _jni.h_ file, believe me, it will vanish once we include the path while compiling.

Run the below command,

> **g++ -c -I”%JAVA\_HOME%\\include” -I”%JAVA\_HOME%\\include\\win32" HelloWorldJNI.cpp**

*   \-c — output an object file (.o)
*   \-I — specify an include directory

> ”%JAVA\_HOME%\\include” — path has the jni.h file

We will get an object file(HelloWorldJNI.o) as output which we will use to create a dll(dynamic link library) file.

3\. Create a dll file from the object file
------------------------------------------

Run the below command,

> g++ -shared -o native.dll HelloWorldJNI.o

*   \-shared — Create a shared library file (dll file in windows)
*   \-o native.dll — name it native.dll
*   Make sure the name of the dll file is the same as the name you are loading from your java program.

Now you will see a native.dll in your current directory.

4\. Execute the Java file
-------------------------

Now we have everything to run our Java program. Run the below command or run it as a Java program in any IDE.

> java HelloWorldJNI

Yup, we are done, “Hello from C++ !!” will be outputted to your terminal.

Bonus: Let’s make your life much easier
=======================================

The constant linking and compiling become very tedious if you’re constantly changing your c++ code. So let’s create a batch file,

save this file as **runJ.bat**

You just have to type **runJ** in your console. All the commands will be executed one by one for you, that’s the beauty of batch files.

I hope you have learned something new in this tutorial and no more regretting why you’ve learned C/C++ in your early days. I strongly recommend [this](https://www.baeldung.com/jni) article to get a better understanding of JNI.

> Strange Error: If you’re getting an error, try to run it in cmd instead of powershell (in vs code)

