Flutter rendering Gibberish Characters from REST-API?
=====================================================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----5d5093ff7ad4--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----5d5093ff7ad4--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----5d5093ff7ad4--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fflutter-rendering-gibberish-characters-from-rest-api-5d5093ff7ad4&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----5d5093ff7ad4---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----5d5093ff7ad4--------------------------------)·3 min read·Jul 23, 2021

\--

Listen

Share

In my first internship, I was given a task to debug why some of the responses from the REST-API are rendered as gibberish characters. I was confused at first but when I finally found out that dart uses UTF-16 encoded strings, all my doubts are cleared. How did I solve the issue? Let me share with you.

Photo by [Ben White](https://unsplash.com/@benwhitephotography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/confused?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

Most of the time, REST-API's respond with UTF-8 encoded strings. Since strings in dart are UTF-16 encoded, it converts some of the characters to completely different characters.

Example:

*   UTF-8 representation of å : `**0xC3 0xA5**`
*   UTF-16 representation of å : `**0x00E5**`

As you can see, how differently they are decoded. This may drive new developers(like me) crazy. In [Postman](https://www.postman.com/) everything may look fine but when you render the text, it is completely different.

It’s like, what you ask🚗 your parents for Christmas Vs what they buy🎠 for you.

But don’t worry, dart got your back. Using `dart:convert` package, you can decode the strings using `**UTF-8**` instead of the default `UTF-16`.

1.  Import `utf8` from `dart:convert`

```
import “dart:convert” show **utf8**;
```

2\. Decode using utf8.decode()

Steps:

1.  Convert the strings to runes.
2.  Use the utf8.decode(\[string\])

It is as simple as that. If you are not satisfied and want to know what the hell is a `rune`? I’ve got you covered. Please Continue🎈 reading.

What are Runes in dart?
-----------------------

> A **rune** is an integer representing a Unicode code point.

*   `[string].runes` returns the **Unicode code points** in the string.

```
print(utf8Encoded.runes); // **for the above code : (195, 165)**
```

> Dart represents strings as a sequence of **Unicode UTF-16 code units**. Unicode is a format that defines a **unique numeric value** for each letter, digit, and symbol.

```
String alpha=_"_abcd_"_;   
print(alpha.runes); //**(97, 98, 99, 100)**
```

As you can see, `UTF-16` code units are just like ASCII values but **ASCII represents lowercase letters (a-z)**, uppercase letters (A-Z), digits (0–9), and symbols such as punctuation marks while **Unicode represents letters of English, Arabic, Greek, etc**.

> **Bonus-knowledge**: **Mojibake** is the garbled text that is the result of text being decoded using an unintended character encoding.

I just wanted to share something I’ve learned in my internship, hope you’ve also learned something new. Thanks for reading. Clap👏 if you've liked this article.