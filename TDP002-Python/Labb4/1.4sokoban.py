# Global game board with a sample level. Change this directly in functions.
# The board is a list of lists with characters, where every character is a tile in the level
game_board = []

# List of all available levels
available_levels = [
    ([["#","#","#","#","#","#",],
    ["#"," ",".","O","@","#",],
    ["#"," "," "," "," ","#",],
    ["#","#","#","#","#","#",]], "Default level"),

    ([["#","#","#","#","#","#",],
    ["#"," ","."," ","@","#",],
    ["#","O"," "," "," ","#",],
    ["#","#","#","#","#","#",]], "Level two")
]

# Dictionary with tiles bound to names. Refer to this dict each time a tile is referenced = more readability.
# eg. if (game_board[2][5] == tiles["wall"]): can_move = False
tiles = {
    "worker": "@",
    "box": "O",
    "wall": "#",
    "storage": ".",
    "floor": " ",
    "storage_box": "*",
    "storage_worker": "+",
}


# The first function to be called.
def run_game():

    select_level()

    # Loops and asks for input until user manages to solve the board.
    while sokoban_solved() is False:
        display_board()
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
    # Finds the coordinates of the player
    player_x = 0
    player_y = 0
    found = False
    for y in range(0, len(game_board)):
        for x in range(0, len(game_board[y])):
            if game_board[y][x] == tiles["worker"] or game_board[y][x] == tiles["storage_worker"]:
                player_y = y
                player_x = x
                found = True
                break
        if found:
            break

    return player_x, player_y


# Moves the player a direction
def player_move(dir):
    player_x, player_y = find_player()

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

    did_move = True

    # If the tile we're moving to is a storage tile, set it to the hybrid storage/worker tile.
    if game_board[player_y + y_offset][player_x + x_offset] == tiles["storage"]:
        game_board[player_y + y_offset][player_x + x_offset] = tiles["storage_worker"]

    # If the tile we're moving to is a moveable box, move the box and then the player.
    elif game_board[player_y+ y_offset][player_x + x_offset] == tiles["box"] and box_can_move(dir, player_y + y_offset, player_x + x_offset):
        box_move(dir, player_y + y_offset, player_x + x_offset)
        game_board[player_y + y_offset][player_x + x_offset] = tiles["worker"]

    # If it's an immovable box, do not move.
    elif game_board[player_y + y_offset][player_x + x_offset] == tiles["box"] and not box_can_move(dir, player_y + y_offset, player_x + x_offset):
        did_move = False

    # Else simply move the worker.
    else:
        game_board[player_y + y_offset][player_x + x_offset] = tiles["worker"]


    # Sets the old tile to the appropriate tile, floor or storage, assuming we moved.
    if did_move is True:
        if game_board[player_y][player_x] == tiles["worker"]:
            game_board[player_y][player_x] = tiles["floor"]
        elif game_board[player_y][player_x] == tiles["storage_worker"]:
            game_board[player_y][player_x] = tiles["storage"]


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

    # Moves the box
    if game_board[box_y+y_offset][box_x+x_offset] is tiles["storage"]:
        game_board[box_y + y_offset][box_x + x_offset] = tiles["storage_box"]
    else:
        game_board[box_y+y_offset][box_x+x_offset] = tiles["box"]

    # Sets the old box position to floor.
    game_board[box_y][box_x] = tiles["floor"]


# Returns a boolean showing whether or not the player can move a certain direction.
def player_can_move(dir):
    can_move = True

    # Finds the coordinates of the player
    player_x, player_y = find_player()

    # Checks the direction if the player can move.
    if dir == "l":
        if game_board[player_y][player_x-1] == tiles["wall"] or game_board[player_y][player_x-1] == tiles["storage_box"]:
            can_move = False
    if dir == "r":
        if game_board[player_y][player_x+1] == tiles["wall"] or game_board[player_y][player_x+1] == tiles["storage_box"]:
            can_move = False
    if dir == "u":
        if game_board[player_y-1][player_x] == tiles["wall"] or game_board[player_y-1][player_x] == tiles["storage_box"]:
            can_move = False
    if dir == "d":
        if game_board[player_y+1][player_x] == tiles["wall"] or game_board[player_y+1][player_x] == tiles["storage_box"]:
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

    # Checks if the box can move this direction.
    if game_board[box_y + y_offset][box_x + x_offset] == tiles["wall"] or game_board[box_y + y_offset][box_x + x_offset] == tiles["box"]:
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
    game_board = list(available_levels[int(choice) - 1][0])


# Check whether not the board is solved (boxes present).
def sokoban_solved():
    is_solved = True
    for row in game_board:
        for char in row:
            if char == tiles["box"]:
                is_solved = False

    return is_solved


# Displays the current board.
def display_board():
    for row in game_board:
        output = ""
        output = output.join(row)
        print(output)


def win_game():
    print("Congratulations, you beat the level!")


# Loads all levels from the levels folder.
def load_levels():
    # For every file in /levels, add a new element to the available_levels list.
    pass


run_game()
