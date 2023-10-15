+++
title = 'implement-service-locator-design-pattern-with-get-it-flutter'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Implement Service Locator design pattern with get\_it — Flutter
===============================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----5e50671bbbcb--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----5e50671bbbcb--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----5e50671bbbcb--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fimplement-service-locator-design-pattern-with-get-it-flutter-5e50671bbbcb&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----5e50671bbbcb---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----5e50671bbbcb--------------------------------)·7 min read·Jul 14, 2021

\--

3

Listen

Share

In this article, we are going to see how we can implement a service locator design pattern with the get\_it package in flutter.

Photo by [Markus Spiske](https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/dependency-injection?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Service Locator design pattern
==============================

In a service locator design pattern, we maintain a central registry that provides instances of services when they are requested by the service consumers or the service clients. It is very similar to dependency injection but they are not the same.

If you don’t understand the design pattern, I’m sure you will understand it after reading this article.

Why we need these?
==================

we don’t do something new unless there were some faults in how we did that before. Let’s see why we are going for design patterns like service locator or dependency injection.

Let’s start with an example,

We want to create a custom Logger for our application, let’s create an interface for it.

```
abstract class Logger{  
  void log(String msg);  
}
```

Let’s say we want to create two implementations, a simple console logger and a file logger.

*   ConsolerLogger

*   FileLogger

If you want to use that in your flutter application, what would you do?

1.  Create an instance of what Logger you want.
2.  Just pass the message to be logged to the log() function.

```
void main(){  
  Logger myLogger = ConsoleLogger();  
  //Logger myLogger = FileLogger();  
  myLogger.log('file accessed');  
}
```

What’s wrong with the approach?

*   The calling method/class, main() in this case, has to create the instance of Logger class which is not good. What if you want to have the instance at multiple classes? You have to instantiate the method everywhere by yourself.
*   You may say, okay I will declare it as a singleton. Problem solved! No, that’s not enough! Because it will be really hard to unit test singletons and many times you don’t want singletons.

There’s no way we can mock ConsoleLogger class.

*   You can provide the objects through inherited widgets or using Providers but it will become very cumbersome and also you can’t access the objects outside your UI without passing the buildContext.

So how we can overcome the below problems,

1.  Hide the instance creation from client classes.
2.  Make unit testing easy.
3.  Avoid cluttering the UI tree with special Widgets to access your data as the provider or Redux does.

**We can use the get\_it package**

get\_it Package
---------------

Add get\_it to your pubspec.yaml file,

```
dependencies:  
  **get\_it: ^7.1.4**
```

As I mentioned, before

In a service locator design pattern, we maintain a **central registry** that provides an implementation of different interfaces. It is very similar to dependency injection but they are not the same.

We will be registering all the instances under one method and call the instance from main() before calling runApp() to make sure every instance is registered before the app starts,

**locator.dart**

```
import 'package:get\_it/get\_it.dart';**final serviceLocator = GetIt.instance**; // GetIt.I is also valid  
void **setUp()**{  
 serviceLocator.registerLazySingleton<Logger>(  
               () => ConsoleLogger());  
 serviceLocator.registerSingleton<Model>(()=> MyModel());  
 // register more instances  
}
```

We are declaring the serviceLocator instance globally so that we can access it anywhere in the application. Here the **central Registery is the GetIt.instance,** which holds all the registered instances.

The setUp() (or any name of your choice) method is the place where we register all our instances.

```
void main(){  
     **setUp();** //call this method before runApp()  
     runApp(MyApp());  
}
```

To get the registered instance use get<T>() method

```
Logger logger = serviceLocator.**get<Logger>()**; 
```

get\_it provides various methods to register the instances. Let’s look at them one by one.

Different ways of Registration
------------------------------

1.registerSingleton(T instance)
-------------------------------

We use this method to register a singleton instance(one instance is created and the same instance is returned whenever we call get<T>()).

```
serviceLocator.**registerSingleton**<Model>(MyModel());
```

2.registerLazySingleton(FactoryFunc<T> factoryFunc)
---------------------------------------------------

This method is also used to register a singleton instance but it does that lazily, the object is instantiated only when get<T>() is called the first time, whereas the registerSingleton method instantiates the instance when the setUp() method is called and make the instance readily available.

```
serviceLocator.**registerLazySingleton**<Model>(()=>MyModel());
```

3.registerFactory(FactoryFunc<T> factoryFunc)
---------------------------------------------

We use this method to return a **new instance of type T every time** we call get<T>()

```
serviceLocator.**registerFactory**<Model>(()=>MyModel());
```

Remember that you can’t pass any parameters to the Constructor dynamically using registerFactory().

Suppose let’s say your MyModel() class takes a parameter,

```
class MyModel{  
     String name;  
     MyModel(this.name);  
}
```

How can you register this instance in get\_it?

4.registerFactoryParam(FactoryFunc<T`,P1,P2`\> factoryFunc)
-----------------------------------------------------------

Using this method we can instantiate instances that take at most 2 parameters in their constructor.

Consider this model class,

```
class Person{  
     String name;  
     int age;  
     **MyModel(this.name,this.age);**  
}
```

You can register an instance of Person class using,

```
serviceLocator  
  .**registerFactoryParam<Person,String,int>**  
   ((name, age) => Person(name,age));
```

> **registerFactoryParam<Type,Param1,Param2>**
> 
> Type: The type of the class to be registered
> 
> Param1: The type of the 1st parameter
> 
> Param2: The type of the 2nd parameter

To get the instance,

```
var logger = serviceLocator.get<Person>**(param1:'user',param2: 20)**;
```

If you want only one instance, set **void** to the second param

```
serviceLocator  
  .registerFactoryParam<MyModel,String,void>  
   ((name, \_) => MyModel(name,20));
```

Then you don’t need to pass param2,

```
var logger = serviceLocator.get<Person>**(param1:'user')**;
```

5\. registerFactoryAsync(FactoryFuncAsync<T> func)
--------------------------------------------------

Sometimes we need to instantiate an object asynchronously, we can register those kinds of objects using this method.

Consider an example,

In this scenario, the recent Event can only be created asynchronously. We can register the instance using

```
serviceLocator.**registerFactoryAsync**<Event>(  
               () => **Event._createRecentEvent_()**);
```

To get that instance, we must use **getAsync<T>(),** it will return Future<T>

```
void main() async{  
    Event event = await serviceLocator.**getAsync<Event>()**;  
    //...  
} 
```

We have async support for all the above-specified methods like

*   **registerSingletonAsync()**
*   **registerLazySingletonAsync()**
*   **registerFactoryParamAsync()**

For more info, check the [official docs](https://pub.dev/packages/get_it) of get\_it

Registering using names
-----------------------

What if you want to register two instances of the same type, can we do something like this?

Code that Doesn’t make sense😵

**No**, we can’t, it will throw an error because by default get\_it allows types to be registered only once. You can change it by setting

```
void setUp(){  
 **serviceLocator.allowReassignment=true;**     //registrations  
}
```

But when you call **get<WebService>()**, you will get the WebService that is registered at the end. Then how can we have two instances of the same class and consume them in our code?

**instanceName parameter**
--------------------------

instanceName is a keyword parameter that we can pass to any registration method while registering the instances. If we use instanceName, our instance is registered with a **name along with the type**.

We can get the instance by,

```
var webserive = serviceLocator  
                 .get<MyWebService>(**instanceName: 'v2'**);   
                 // get the second registred webservice
```

> All the registered instances of the **same Type must have unique instanceNames**.

Example:

To get the instances,

```
var webserive = serviceLocator  
                 .get<MyWebService>**(instanceName: 'v2')**;   
                 //will return the second registred MyWebService  
var db = serviceLocator  
                 .get<MyDatabase>**(instanceName: 'v2')**;  
                 //will return the second registred MyDatabase
```

There are still many things that we can do with get\_it, the official document has everything covered, you can take a look at it [here](https://pub.dev/packages/get_it).

dispose parameter
-----------------

Sometimes we need to do some stuff like closing a stream, writing to log while unregistering, or resetting the registered instances. That can be specified in the dispose parameter.

```
serviceLocator.registerSingleton(  
         MyWebService(),  
         dispose: (webservice) => webservice.closeConnection());
```

Every register method has the dispose functionality.

**Unregistering an instance**
-----------------------------

We can unregister an instance, when we don’t want the instance anymore or when we want to reinitialize it.

The syntax is

```
**void** unregister<T>({Object instance,String instanceName, **void** Function(T) disposingFunction})
```

> **instance:** The instance to be unregistered.
> 
> **instanceName:** The name of the registered instance to be unregistred.
> 
> **disposingFunction :** The function to be called while unregistering.

1.  To unregister by **Type** alone, use

```
serviceLocator.unregister**<MyWebService>**();
```

2\. To unregister by instanceName, use

```
serviceLocator.unregister<MyWebService>**(instanceName:'v1')**;
```

3\. To unregister by the instance itself, use

```
var myWebservice = serviceLocator  
                     .get<MyWebService>(instanceName:'v1');  
// ....  
serviceLocator.unregister<MyWebService>**(instance:myWebservice)**;
```

> When you’ve specified the **instance** parameter, **instanceName** parameter is not taken into account

*   If you want to do any disposing function before unregistering the instance you can use the **disposingFunction()**

```
serviceLocator.unregister<MyWebService>(  
   **disposingFunction: (webservice)=> webservice.closeConnection()**);
```

> When you specify the disposingFunction()**,** the dispose function that you specified while registering the instance is not considered.

To unregister **lazySingletons** use,

```
**void** resetLazySingleton<T>({Object instance,  
                            String instanceName,  
                            **void** Function(T) disposingFunction})
```

Resetting GetIt completely
--------------------------

You can completely delete all the registered instances and start fresh using the **reset()** function.

The syntax is :

```
Future<**void**\> reset({bool dispose = **true**});
```

This method comes in very handy when we are doing unit tests, where we want to clear all the registered instances frequently(for every test or every group).

```
await serviceLocator.**reset()**;
```

*   If `**dispose=true**`, will call the dispose functions of every registered type if we’ve specified one while registering.
*   If `**dispose=false,**` unregister all the registered types without calling any of the dispose functions.

ServiceLocator design pattern?
==============================

If you look at how get\_it works, you can clearly see it’s just helping us to find(Locate) the instances(Service) that we’ve already created. That’s why it comes under service Locator design pattern but not under Dependency Injection.

**Dependency Injection**

Dependency Injection resolves the dependency for you. It will create the dependency of the instance for you behind the scenes.

If you do dependency injection for the above class, the consoleLogger and the fileLogger **will be injected for** **you**, when you try to create a HybridLogger. You don’t want to create the dependencies manually and pass them to the constructor.

But with service Locator you have to inject the dependencies manually, as far as I know, we can inject the dependencies manually in two ways,

1.  **Use serviceLocator(GetIt.instance) within the class (not recommended)**

The above code is bad. Why? We may forget to register the dependencies(ConsoleLogger or FileLogger), **which may raise a run-time error.**

Example:

**2\. Constructor Injection + get\_it (good practice)**

This will help us to achieve dependency injection(to some extent) through `get_it` , but still, we have to create all the instances and pass them manually.

This ensures we register all our dependencies. But when our app gets too big it’s better to use a dependency-injection package like [injectable](https://pub.dev/packages/injectable).

> The main difference is how the dependencies are located, in Service Locator, client code request the dependencies, in DI Container we use a container to create all of objects and it injects dependency as constructor parameters (or properties).

Hope you’ve got some insights into the get\_it and how the get\_it package can be used to manage our dependencies efficiently, there is so much to explore in the get\_it package. Please don’t forget to check the [official documentation](https://pub.dev/packages/get_it).

