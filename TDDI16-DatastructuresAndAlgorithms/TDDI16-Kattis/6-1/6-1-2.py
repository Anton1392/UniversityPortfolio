from queue import *
import operator

class Node:
    x = 0
    y = 0
    neighbors = []
    visited = False
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.visited = False
        self.neighbors = []

        # Calculate neighbors to itself, sorry
        if(self.x + 2 >= 0 and self.x + 2 <=7 and self.y+1 >= 0 and self.y+1 <= 7):
            self.neighbors.append((self.x+2, self.y+1))

        if(self.x + 2 >= 0 and self.x + 2 <=7 and self.y-1 >= 0 and self.y-1 <= 7):
            self.neighbors.append((self.x+2, self.y-1))

        if(self.x - 2 >= 0 and self.x - 2 <=7 and self.y+1 >= 0 and self.y+1 <= 7):
            self.neighbors.append((self.x-2, self.y+1))

        if(self.x - 2 >= 0 and self.x - 2 <=7 and self.y-1 >= 0 and self.y-1 <= 7):
            self.neighbors.append((self.x-2, self.y-1))

        if(self.x + 1 >= 0 and self.x + 1 <=7 and self.y+2 >= 0 and self.y+2 <= 7):
            self.neighbors.append((self.x+1, self.y+2))

        if(self.x + 1 >= 0 and self.x + 1 <=7 and self.y-2 >= 0 and self.y-2 <= 7):
            self.neighbors.append((self.x+1, self.y-2))

        if(self.x - 1 >= 0 and self.x - 1 <=7 and self.y+2 >= 0 and self.y+2 <= 7):
            self.neighbors.append((self.x-1, self.y+2))

        if(self.x - 1 >= 0 and self.x - 1 <=7 and self.y-2 >= 0 and self.y-2 <= 7):
            self.neighbors.append((self.x-1, self.y-2))

n = int(input())
conversion = {"a":0, "b":1, "c":2, "d":3, "e":4, "f":5, "g":6, "h":7}
conversion_back = ["a", "b", "c", "d", "e", "f", "g", "h"]

for _ in range(n):
    location = input() 
    init_x = conversion[location[0]]
    init_y = int(location[1])-1

    board = list()
    # Construct graph
    for x in range(8):
        board.append(list())
        for y in range(8):
            nod = Node(x, y)
            board[x].append(nod)

    max_depth = 0
    res = []

    # Init queue
    q = Queue() 
    board[init_x][init_y].visited = True
    for nbr in board[init_x][init_y].neighbors:
        q.put((nbr, 1))

    while(not q.empty()):
        obj = q.get()
        if(not board[obj[0][0]][obj[0][1]].visited):
            for nbr in board[obj[0][0]][obj[0][1]].neighbors:
                q.put((nbr, obj[1]+1))

            if(obj[1] > max_depth):
                res = []
                max_depth = obj[1]
            if(obj[1] >= max_depth):
                res.append(obj[0])
            board[obj[0][0]][obj[0][1]].visited = True

    # Sort
    res.sort(key=lambda x:(-x[1], x[0]))

    print(max_depth, end=' ')
    for r in res:
        print(conversion_back[r[0]] + str(r[1]+1), end=' ')
