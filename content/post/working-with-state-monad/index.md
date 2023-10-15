+++
title = 'working-with-state-monad'
date = '2023-10-02T13:50:39+05:30'
draft = true 
+++

State Monad — Purescript
========================

[![Saravanan M](https://miro.medium.com/v2/resize:fill:88:88/1*fSLksJqmsL7E-IcsJXHrkw.jpeg)

](https://medium.com/?source=post_page-----f328e9b1ac66--------------------------------)

[Saravanan M](https://medium.com/?source=post_page-----f328e9b1ac66--------------------------------)

·

[Follow](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fsubscribe%2Fuser%2F31a87164ab1a&operation=register&redirect=https%3A%2F%2Fimsaravananm.medium.com%2Fworking-with-state-monad-f328e9b1ac66&user=Saravanan+M&userId=31a87164ab1a&source=post_page-31a87164ab1a----f328e9b1ac66---------------------post_header-----------)

7 min read·Mar 8

\--

1

Listen

Share

We know every data in purescript is immutable. So everytime we want to mutate a value, we have to create a new variable and store the value in the newly created variable and use that new variable, and global variables seems like an impossible thing to attain.

What if I tell you, there’s a Monad which let you store values globally and also make mutation on the global state possible?

Yes, in this article we are going to see about `[State](https://pursuit.purescript.org/packages/purescript-transformers/6.0.0/docs/Control.Monad.State#t:State)` monad, one of the most widely used Monads that lets functional programming solve actual real world problems.

Photo by [Suzanne D. Williams](https://unsplash.com/@scw1217?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/VMKBFR6r_jg?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

For understanding State Monad, let’s create a small _trivial_ game.

This game will be based on 1 vs 1 fighting sort of game, (but don’t except graphics and all😂).

Deciding the State
------------------

For using State Monad, first we have to decide the type of the state we want to work on.

For my game, I have decided that my game state will look like the below,

```
type GameState = { enemyLife :: Int  
                 , myLife    :: Int   
                 , myChance  :: Boolean   
                 } 
```

where `enemyLife, myLife` indicates the life left for enemy and my avatar respectively. `myChance` tells which player chance is to attack.

Operations on State
-------------------

Before writing the loop, let’s look at some operation that you can do with State Monad. Assuming the state we are working on is `GameState` defined above,

**1\. get — _Get the current state_**
-------------------------------------

```
{enemyLife, myLife, myChance} <- get
```

2\. **put —** _Overide the current state fully_
-----------------------------------------------

```
put {enemyLife : 100, myLife : 200, myChance : false}
```

**3\. modify**
--------------

**_Modify the state with a function and return the new state back._**

```
newState <- modify (\\s -> s{myChance = false}) 
```

There’s another version of modify called `[modify_](https://pursuit.purescript.org/packages/purescript-transformers/6.0.0/docs/Control.Monad.State.Class#v:modify_)` which works exactly like `modify` but returns unit, instead of the new state.

4\. **gets**
------------

Same as `get`, but apply some function to the state then return the result of the function.

Helpful in getting a particular field from the state.

```
isMyChance <- gets (\_.myChance)   
  
isGameOver <- gets (\\s -> s.myLife <=0 || s.enemyLife <= 0)
```

Back to our game
----------------

We know that every game has a game loop which keeps on executing until the game ends. Similarly our game also has a game loop which ends when one of the players life is over.

I’m very much accustomed to importing State as qualified import, its helpful in preventing name conflicts.

```
import Control.Monad.State as S
```

The initial version of game will be very boring, like everytime the players attack one another they incur the same damage.

Later we can make it more randomized with random function.

```
game :: S.State GameState Unit  
game = do   
    gameOver <- S.gets (\\s -> s.enemyLife <=0 || s.myLife <=0)  
    when (not gameOver) do  
          {myChance} <- S.get  
          let damage = 1  
          if myChance   
             then S.modify\_ \\s -> s { enemyLife = s.enemyLife - damage }  
             else S.modify\_ \\s -> s { myLife    = s.myLife - damage }  
          S.modify\_ \\s -> s {myChance = not s.myChance}  
          game
```

The above code is very easy to read if you’re following along, let me break it line by line

1.  Type of our function `game :: S.State GameState Unit`

The type of our function states that our state monad operates on the state `GameState` and will return `Unit` (it won’t return anything meaningful)

2\. **_gameOver_** — Will become true when one of the player’s life goes below 0, from which we decide whether to exit the game or not.

```
gameOver <- S.gets (\\s -> s.enemyLife <=0 || s.myLife <=0)
```

3\. We loop only when the `gameOver` variable is false.

```
when (not gameOver) do  
      .....
```

4\. Then we are restructuring the `GameState` and only getting the `myChance` field. It is also possible with `gets` function.

```
isMyChance <- H.gets (\_.myChance) 
```

5\. According to whose chance it is, the other player loses 1 life point.

```
if myChance   
   then S.modify\_ \\s -> s { enemyLife = s.enemyLife - damage }  
   else S.modify\_ \\s -> s { myLife    = s.myLife - damage }
```

6\. Then we are giving the chance to the next player.

```
S.modify\_ \\s -> s {myChance = not s.myChance}
```

7\. Then we loop gain by calling `game` recursively.

How to run our game?
--------------------

But how can we execute our `game` function? Where are we passing the initial State?

There are several function with which we can run a State Monad, all of them work the same but the result they yield differs.

*   **_runState_** — returns both the result `a` and final State `s` as a Tuple
*   **_evalState_** — returns only the result (Unit in our case)
*   **_execState_** — returns the final State

So again, how can we run our `game` function? My function returns `Unit` with which I can’t do anything, so I will get the final state and decide the winner from it (whoever has some life left wins)

```
module Main where  
import Effect(Effect)  
import Effect.Console(log) as Console  
  
main :: Effect Unit  
main = do   
   let initialState = {enemyLife : 100, myLife : 100, myChance : true}  
   let { myLife} = S.execState game initialState  
   Console.log $ if myLife > 0 then "I Won" else "I Lost"
```

This is how I can run my state monad. You can try it out [here](https://try.purescript.org/?code=LYewJgrgNgpgBAWQIYEsB2cDuALGAnGAKEJWAAcQ8AXOABQKgjCJPMpoBEkqkA6AMRBQwSAEaw4ACgBmQsAEpWFanACi06TADGNSes07FpZTQAqeAJ60IBAMpa8KMruwBGADRwqMAB5VPBGjMeEZsKgDCIGhUeEK8CFFIYLy2PN5wSADOcLbEVBZk8ADiSMAwqdzwALxwAN5wMGgwwBYAMiiacABcXXAAktGeLe2dPf3RcEMW4dhIaFrwYwBCIEIwc3BwAL7EhADmpYu9tilpxYcV6QCqaChU%2B4dwNWAgcISbmwdlAPIAbvhwAA8AFocrw9jAqNlJAAdbLAgB8cEyvEazTaHXggKqAAY4AAffHI3jDTFA3GKD5YXAYSRoEA0L4wP74eRwF7vKlc2otGZzBZbIGgk4Q%2B5crmwGgiYBICFPOCuTnizYdOC82bzeBK5UfKg0sGgMAdCwAfTgcLgiORdQaTVJnRqKLR9vgoOlspgOx1XJgUEy8BOhuNZotVuy9RdVMdJIxnTdpQ92214sD4GD5vhSMyPOmGoW8vpNBR6v5nuTXKZ2qrMvQ3V6%2Bm0NBud0INYwz1enMlNpdgpqJ182ku8CZdWdscWcAAzFMRpOZ2rc6Xul48BAy5tu5govLVZGkXi9Y04AAiPpwADqURPDT98DPcFaIEyVBPnMCwTgABI4LJhNqAG04DcKRvD8LAonkABdIA).

But my game is very trivial and boring. The `myChance` variable decides the winner, if I get the first chance I win or I loose. (or the person having more life wins)

How can I add more salt and pepper to it?

If I add some randomization to my game, I feel that it would make it more interesting. But how can I do that?

I can use the `[randomInt](https://pursuit.purescript.org/packages/purescript-random/6.0.0/docs/Effect.Random#v:random)` function from `Effect.Random` to make the damage incured by players different in each iteration.

Adding Effect to State
----------------------

I will be replacing the line

```
let damage = 1 
```

with

```
damage <- randomInt 1 10
```

But compiler will throw an error telling that I can’t use `Effect` inside `State`

Does it sounds like an end to our fantasy? Can’t we make our game better? Why State Monad is so restrictive that it’s not letting us use any monad inside it?

Wait, wait, wait.

There’s a way. We have been using `State` monad but there a more generic version of State monad which is `[StateT](https://pursuit.purescript.org/packages/purescript-transformers/6.0.0/docs/Control.Monad.State.Trans#t:StateT)` with which we can achieve whatever we are trying to do (use Effect inside State)

StateT Monad
------------

*   StateT monad takes three arguments,

```
newtype StateT s m a = StateT (s -> m (Tuple a s)) 
```

`s` and `a` we have already seen in `State` Monad

*   `s` — state the monad operates on.
*   `a` — resulting value of the Monad.
*   `m`\- the inner monad, we will be using `Effect` here.

One interesting thing to note is, the `State` monad that we were using before is defined in terms of `StateT` only

```
type State s a = StateT s Identity a
```

Here, `Identity` is a fake monad, a monad which doesn’t let us do any side Effect.

So we got to replace `Identity` with `Effect` . That’s all we want to do.

Rewriting code with StateT
--------------------------

We want to import **_StateT_** Monad now,

```
import Control.Monad.State.Trans as S
```

and our type of `game` changes to

```
game :: S.StateT GameState Effect Unit
```

Still Error ??
--------------

Having replaced `State` with `StateT` we are now hopeful that our `randomInt` function will compile, but if we again try doing

```
damage <- randomInt 1 10
```

It will throw error telling that we can’t use `Effect` inside `StateT`

The compiler is not lying, we are inside `StateT` , we have to go one layer inside `StateT` to use `Effect`

Consider it as stack, `StateT` is at top, `Effect` is one layer below it. So to use `Effect` function while being inside our `StateT` monad, we have to `lift` our `Effect` to `StateT` .

That’s exactly what `lift` function from `Control.Monad.Trans.Class` does

`lift :: forall s. Effect Int` -> StateT s Effect Int

Once you do,

```
damage <- lift $ randomInt 1 10
```

Now the compiler starts showing error in our main function, where we are `running` are game.

```
let { myLife} = S.execState game {enemyLife : 3, myLife : 3, myChance : true}
```

We have to replace `execState` with `execStateT` , and we will get `GameState` as result wrapped in `Effect` monad.

```
main :: Effect Unit  
main = do   
{ myLife} <- S.execStateT game {enemyLife : 3, myLife : 3, myChance : true}  
...
```

You can try out the modified code [here](https://try.purescript.org/?code=LYewJgrgNgpgBAWQIYEsB2cDuALGAnGAKEJWAAcQ8AXOABQKgjCJPMpoBEkqkA6AMRBQwSAEaw4ACgBmQsAEpWFanACi06TADGNSes07FpZTQDCINFTxDeCC0jC8AKniRoAzr1NQk795KgUaSojNhUXAE9aCAIAZS08FDJdbABGABo4KhgADypMgjRmPFCTOHNLayhbe0dYnmznVw84XzhYpXY1DW0qXgAlNzAQYDhiKgiyeABxJGAYeu54AF44AG84GDQYYAiAGSD4AC4juABJS0zdg804E-PLOCuI02w3LWPTgCEQIRg3OBwAC%2BxEIAHM5p92rxFtknHBZvNYfB9L04ABVNAoKjgyFwVbDMaAwEQ%2BYAeQAbvg4AAeAC00LBMCo7ikAB1WXSAHxwTxbHb7Q605YABjgAB9xbzeNchTTRYpiVhcBhJGgQDRSTBKfh5HBhoQlUb1rtXu8YEDaQzYrwmTjjUqRMAkEyrXBAsE4AASODNYbAC40VJwVIiw0OwFBOCmt5oD5EiNKqgq6GgMBBCIAfTgHLg3N560221lt1WfOLgtuDKdLot4cTgJgUHc8BtaYz2dz%2BdZGxL8GJZZllfg1bmteB9YdbfAHZznJ57l7L1j8dW6ponhj5pBDa1k-3zvQd1OqJ0GKxOMPGAJIATS5uFrdNty2mR8K1635fbuIZFIueD4-qG-7Rsu5o-tISDNnWgKwDQmAWPicBRt%2BPJismWxwAARGccAAOoWFhmzQdhuF7CA7hUFh4aFMU3pwLIwiTgA2nAaRSNkeRYBY8gALpAA).

We can do a lot more. We can print the game stats at every iteration of game loop, we can even get input from user and decide what to do further etc. I’m leaving that as an exercise to you and your creative thinking skills.

Now you have earned the **_super power_** to mutate variables at will with `State` Monad. That’s why you have to use it carefully, _with great powers comes responsibility_. Try using pure function as much as you can, and limit your state Monad usage to a [small shell](https://www.educative.io/answers/what-are-functional-core-and-imperative-shell-in-elixir).

`[ReaderT](https://pursuit.purescript.org/packages/purescript-transformers/6.0.0/docs/Control.Monad.Reader.Trans#t:ReaderT)` monad is a better alternative if all you want is to read global State without doing any modification to it.

