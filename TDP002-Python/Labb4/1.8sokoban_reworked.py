import os

player = ('y', 'x')
game_board = {}
available_levels = []

# Dictionary with tiles bound to names. Refer to this dict each time a tile is referenced = more readability.
# eg. if game_board[(2, 5)] == 'wall': can_move = False
tiles = {
    "worker": "@",
    "box": "o",
    "wall": "#",
    "storage": ".",
    "floor": " ",
    "storage_box": "*",
    "storage_worker": "+",
}


# The first function to be called.
def run_game():

    load_levels()
    select_level()

    # Loops and asks for input until user manages to solve the board.
    while sokoban_solved() is False:
        sokoban_display()
        user_move = input("Make your move (l)eft, (r)ight, (u)p, (d)own:")
        make_move(user_move)

    win_game()


# Main game-logic function.
def make_move(input_dir):
    # Move left
    if input_dir == "l" and player_can_move("l"):
        player_move("l")

    # Move right
    elif input_dir == "r" and player_can_move("r"):
        player_move("r")

    # Move up
    elif input_dir == "u" and player_can_move("u"):
        player_move("u")

    # Move left
    elif input_dir == "d" and player_can_move("d"):
        player_move("d")

    else:
        print("Could not move that direction.")


def find_player():
    return player[0], player[1]


# Moves the player a direction
def player_move(dir):
    player_y, player_x = find_player()

    x_offset = 0
    y_offset = 0
    if dir == "l":
        x_offset = -1
    if dir == "r":
        x_offset = +1
    if dir == "u":
        y_offset = -1
    if dir == "d":
        y_offset = +1

    y = player_y + y_offset
    x = player_x + x_offset

    did_move = True

    # If the tile we're moving to is a storage tile, set it to the hybrid storage/worker tile.
    if (y, x) in game_board.keys():
        if game_board[(y, x)] == 'storage':
            game_board[(y, x)] = 'storage_worker'

        # If the tile we're moving to is a moveable box or a storage_box, move the box and then the player.
        elif (game_board[(y, x)] == 'box' or game_board[(y, x)] == 'storage_box') and box_can_move(dir, y, x):
            box_move(dir, y, x)
            if (y, x) in game_board.keys():
                if game_board[(y, x)] == 'storage':
                    game_board[(y, x)] = 'storage_worker'
            else:
                game_board[(y, x)] = 'worker'

        # If it's an immovable box, do not move.
        elif (game_board[(y, x)] == 'box' or game_board[(y, x)] == 'storage_box') and not box_can_move(dir, y, x):
            did_move = False

    # Else simply move the worker.
    else:
        game_board[(y, x)] = 'worker'


    # Sets the old tile to the appropriate tile, floor or storage, assuming we moved.
    if did_move is True:
        if game_board[(player_y, player_x)] == 'worker':
            del game_board[(player_y, player_x)]
        elif game_board[(player_y, player_x)] == 'storage_worker':
            game_board[(player_y, player_x)] = 'storage'


def box_move(dir, box_y, box_x):
    x_offset = 0
    y_offset = 0
    if dir == "l":
        x_offset = -1
    if dir == "r":
        x_offset = +1
    if dir == "u":
        y_offset = -1
    if dir == "d":
        y_offset = +1

    y = box_y + y_offset
    x = box_x + x_offset
    # Moves the box
    if (y, x) in game_board.keys():
        if game_board[(y, x)] is 'storage':
            game_board[(y, x)] = 'storage_box'
    else:
        game_board[(y, x)] = 'box'

    # Sets the old box position to floor.
    if game_board[(box_y, box_x)] == 'storage_box':
        game_board[(box_y, box_x)] = 'storage'
    else:
        del game_board[(box_y, box_x)]



# Returns a boolean showing whether or not the player can move a certain direction.
def player_can_move(dir):
    can_move = True

    # Finds the coordinates of the player
    player_y, player_x = find_player()

    # Checks the direction
    y = player_y
    x = player_x
    if dir is 'l':
        x = x-1
    elif dir is 'r':
        x = x+1
    elif dir is 'u':
        y = y-1
    elif dir is 'd':
        y = y+1

    # Checks for walls
    if (y, x) in game_board.keys():
        if game_board[(y, x)] is 'wall':
            can_move = False

    return can_move


# Returns a boolean showing whether or not a box can move a certain direction.
def box_can_move(dir, box_y, box_x):
    can_move = True

    x_offset = 0
    y_offset = 0
    if dir == "l":
        x_offset = -1
    if dir == "r":
        x_offset = +1
    if dir == "u":
        y_offset = -1
    if dir == "d":
        y_offset = +1

    y = box_y + y_offset
    x = box_x + x_offset

    # Checks if the box can move this direction.
    if (y, x) in game_board.keys():
        if game_board[(y, x)] == 'wall' or game_board[(y, x)] == 'box' or game_board[(y, x)] == 'storage_box':
            can_move = False

    return can_move


# Function for selecting a level.
def select_level():
    print("Welcome to Sokoban, please choose a level:")
    for i in range(0, len(available_levels)):
        # Prints all the names of available levels.
        print(str(i + 1) + ".", available_levels[i][1])

    # Grabs input and makes the current level the selected one.
    choice = input()
    global game_board
    y = 0
    print(list(available_levels[int(choice) - 1][0]))
    for row in list(available_levels[int(choice) - 1][0]):
        x = 0
        for col in row:
            if not col is " ":
                for key, value in tiles.items():
                    if col is value:
                        game_board[(y, x)] = key
            x += 1
        y += 1


# Check whether not the board is solved (boxes present).
def sokoban_solved():
    is_solved = True
    for cord, tile in game_board.items():
        if tile == 'box':
            is_solved = False
    return is_solved


# Displays the current board.
def sokoban_display():
    rows = []
    row_max = 0
    col_max = 0
    for cord, tile_name in game_board.items():
        if cord[0] > row_max:
            row_max = cord[0]
        if cord[1] > col_max:
            col_max = cord[1]

    for row in range(row_max+1):
        string = ''
        for col in range(col_max+1):
            adding = ' '
            if (row, col) in game_board.keys():
                adding = tiles[game_board[(row, col)]]
                if adding is tiles['worker'] or adding is tiles['storage_worker']:
                    global player
                    player = (row, col)
            string += adding
        rows.append(string)

    for string in rows:
        print(string)


def win_game():
    sokoban_display()
    print("Congratulations, you beat the level!")


# Loads all levels from the levels folder.
def load_levels():
    # For every file in /levels, add a new element to the available_levels list.
    for file_name in os.listdir('levels'):
        results = []
        with open ('levels/'+file_name) as inputfile:
            for line in inputfile:
                line_list = []
                for char in line:
                    if char != ("\n"):
                        line_list.append(char)
                results.append(line_list)
        available_levels.append((results, os.path.splitext(file_name)[0]))

run_game()
