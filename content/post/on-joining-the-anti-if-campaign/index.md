+++
title = 'on-joining-the-anti-if-campaign'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

On Joining the Anti-If campaign
===============================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/@imsaravananm?source=post_page-----26c5940b9c9a--------------------------------)[![Nerd For Tech](https://miro.medium.com/v2/resize:fill:48:48/1*53-lvCPnPV4sTOmvcITDxw.png)

](https://medium.com/nerd-for-tech?source=post_page-----26c5940b9c9a--------------------------------)

[Saravanan M](https://medium.com/@imsaravananm?source=post_page-----26c5940b9c9a--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fmedium.com%2Fnerd-for-tech%2Fon-joining-the-anti-if-campaign-26c5940b9c9a&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----26c5940b9c9a---------------------post_header-----------)

Published in[

Nerd For Tech

](https://medium.com/nerd-for-tech?source=post_page-----26c5940b9c9a--------------------------------)·5 min read·Sep 30

\--

Listen

Share

I always have had a nagging feeling while writing if-else condition, it wasn’t until I came across the term ‘[anti-if campaign](https://francescocirillo.com/products/the-anti-if-campaign)’ that I understood why.

Now, as a member of the anti-if campaign, allow me to persuade you why it’s worth joining as well. (disclaimer at the end😂)

> **Note:** When I mean \`if-else\` that also includes other branching statements like switch, else-if etc.

yeah, time to throw them away.

1\. The more the if-else, the more imperative your code gets
------------------------------------------------------------

Instead of simply stating the desired outcome, [imperative code](https://en.wikipedia.org/wiki/Imperative_programming) micromanages everything by providing explicit, step-by-step instructions.

Think of if-else statements for a moment, its a form of spoon-feeding; it’s actually dictating to the computer, “Execute this block if this condition is met, otherwise check this condition and execute this other block, if that also fails checks this condition and so on..”

Excessive nesting of conditions not only hampers code maintainability but also serves as an indicator that you are trying to spoon-feed the logic.

Consider this example,

```
def sign\_mult(a,b):  
    if (a == '+' and b == '+'):  
        return '+'  
    elif (a == '-' and b == '-'):  
        return '+'  
    elif (a == '+' and b == '-'):  
        return '-'  
    elif (a == '-' and b == '+'):  
        return '-'
```

This could be easily rewritten as,

```
def sign\_mult(a,b):   
   return ‘+’ if a == b else ‘-’
```

Still we are using if-else([without if-else version](https://onlinegdb.com/j6YeMyQXP)) but this version is more concise, it looks more like an equation that resolves itself whereas the first nested version prompts us to mentally execute the checks step-by-step, making us into a miniature computer.

> **Takeaway**: When you’re overdoing nesting, you’re needlessly **complicating the actual logic**. Recall the LeetCode question where you wrote ten if-else checks, whereas the YouTuber’s solution had only one check?

2\. If-else indicates a potential design flaw
---------------------------------------------

Conditional statements like if-else, switch statements etc are referred to as branching statements because its where things starts branching out.

It’s okay when the branching is contained within the same tree(domain), it becomes problematic when it starts spreading to other trees too.

For this very reason, it’s quite easy to misuse them. For example, while coding a e-commerce website, I could have a single switch statement that manages everything from searching for an item to delivering it to the customer.

That’s precisely why, when employed without careful thought, you might inadvertently intertwine different domains and that’s a design problem right there, your code will work but will not scale.

Consider this Java example,

Here one paymentMethod can be completely different from the other. But with this switch statement, we are coupling them into one.

The above code is actually trying to centralize the logic of calculating discount for various payment instruments in a single place.

But whats wrong in it? Just looking like a normal if-else isn’t it?

If you look closely it’s actually violating [Open–closed principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle)(assume the above method is inside a class) Let’s say a new paymentMethod comes, you have to “modify” the above function to accommodate the new case.

But if we refactor the code like

then you can simply do,

```
public static double getDiscount(DiscountProvider discountProvider, int amt){  
        double discount  = discountProvider.getDiscount();  
        return amt \* (discount / 100);  
    }
```

Now you can see, there’s no ambiguity here. When a new case comes in you don’t have to change the above function but rather “extend” it by creating a new class that just implements the `DiscountProvider` interface.

> **Takeaway**: Whenever you encounter an if-else or case statement, it’s worth considering the possibility of abstracting them into an interface or encode the branching information within the type itself.

3\. You will end up coupling the order
--------------------------------------

When dealing with if-else blocks, it’s common knowledge that the program enters an ‘else’ block only when the preceding ‘if’ condition fails. While this assumption seems reasonable, relying on it to shape our predicates can lead to unintended consequences. Consider this below example:

```
def get\_welcome\_message(age):  
    if age < 18:  
        print("Too young")  
    elif age < 65:  
        print("Come in")  
    else:  
        print("Too old")
```

This code functions as expected, but what if someone modifies the initial ‘if’ condition to `age == 18`? Subsequent checks, such as `age < 65`, which was implicitly assuming `age >= 18 and age < 65` will start giving incorrect outputs.

One approach to tackle this problem is to explicitly define the entire condition as `age >= 18 and age < 65`, rather than just `age < 65`.

(Question: Wouldn’t this break down the nested if-else structure into a series of individual if-then statements? which isn’t good either..)

However, PR reviewers often prioritize adhering to the DRY principle over writing correct code, so it can be quite challenging to get your PR merged.

> **“Small anecdote**: I once had to add a new case to a CardNumber validator function, that already had around 20+ if else checks. Confused by where exactly to insert my case, I ended up breaking the other validation checks😭”

Indeed, there are scenarios where the sequence of if-else statements plays a critical role. For instance, you might want to validate the username before checking the password, even when both are invalid, you just want to throw an ‘Invalid username’ error message.

However, in the story I shared above, all the if-else checks were supposed to be standalone but as the number of if-else statements grew, they inadvertently began to overlap with one another. This unintended overlap introduced a pseudo-sequence within the validation function. For instance, it began to prioritize the verification of card blacklisting by the card network over blacklisting by the cardholder’s bank, even though there was no explicit business need for such prioritization.

> **Takeaway**: The ordering guarantees given by branching statements are quite useful but they can inadvertently introduce a pseudo-ordering that lacks genuine business significance.

Now we have come to the most important part of the article.

Disclaimer⚠️
============

While I have joined the anti-if campaign, it doesn’t imply that I will never include branching statements in my code. I believe it’s virtually impossible to write code without branching statements. To draw a comparison, it’s somewhat akin to an anti-drug campaign that doesn’t seek to discourage the use of drugs for legitimate medical purposes. The primary aim of the anti-if campaign is to eliminate its usage where it is inappropriate, recognizing that, like drugs, branching statements can also have their valid place in your codebase.

