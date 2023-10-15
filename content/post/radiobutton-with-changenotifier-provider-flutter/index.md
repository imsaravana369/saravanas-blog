+++
title = 'radiobutton-with-changenotifier-provider-flutter'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

RadioButton With ChangeNotifier Provider — Flutter
==================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----5a163f8e6bca--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----5a163f8e6bca--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----5a163f8e6bca--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fradiobutton-with-changenotifier-provider-flutter-5a163f8e6bca&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----5a163f8e6bca---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----5a163f8e6bca--------------------------------)·6 min read·Jul 5, 2021

\--

Listen

Share

In this article, I will tell you how we can use radio buttons with ChangeNotifier without mixing the UI and business logic.

It’s very crucial to move our business logic out of our UI so that we can easily maintain and unit test our code, but it's pretty hard in flutter because both the UI and business logic are written in one programing language — Dart. So we are going to write all our business logic in the ChangeNotifier provider leaving our UI very lean and clean. (Not gonna use **setState()**)

We are going to create an app that looks like this,

What our App will do
--------------------

1.  Users can tap any of the radio buttons on the Home screen and the corresponding style will be fetched from our fake-API.
2.  Our fake-API will respond with JSON containing the text style format and some other meta-data.
3.  We will use the text style from the JSON and render the ‘Hello World’ text on the home screen with it.

The architecture diagram is,

**Presentation Layer** — This is our UI layer, we will be writing all our UI code here.

**Business Layer** — All our logic goes into this layer. ChangeNotifier goes here and will make use of the service class to fetch the data.

**Data Layer** — The service class is used to fetch the data from our Fake REST-API and convert it into a Data Transfer Object(DTO)

Code Structure

To keep it very simple I have only 3 layers, I could’ve separated all the service classes into a service package, since our app is so small and has only one service class I preferred this structure.

This is **_not a very sophisticated structure_**, I will write an article about how we can structure our code more granularly.

Let’s start from the Data layer,

Data Layer
==========

First, let’s create our model(DTO) class,

**Model Class**

I haven’t done many validation checks here, but if you want you can

This is a Data Transfer Object. What is a DTO?

