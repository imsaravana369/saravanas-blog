Matrix Hackerrank
=================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/?source=post_page-----3ff42d5f250c--------------------------------)

[Saravanan M](https://medium.com/?source=post_page-----3ff42d5f250c--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fimsaravananm.medium.com%2Fmatrix-hackerrank-3ff42d5f250c&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----3ff42d5f250c---------------------post_header-----------)

6 min read·Jun 20, 2021

\--

Listen

Share

In this article, I’m going to explain to you, step by step, how you can solve the Hackerrank problem “Matrix” which is one of the significantly hardest problems I’ve come across. This problem is quite hard to explain so bear with me, you will finally understand it. I’m very sure the final example will help you understand it better.

Image source: [www.usatoday.com](http://www.usatoday.com)

To those who don’t know about [this problem](https://www.hackerrank.com/challenges/matrix/problem?h_r=internal-search), let me share with you the problem statement

Problem Statement
-----------------

_The kingdom of Zion has cities connected by bidirectional roads. There is a_ **_unique path between any pair of cities_**_. Morpheus has found out that the machines are planning to destroy the whole kingdom. If two machines can join forces, they will attack. Neo has to destroy roads connecting cities with machines to stop them from joining forces. There must not be any path connecting two machines._

_Each of the roads takes an amount of time to destroy, and only one can be worked on at a time. Given a list of edges and times, determine the minimum time to stop the attack._

For example, there are n=5 cities called 0–4. Three of them have machines and are colored red. The time to destroy is shown next to each road. If we cut the two green roads, there are no paths between any two machines. The time required is **3+5**.

Here is an example,

Fig 1: The Final output should be 5

Now let’s see how we can interpret the problem.

1.  The path must be a **Tree**. But how? From the question, you can find out that there is a unique path between any pair of cities. In trees, You can reach a node only from one node(its parent node).
2.  We need to split the one big tree with ’n’ machine nodes into ’n’ separate subtrees(Why? So that no machine node is reachable from one another). To do that we have to remove n-1 edges.

Traverse the tree using DFS
===========================

We need to traverse the tree using DFS, we need to do the below operations to each subtree starting from the bottom to top in a DFS style.

Before explaining the actual algorithm, I would introduce some **Terminologies**(self-created) to help me explain this problem better.

Nearest Machine Nodes from a Node
=================================

Consider a node, there can be ‘x’ paths to all of its descendant machine nodes. The **nearest machine nodes** are the nodes that are nearer to the current node in their respective paths. I will call them, the **nearest machine nodes** to explain this better. (don’t consider the weights of the edges)

Fig 2: Here the nearest machine nodes of A are **B and F**. E is also a machine descendant of A but not a nearer one since it’s preceded by B in the path from A to E.

Preparing the questions
-----------------------

We are going to ask two questions while visiting each node(parent of the subtree).

1.  If the current node is a normal node(not a machine-occupied city), let’s say it has ‘K’ **nearest machine nodes.** we are going to remove K-1 edges(one edge from each path of the current node to all of the nearest machine nodes, but why K-1? I will tell it later)
2.  If it is a machine node, we should remove all the K edges. It will completely disconnect the current machine node from all the other nearest machine nodes.

Condition 1: If the current node is a normal node
-------------------------------------------------

**What should we do?** Remove K-1 edges from each of the paths to all the nearest machine nodes.

**How do we decide which edge to remove from the path?** (from the current node to the nearest machine node) Simply remove the edge with the shortest weight in the path(I will call this **“minimal cost”** )? Make sense? By doing this we are removing the connection between the current non-machine node with its descendant machine node at a minimal cost.

Fig 3: Consider **A** as the current node. The paths to the nearest machine nodes from A are **A->B, A->C->F, A->D**. Here the minimal costs are **10,2,7** respectively.

Now having decided which edge to remove from the k-1 paths. Now, the next question is **“Which k-1 paths to consider?”**

The Answer is to consider all the paths except the one with the highest “_minimal cost_”. In the above example, we will remove the edges with costs 2,7 neglecting the path A ->B, which has the highest minimal cost.

We can **Bubble up** the highest minimal cost. Why? This is an optimization step, you can gracefully skip this and still solve the problem. But to the optimistic folks, I will explain how to do the “Bubbling Up” in the below section.

Condition 2: If the current node is a Machine node
--------------------------------------------------

This step is the same as that of condition 1 but you need to do the pruning for all the k paths instead of k-1 paths.

Bubbling up the highest minimal cost of Condition 1
===================================================

Why do we need this step? As I already told it’s just an optimization step.

Let’s Consider the above tree(figure:3), what if the node I marked with “**?**” is a machine node. After visiting A, ‘B’ is still reachable from A. So ‘B’ is also reachable from ‘?’. Which is Bad!!

According to DFS, the next node we backtrack from A is M(the ‘?’ node), let’s say we don’t use “Bubbling up” we need to calculate the minimal cost from M->B, which is the only nearest machine node of M.

But Wait we already knew what’s the minimal cost of A->B, we can reuse that. If we bubble up the minimal cost of A->B (that is 10). Now the minimal cost of M->B is the minimum of M->A and A->B (which we got from the bubbling up step).

As you can see, we will bubble up B’s value as it is the highest minimal cost of A. Now we will compare M->A paths minimal cost, that is 14, and A->B minimal cost that is 10. Since 10 is the minimum we will chop that edge. Finally, we have chopped the edges with weights 10,2,7. Now all our machine nodes are disconnected from each other.

Let’s use this algorithm to solve one of the example problems

Step 1:
-------

Consider the figure _fig:1_, let’s start the DFS from one of the Machine Nodes. Let’s take node **4**

Initial Tree

Step 2:
-------

By DFS, we will end up in the last subtree with the parent as 1, there are 2 nearest machine nodes 2,3 with minimal costs 3 and 7 respectively. Let’s remove the minimal edge that is 1->3. Time taken will be 3

Step 3
------

Let’s move one level above(DFS backtracking), now our current node is 0 since it’s a non-machine node we need to remove k-1 edges, now if you consider from node 0, there is only one nearest machine node ( k=1), that is node 3, so we need not remove any edges.

Step 4
------

Now our current node is 4, Since node 4 is a machine node, we need to remove all the nearest machine nodes, here k=1 since the only nearest machine node is node 3 and the minimal path cost from 4->3 is 2. So let’s remove the edge 4->0. Time taken will become 5.

Finally, we freed Zion
----------------------

We have demolished the roads 4->0 and 1->2 within the **time 5** and saved Zion from the machines(yes!). The Zion Kingdom finally looks like

Final Tree where all the machine nodes are disconnected from one another

Thank you for going through this article. Hope I’ve helped you understand the logic behind this solution. I will soon upload the python code and dissect each line of the code to help you understand the logic better.