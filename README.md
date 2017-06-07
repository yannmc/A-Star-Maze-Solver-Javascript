# Project -> A* Maze Solver Javascript

# Description :

This program will take a maze in a .txt file as an input and will open a brwoser window with the shortest path to solve the maze.
  
# How it works :

As mentionned above, the program takes a .txt file as an input which has to be in the following format :

1000000000

0000110002

0003110000

0000011000

 - 0 : a free case on which you can go
 - 1 : a wall, or an obstacle that blocks your way
 - 2 : the starting position
 - 3 : the ending position (your goal)

The file has to be named 'Exercise1.txt, run the program, you will then see a browser window open with multiple tables showing the given maze as well as the different heuristics used to solved the maze and obviously, the shortest path to the exit.

NWWWWWWSS //The path to go from start to finish

16 //The amount of steps taken to find the ending position

When in doubt, the program will choose a case using UP, LEFT, RIGHT and DOWN priority.

A folder within this project contains an example of a maze.

# Goal behind the app :
  
This project was a class assignment during my last semester in computer science. I started doing the whole thing in Javascript, as I usually do, but I then ran into issues. After the algorithms were coded I was unable to output the answer in a specific directory without running a server on the machine itself. 

After some research I understood that Javascript wouldn't be safe if it was possible to write files on your machine, as it is used by most websites today. As a work-around I decided to rewrite the whole thing in Python, which I really enjoyed doing.

The python version of this project can be found here : https://github.com/yannmc/A-Star-Maze-Solver-Python
 
# Developer : 
Yann Morin-Charbonneau @yannmc