> A Data Transfer Object is an object that is used to encapsulate data, and send it from one subsystem of an application to another and has no other logic written in it except serialization logic and deserialization(**fromJson()** here) logic.([see here](https://en.wikipedia.org/wiki/Data_transfer_object))

This class contains some **text-style fields** like color,fontWeight,fontSize, and some other **meta-data** like home many people liked the text style.

**Service class**

In the service layer, we usually make HTTP requests to fetch data(any CRUD operation) from a server or access data in the local database and parse the response from raw data(JSON, XML, etc) to a Data Transfer Object.

To make this article very short, I have made 5 fake JSON responses and stored them in a list.

But this is how we can request data from our REST-API,

```
Future<TextStyleResponse> fetchTextStyle(int index) async{  
    Uri uri = Uri._parse_("www.myapi.com/styles/$index");  
    var response = await http.get(uri);  
    Map<String,dynamic> responseMap = json.decode(response.body);  
    return TextStyleResponse.fromJson(responseMap);  
}
```

Since we are done with our data layer, let’s move on to our business logic layer

Business Layer
==============

We can use any state management libraries like Bloc,mobX, etc. But since our app is very small I’m going with Provider.

To use the change notifier provider, install the provider package

```
dependencies:  
  provider: ^5.0.0
```

*   **int selectedButton —** This will hold the value of which radio button is selected.
*   **TextStyle \_style —** This will decide which text style will be applied to the ‘Hello World’ text on our home screen.
*   **TextStyleService service** — An instance of our TextStyleService class.
*   **int likes —** Number of people who liked the current text-style that we have fetched from our fake-API.
*   **int totalResponses —** Total number of text styles available in our fake-API.

what we do in setSelectedButton(index) function?
------------------------------------------------

1.  Check if the passed index is not null then update the value, otherwise set it to the previously selected button without changing it.

```
 selectedButton = index?? selectedButton;
```

**2\. Fetch the response and update the fields.**

```
var response = await service.fetchTextStyle(selectedButton);  
\_style = TextStyle(  
        fontSize: response.fontSize,  
        fontWeight: response.fontWeight,  
        color: response.color,  
       );  
likes = response.likes;
```

we could’ve passed the JSON map response directly without parsing it into a TextStyleResponse object but it’s not a good practice. Since it will make our Data and Business logic layer coupled.

**3.Notify the listeners (Important step)**

```
notifyListeners();
```

This is the most important. This will signal all the widgets that are listening to the provider to rebuild. If you don’t call this, none of them will rebuild, even though the values are changed.

Presentation Layer
------------------

First, let’s create the radio button list, We can quite easily do that using ListViewBuilder with RadioListTile as items.

RadioListTile
-------------

*   RadioListTile are nothing but a radio button with a label.
*   The **title** field indicates the label of the radio button.
*   The **_value_** field inside a RadioListTile indicates the value(like ID) of it.
*   The **_groupValue_** field indicates the value of the selected radio button in the radio group. If **groupValue == value**, then the current radio button is checked otherwise not.
*   The onChanged callback will be called when the tile is tapped.

**ChangeNotifierProvider**

The below line will fetch the TextStyleProvider by **looking up** the widget hierarchy. (we haven’t provided the TextStyleProvider yet)

```
var provider = Provider.of<TextStyleProvider>(context);
```

By passing the **context**, we are registering the widget as a listener to the provider, it will **rebuild whenever notifyListeners() is called** from that provider.

If you don’t want the behavior, you can choose not to listen to the changes by passing — **_listen:false_**

```
var provider = Provider.of<TextStyleProvider>(context,listen:false);
```

HeaderText
----------

This Widget is used for displaying the Hello World text.

I think this widget is quite self-explanatory. We are getting the title of our widget(the center text) and the number of likes as parameters from our constructor.

We are done, Almost…
--------------------

Now let’s wire our TextStyleProvider from our main.dart

How will you provide the TextStyleProvider instance?

*   We know the children get the instance of the needed provider from their ancestors(by looking up the widget tree).
*   Since only the children of MyHomePage() are using TextStyleProvider, we can wrap only the MyHomePage widget with ChangeNotifierProvider.
*   If you want to provide your provider **globally** just wrap **MaterialApp** with ChangeNotifierProvider()

> If you want to provide more than one provider, use `MultiProvider()`

MyHomePage()
------------

_Line 24_: The reason why I’ve wrapped **TextRadioList** with **Expaned()** is we can’t directly nest ListView inside the Column widget. Why?

> A `ListView` takes all the vertical space available to it, unless it’s constrained by its parent widget. However, a `Column` doesn’t impose any constraint on its children’s height by default. The combination of the two behaviors leads to the failure of determining the size of the `ListView`.

Solution:
---------

1.  **Wrap the TextRadioList with Expanded.**

Expanded will force the nested widget to acquire all the remaining space of its parent(after laying out the widgets with a fixed size. More about this [_here_](https://api.flutter.dev/flutter/widgets/Column-class.html))

**2\. Make ShrinkWrap to true in ListView (not recommended)**

This will make the listview acquire only the space it needs.

> Shrink wrapping the content of the scroll view is significantly **more expensive** than expanding to the maximum allowed size because the content can expand and contract during scrolling, which means the size of the scroll view needs to be recomputed whenever the scroll position changes. ([Docs](https://api.flutter.dev/flutter/widgets/ScrollView/shrinkWrap.html))

what you have learned from this article is,

1.  How to use RadioListTile?
2.  How to use the ChangeNotifier provider?
3.  Why Listview can’t be a direct child of the Column widget?
4.  How to parse JSON Responses to a DTO object?
5.  Where to provide a ChangeNotifier Provider?

