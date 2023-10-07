Shimmer Effect: Stop using boring ProgressIndicators
====================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----4e44fc132936--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----4e44fc132936--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----4e44fc132936--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fshimmer-effect-stop-using-boring-progressindicators-4e44fc132936&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----4e44fc132936---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----4e44fc132936--------------------------------)·4 min read·Jul 28, 2021

\--

Listen

Share

What do you do if you want to let the user know something is loading? If your answer is `**CircularProgressIndicator**`  it’s time to change. Instead of using the boring loading spinner, use can use the `shimmer` package which gives a shimmer effect and make the user experience much better. Since we can give an overview to the user of how the screen will look after the screen is loaded. Even though we need to write some extra code to get it done it really worth the effort.

Add the shimmer package to your pubspec.yaml

```
dependencies:  
 **shimmer: ^2.0.0**
```

How to use Shimmer Widget?

**1.Create a skeleton of your target widget.**

> Skeleton widget : A widget that resembles our real widget, but has not content.

**2\. Wrap the skeleton widget with Shimmer.fromColors()**

1.Creating the skeleton
-----------------------

We first need to create a skeleton container that mimics our widget.

Let’s say this is the widget we want to mimic,

A ListItem in a ListView

The ListItem code

To create a skeleton of the above list item, we need to create the exact widget but with no content inside it.

Skeleton of our ListItem

As you can see, the structure is as same as the original list item but it has no content inside it, just empty containers with fixed sizes and colors.

> Why Color is important? _Shimmer effect_ **_only affects the opaque areas_** _of \[child\], transparent areas still stays transparent when applying shimmering effect._

In order to make our container opaque, I have given a color. I will tell you why I’ve chosen `Colors.white24` later.

2\. Wrap the skeleton widget with Shimmer.fromColors()
------------------------------------------------------

Having created the skeleton Widget, it’s time to wrap it with the _magic_ Shimmer widget. But we need to follow some guidelines that will prevent the shimmer effect from being rendered without any bizarre side effects. Believe me, this one is important.

> _1\. The Skeleton widget should be made of basic and simple widgets, such as Container, Row, Column to avoid side effect.  
> 2\. Use one \[Shimmer\] to wrap list of \[Widget\]s instead of a list of many \[Shimmer\]s_

If you follow these rules shimmer package will behave as we wanted it to be.

Let’s create our Shimmer Widget,

Let’s break this down,

**1.shimmerBuilder(Widget child)**

This is a self-made function that will return a `Shimmer` widget.

The baseColor and highlightColor are used to create a LinearGradient. The way it’s implemented under the hood is,

```
gradient = **LinearGradient(**  
   begin: Alignment._topLeft_,  
   end: Alignment._centerRight_,  
   colors:   
   **\[baseColor,baseColor,highlightColor,baseColor,baseColor\]**,  
   stops: const <double>\[0.0,0.35,0.5,0.65,1.0\])
```

This is how a LinearGradient with the above configuration looks like,

If baseColor=Colors.grey & highlightColor=Colors.green

This LinearGradient will be blended over the skeleton widget to give the shimmer effect.

**2\. Skeleton Widget Color**

The reason why I use `Colors.white24` for the skeleton widget is that it is blending with my baseColor(grey) & highlightColor(purple) well.

If you use some other colors(like black,green etc) it will combine with the linear gradient and produce a different color. (We don't want that)

Even pure white looks weird for my color combination(grey & purple). So Experiment with the different colors for your skeleton widget and find the best match.

> You can wrap the whole widget with the shimmer widget, instead of each Individual widget(like I’ve done) But when you try to wrap it with complex widgets like Card. It can’t render the shimmer effect correctly.
> 
> (See the two guidelines I’ve mentioned above)

Finally, you can create a LoadingList using the individual ShimmerListItems

By putting everything together we can do,

The final output looks like,

I have rounded the corner of the title and subtitle(Sorry if the gif is too long)

You can even customize the shimmer effect by providing,

*   **direction**: c_ontrols the direction of shimmer effect. The default value is \[ShimmerDirection.ltr\]_

```
_/// \* \[_**_ShimmerDirection.ltr_**_\] left to right direction  
/// \* \[_**_ShimmerDirection.rtl_**_\] right to left direction  
/// \* \[_**_ShimmerDirection.ttb_**_\] top to bottom direction  
/// \* \[_**_ShimmerDirection.btt_**_\] bottom to top direction_
```

*   **period**: C_ontrols the speed of the shimmer effect. The default value is 1500ms._
*   To use a radial gradient or some other gradient for your shimmer effect. You can use the default constructor `Shimmer()`

```
return Shimmer(  
    child: child,  
     **gradient**: **RadialGradient**(  
         ...  
     ),  
);
```

Hope you will use this awesome loading effect in your next project🥳 but be sure to follow the aforementioned guidelines. Thanks for reading. Clap👏 if you’ve liked the article.