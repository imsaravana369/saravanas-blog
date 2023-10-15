+++
title = 'stacked-package-service-location-routing-logging'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

Stacked Package — Service Location, Routing & Logging
=====================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----b8bdc1e6c839--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----b8bdc1e6c839--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----b8bdc1e6c839--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fstacked-package-service-location-routing-logging-b8bdc1e6c839&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----b8bdc1e6c839---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----b8bdc1e6c839--------------------------------)·6 min read·Jul 19, 2021

\--

Listen

Share

Hello everyone, I’ve already written an article about how we can handle loading states and errors easily with the stacked package.

_In this article, we will see about various services provided by the stacked package._

The stacked package provides various functionalities like **service location, routing, logging**, etc. It makes them really easy by code generation, all you need to do is just annotate a class with `@StackedApp` and specify the services you want.

First, declare the dependencies in your `pubspec.yaml`,

```
dependencies:  
  **stacked: ^2.2.2**  
  **stacked\_services: ^0.8.10**dev\_dependencies:  
  **build\_runner:   
  stacked\_generator:**
```

Routing
=======

Photo by [José Martín Ramírez Carrasco](https://unsplash.com/@martinirc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/route?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

**Setting up**
--------------

1.  **Annotate a class with @StackedApp**

Create a file, the name is of your choice🙃, I name it `app.dart`

Then, let’s specify some **routes** for our app,

```
**@StackedApp(  
  routes:\[** MaterialRoute(page: HomePage,initial: true),  
    MaterialRoute(page: LoginPage), **\]  
)**  
class **App**{  
   //empty class, will be filled after code generation  
}
```

*   We just declared two routes and set our HomePage as our initial route.
*   This also supports, nested routes([docs](https://pub.dev/packages/stacked))

**2.Run the code generator command**

```
flutter pub  run _build\_runner build --delete-conflicting-outputs_
```

This will generate

> `_app.router.dart_` : Auto-generated from the **routes** parameter.
> 
> `_app.locator.dart_` : Auto-generated from the **dependencies** parameter.
> 
> `_app.logger.dart_`: Auto-generated from **logger** parameter.

> You have to run the command each and every time, you make some changes to the @StackedApp

**3\. Specify onGenerateRoute,navigatorKey in your MaterialApp**

```
class MyApp extends StatelessWidget {  
  @override  
  Widget build(BuildContext context) {  
    return MaterialApp(  
        title: 'My APP',  
        **navigatorKey: StackedService._navigatorKey_,  
        onGenerateRoute: StackedRouter().onGenerateRoute**,  
    );  
  }  
}
```

*   The Navigator key is very important, it is the one that enables us to navigate through pages without explicitly using context.
*   StackedApp uses auto\_route to generate `app.router.dart` file. The great thing about that is, it creates a Router argument class for each Route(with the same arguments in the constructor), which you can use while navigating to the target class.

Let’s say our LoginPage looks like this,

```
class LoginPage extends StatelessWidget {  
  **String id;  
  LoginPage(this.id);**  
  //...  
}
```

The `app.router.dart` has a `**LoginArguments**` class that acts as a holder for the constructor arguments,

```
class LoginPageArguments {  
  final String id;  
  LoginPageArguments({required this.id});  
}
```

How we can use it? Suppose let’s say we are inside a ViewModel

```
_//within a viewModel  
_void move(){  
     //after registering navigationService as dependency(more on this later)  
     **locator.get<NavigationService()**  
            .navigateTo(  
                Routes._loginPage_,  
                 **arguments:** **LoginPageArguments(id: '1')**);  
      
    /\* #### Equivalent to #####  
     _Navigator.of(context)  
              .pushNamed(Routes.loginPage,  
                  arguments:{id:1});  
_    \*/   
}
```

This will navigate us to the Loginpage with the passed argument. The argument unmarshalling will be done by the stacked package.

*   We can’t skip any `required` arguments when using the LoginPageArguments, this gives **compile-time safety** for passing arguments.

```
**arguments:** **LoginPageArguments() //error, must pass 'id'**
```

*   As you can see, we are navigating without using any context in our business logic layer. This is one of the key benefits of using Stacked Service.

Photo by [Diana Polekhina](https://unsplash.com/@diana_pole?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/injection?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

2\. Dependency Registration
---------------------------

You can register your dependencies inside the stackedApp annotation, it reduces much of the registration boilerplate code of the `get_it` package. I have written an article on get\_it, if you are interested you can read it [here](https://medium.com/nerd-for-tech/implement-service-locator-design-pattern-with-get-it-flutter-5e50671bbbcb).

1.Specify the dependencies inside @StackedApp
---------------------------------------------

```
//code snippet from the official docs  
**@StackedApp**(  
routes : \[ ... \],  
**dependencies**: \[  
    **LazySingleton**(classType: ThemeService, resolveUsing: ThemeService.getInstance),_// abstracted class type support_  
    **LazySingleton**(classType: FirebaseAuthService, asType: AuthService), **Singleton**(classType: NavigationService),**Factory**( classType: Counter)**,****Presolve**(  
      classType: SharedPreferencesService,  
      presolveUsing: SharedPreferencesService.getInstance,  
    ),  
  \],  
)
```

2\. Run the Command
-------------------

Don’t forget to run the command,

```
**flutter pub  run _build\_runner build --delete-conflicting-outputs_**
```

> This will generate **app.locator.dart**, which holds all the dependencies you’ve specified.

3\. Call setupLocator() from runApp()
-------------------------------------

Also, don’t forget to call the setupLocator() from the runApp(),

```
import './**app.locator.dart**';  
void main() {  
  **setupLocator()**; //this function is inside the **_app.router.dart_** file  
  runApp(MyApp());  
}
```

**The 4 Registration types**

1.Singleton & LazySingleton
---------------------------

*   Singleton — only one instance is created and reused all the time.
*   LazySingleton — Similar to Singleton but the instance is created only when the user requests it the first time, not while during the app startup, which may save some start-up time.

**Parameters:**

*   **classType**: The type of the class to be initiated.
*   **asType**: The type of the class to be exposed.
*   **resolveUsing**: We need to pass a static function here, which can return the instance of `classType`.

Example:

```
//abstract parent class  
**abstract class AuthService** {  
    bool get isLoggedIn;  
    void login();  
    void logout();  
    void register();  
}
```

Our implementation of AuthService

```
**class FirebaseAuthService extends AuthService** {  
    //implements all the required methods of AuthService  
}
```

Now we want to initiate the FirebaseAuthService and expose its type as its parent type(AuthService),

```
**AuthService** authService = **FirebaseAuthService**();
```

We can register the service with the same logic using,

```
LazySingleton(**classType**: **FirebaseAuthService**, **asType**: **AuthService**)
```

2\. Factory()
-------------

Sometimes we don’t want singletons, we want a new instance every time we call `locator.get<T>()`. It can be achieved using Factory() registration.

```
**Factory**(classType: Dog,asType: Animal,);
```

is equivalent to

```
Animal animal = new Dog();
```

In get\_it it is equivalent to,

```
locator.registerFactory<Animal>(() => Dog());
```

3\. Presolve()

Suppose let’s say you want to do some **_Future_** computation before registering the object, you can use _Presolve()_.

```
Presolve(  
      classType: SharedPreferencesService,  
      **_presolveUsing: SharedPreferencesService.getInstance_**,  
    ),
```

*   presolveUsing: It also takes a static method like `resolveUsing` but it  must return a future of the specified type. `Future<classType>`

```
**static** Future<SharedPreferencesService> getInstance() **async** {  
  **//...**  
}
```

As you can see `getInstance()` is a static method that returns a future of the specified type `SharedPreferencesService.`

*   If we try to register without presolveUsing, it will register the type of `Future<SharedPreferencesService>` not `SharedPreferencesService.`
*   presolveUsing ‘**await’** until the future is completed and registers the instance.

> If you have any dependency registered that needs to be preSolved then you have to change your main function into a **Future and await the setupLocator** call.

```
Future main() **async** {  
  **await** setupLocator();  
  runApp(MyApp());  
}
```

3\. Logging
-----------

How do you debug your program? Using print(), it’s time to change. Stacked Package provides `logger` out of the box.

**1.Specify the logger in @StackedApp**

```
**@StackedApp**(  
routes: \[..\],  
**logger: StackedLogger()  
**)
```

**2\. Install Logger pacakge**

```
dependencies:  
  ...  
  logger:
```

You can call the getLogger(), which returns a Logger, it is more like a print() but formats the message neatly and give it a certain level of importance.

```
**class** **MyViewModel** {  
**final** logger = getLogger('MyViewModel');  
**void** move() {  
    //importance level from low to high  
    logger.**v**("Verbose log");  //verbose  
    logger.**d**("Debug log");    //debug  
    logger.**i**("Info log");     //info  
    logger.**w**("Warning log");  //warning  
    logger.**e**("Error log");    //error  
    logger.**wtf**("What a terrible failure log"); //you know this  
  }  
}
```

> Make sure the **Class name** you’re passing to getLogger(), is same as the class you are at. This will help the logger to automatically print the method name.(move() in this case)

This will print the below message to your console

emoji className | methodName — error msg

You can also filter the logs with the log level, suppose if you want to print only the logs with log level from ‘_warning’_. You can do,

```
void main() {  
  runApp(MyApp());  
  **Logger._level_ \= Level.warning;** //prints only \['warning','error','wtf'\] logs  
}
```

If you want to get the Logger with some other method instead of `getLogger()`, you can override it in the `StackedLogger`.

```
@StackedApp(  
  routes:\[..\],  
  logger: StackedLogger(  
    **logHelperName: 'getMyLogger'** //default: 'getLogger'  
  )  
)
```

You can call the logger with,

```
getMyLogger(‘className);
```

