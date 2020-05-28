n = int(input())

conversion = {"a":0, "b":1, "c":2, "d":3, "e":4, "f":5, "g":6, "h":7}
conversion_back = ["a", "b", "c", "d", "e", "f", "g", "h"]

for _ in range(n):
    location = input() 
    init_x = conversion[location[0]]
    init_y = int(location[1])-1
    print(init_x, init_y)

    # Go through all tiles and calculate path to it.
    max_steps = 0
    results = []
    for x in range(8):
        for y in range(8):
            curr_x = init_x
            curr_y = init_y
            steps = 0
            while(curr_x != x or curr_y != y):
                print(curr_x, curr_y)
                # X difference greatest
                if(abs(x - curr_x) > abs(y - curr_y)):
                    # X needs to progress by 2.
                    if(x - curr_x > 0 and curr_x + 2 <= 7):
                        curr_x += 2
                    elif(curr_x - 2 >= 0):
                        curr_x -= 2
                    # Y needs to progress by 1
                    if(y - curr_y >= 0 and curr_y + 1 <= 7 ):
                        curr_y += 1
                    elif(curr_y - 1 >= 0):
                        curr_y -= 1
                # Y difference greatest
                else:
                    # Y needs to progress by 2
                    if(y - curr_y > 0 and curr_y + 2 <= 7):
                        curr_y += 2
                    elif(curr_y - 2 >= 0):
                        curr_y -= 2
                    # X needs to progress by 1
                    if(x - curr_x >= 0 and curr_x + 1 <= 7):
                        curr_x += 1
                    elif(curr_x - 1 >= 0):
                        curr_x -= 1
                steps += 1
            if(steps > max_steps):
                results = []
            if(steps >= max_steps):
                res = conversion_back[x] + str(y+1)
                results.push_back(res)
    # print shit
    print(max_steps, end=' ')
    for res in results:
        print(res, end=' ')
    print()
