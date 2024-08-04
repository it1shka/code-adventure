## Welcome!

Welcome to the exciting world of 
__"Peter the Robot's Clean-Up Adventure"!__
In this fun and engaging game, you'll meet 
Peter, a friendly robot with a 
big task ahead of him. Peter's hangar is filled 
with a __jumble of boxes and junk__, and he needs 
your help to tidy it up!
<br><br>
Peter wants to scatter the boxes around the hangar 
to collect all the rubbish. To lend Peter a hand, 
you'll write __a simple program__ to guide him. 
Don't worry, though—it's easy! The programming 
language Peter uses has just __three simple commands__.
<br><br>
Are you ready to help Peter turn his messy hangar 
into a sparkling clean space? Let's get started 
and have a blast coding together!
<br><br>

## Instructions:

There are currently __3 minimal instructions__
implemented in the language:
<br><br>

1. **_Move_**: robot makes _n_ steps forward
```instructions
move ${n} steps
```

2. **_Turn_**: robot turns either __right__ or __left__
```instructions
turn ${right | left}
```

3. **_Repeat_**: robot repeats _n_ times some
particular block of instructions
```instructions
repeat ${n} times
  ${block}
end
```
<br>

Additionally, you can leave comments
in your code. Comments start with symbol __'#'__:
```instructions
# This is a comment
# This is another comment
```
<br>

Sample program to follow a square path:
```instructions
repeat 4 times
  move 5 steps
  turn right
end
```
<br>

## That's it!
This [project](https://github.com/it1shka/code-adventure) 
was created by Tikhon Belousov
[@it1shka](https://github.com/it1shka)