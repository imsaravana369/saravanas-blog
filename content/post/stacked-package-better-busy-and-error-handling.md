Stacked Package — Better Busy and Error Handling
================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----643b0131f0a6--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----643b0131f0a6--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----643b0131f0a6--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fstacked-package-better-busy-and-error-handling-643b0131f0a6&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----643b0131f0a6---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----643b0131f0a6--------------------------------)·6 min read·Jul 19, 2021

\--

Listen

Share

Have you ever get frustrated by cluttering your UI with so much **setstate(),** surely we all have gone through that, at least I did. So I started using bloC. But using [bloC](https://pub.dev/packages/flutter_bloc) sometimes was overkill. So I’ve started using the [_provider_](https://pub.dev/packages/provider) _package_ which helped me write clean code. But when I want to navigate to another page, show a simple snack bar I still want to pass my build context to the method, which I don’t like. That’s when I found an awesome package called `**stacked**`, which is built-over `ChangeNotifier`

There are **many features available** in the stacked package. In this article, I will tell you how we can **handle errors and loading states** more effectively using this package.

Let’s see a simple example of we can implement a simple increment counter using the stacked package.

First, let’s see our ViewModel

**BaseViewModel is just an extension of changeNotifier but it provides much more functionality**

There are many subtypes of BaseViewModel like FutureViewModel, ReactiveViewModel, StreamViewModel, and much more. They extend the functionality of the BaseviewModel and reduce much boilerplate code.

Then the below is our simple counter widget(our view).

If you look at the above view(widget), we are wrapping it with **ViewModelBuilder**.

1.  **ViewModelBuilder<T>.reactive()**

*   The T will be the type of the ViewModel we want to provide. (`CounterViewModel` in this case)
*   The viewModelBuilder takes a callback, that will create an instance of the ViewModel.
*   Whenever notifyListeners() is called from the ViewModel, the builder will rebuild if it is a **ViewModelBuilder.reactive()**
*   There’s another version called **ViewModelBuilder.nonreactive(),** which will not be rebuild when you call notifyListeners().

I hope you understand the above code very well since it looks exactly like a changeNotifier code. So what’s so special about this? Why I’m exaggerating this package so much? Let’s see

Photo by [Mike van den Bos](https://unsplash.com/@mike_van_den_bos?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/loading?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

**1.Reduce Loading logic Boiler Plate Code**
============================================

Have you ever written some loading logic like this,

Then you have to do in your view something like this,

1\. isBusy()
------------

But with stacked you can do something like,

As you can see we are not maintaining any boolean variable for maintaining the loading state. It will be handled for you by the package.

**2\. busy(Object)**

Suppose let’s say you want to maintain the loading state for separate variables instead of for the whole ViewModel. You can use `setBusyForObject()`, which will let you set the busy state according to the hashcode of the object passed in.

Inside the viewModel use setBusyForObject() and pass the object you want to set the busy state and a boolean value representing whether it’s busy or not.

Within the view, do something like

```
**viewModel.busy(viewModel.post)**   
             ? LoadingWidget()   
             : MyWidget(viewModel.post)
```

This method is very helpful, instead of making the whole view model busy, it just granularly targets a property.

> It uses hashcode, if you want to use primitive types, make them **final or const**

```
class PostViewModel extends BaseViewModel{  
   final String initKey = 'initialized';  
   void init(){  
      setBusyForObject(initKey,true);  
      //do initialization  
      setBusyForObject(initKey,false);   
  }  
}
```

In the UI, you can use the string key to check for busyness,

```
**viewModel.busy(viewModel.initKey)** ? LoadingWidget() : MyWidget()
```

**3.anyObjectsBusy**

*   There’s also another method to check whether **_any of the objects is busy_**

```
**viewModel.anyObjectsBusy** ? LoadingWidget() : MyWidget()
```

The above method comes in handy when we are initializing a whole bunch of objects and we want all of them to be initialized before proceeding to show something in the UI.

**4.runBusyForFuture(Future)**

If we want to run a long-running task and want to set the busy states automatically according to the completion status of the task we can use runBusyForFuture()

The runBusyFuture will take a Future,

1.  Set Busy state to true for the whole ViewModel or the object you pass in.
2.  Compute the future.
3.  Set Busy state to false.
4.  Return the result.
5.  Also handles error for you (more on this later)

You can also pass an object to set the busy state of that particular object

```
void getAllPost() async{  
   allPosts = await  runBusyFuture(myApiService.getAllPosts(),**busyObject:allPosts**);  
   notifyListeners();  
}
```

You can also pass a string to the `busyObject`,

```
void updateItem(int id) async{  
   **String updateKey = '$id update-key';**  
  \_post = await runBusyFuture(  
          myApiService.fetchPost(id),**busyObject:** updateKey);  
   notifyListeners();  
}
```

Then you can use it in the UI like,

```
viewModel.busy('$id update-key') ? LoadingWidget() : MyWidget(id)
```

Photo by [visuals](https://unsplash.com/@visuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/error?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

2\. Error Handling Made Simple
==============================

Similar to busy handling, we can handle the errors using the `stacked` package easily. It does everything for us and we can access them in the UI and show widgets accordingly.

1.  **setError(error)**

Using this method you can set the error for the whole ViewModel.

```
setError(‘something went wrong’)
```

And access it in the UI using,

```
**viewModel.hasError**   
        ? Text(**viewModel.error(viewModel)**)//'something went wrong'  
        : Text(‘success’)
```

1.  `ViewModel.hasError` tells whether there’s an error in our ViewModel.
2.  `viewModel.error(object)`, here we have passed the viewModel itself, so it will fetch the error in our ViewModel.

2\. setErrorForObject(object,error)
-----------------------------------

Using this method, you can set an error for a particular object or key and access it in your UI.

The try block will raise an error after 3 seconds, it will be caught by the below catch block. Inside it, we are setting the error for the object `_post,` with the exception string as the value of the error.

We can check for the error inside the UI by,

```
SomeWidget(  
child: **viewModel.hasErrorForKey(viewModel.post)**  
            ? Text(**viewModel.error(viewModel.post)**)  
            : Text("success")),  
);
```

This is how we can access the error inside the UI.

As I have already told **runBusyFuture()** handles the error for us,

Syntax:

```
Future<T> runBusyFuture<T>(  
        Future<T> busyFuture,  
       {Object? busyObject,  
        bool throwException = false})
```

> **busyFuture**: it’s the future we want to execute
> 
> **busyObject**: This one is optional. If we pass an object, its hashcode is used as the key for setting the error or busy state.
> 
> **throwException**: runBusyFuture doesn’t throw an error by default, if an error occurs, it will only set the error state. We can override the behaviour and throw an error by setting `throwException=true`

**runErrorFuture()**

Sometimes you don’t want to handle any busyness(busy-ness😂 not business) logic and still want to run a future that may raise an error. On that occasion, you can use **runErrorFuture().** It works like, `runBusyFuture()`but it doesn't handle any busyness logic. Moreover **runBusyFuture() is built using runErrorFuture().**

3\. Handling Future — FutureViewModel
=====================================

Sometimes we may want to initialize data from a future, so we use FutureBuilder, the stacked package also has some cool features to initiate data from a future and **handle the lifecycle of the future**. The FutureViewModel help us to leverage the power of the BaseViewModel with the _feature_ I specified above.

*   You just want to override the method **futureToRun(),** which will initiate the data from the future for you and save it in a property called **data**.

What the method does is,

*   It will run the futureToRun() when you create the FutureViewModel Object.
*   It will call `setBusy(true)`
*   Once the computation is done, then you can access the data using `viewModel.data`
*   If it results in failure, it will set the error state of the ViewModel.
*   Finally, it will call `setBusy(false)`

What we can do with this?

*   We can check if the data is ready by using `viewModel.dataReady`
*   We can fetch the data using `viewModel.data`

```
Center(  
  child: ViewModelBuilder<PostViewModel>.reactive(  
    viewModelBuilder: () => PostViewModel(),  
     builder: (ctx, viewModel, \_) =>   
        **viewModel.hasError**  
        ? Text('Something went wrong')  
        : **viewModel.dataReady**  
            ? MyListItem(viewModel.data)  
            : CircularProgressIndicator(),  
  ),  
)
```

**onData()**
------------

If you want to assign the fetched data to some variable, you can override one of the hooks **onData(data).**

```
class PostViewModel extends FutureViewModel {  
  **List<Post> allPosts;**  
  @override  
  Future futureToRun() async {  
     //your future  
  }@override  
 **void onData(data) {   //called once the data is ready  
    allPosts = data;  
    super.onData(data);  
  }**  
 }
```

Now you can access the same data using _allPosts variable_, you can do any kind of operations inside the onData like filtering the data, caching, etc.

onError()
---------

What if you want to assign some default value when an error has occurred in your futureToRun()? You can override the onError() hook.

```
@override  
void onError(error) {   
  **onData(someDefaultData);**  super.onError(error);  
}
```

In the above code, I’m setting some default values as my ‘data’ when an error occurs. Now we can access that default data using `viewModel.data`

> Don’t call `futureToRun()` again inside the onError() , it may cause an endless loop.

Currently, there’s no retry functionality but I hope they will add it soon.

Hope you’ve learned how the **_stacked_** _package_ reduces much of the boilerplate code and helps us easily handle errors and loading states.

In my [next article](https://medium.com/nerd-for-tech/stacked-package-service-location-routing-logging-b8bdc1e6c839), I will write about the services provided by this package, like service location, Routing, Logging. Thank you for reading😻, Clap👏 if you’ve liked this article.