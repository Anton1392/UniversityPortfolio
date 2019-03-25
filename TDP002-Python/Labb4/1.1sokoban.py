# Global game board with a sample level. Change this directly in functions.
# The board is a list of strings, where every string is a row in the level.
game_board = [
    "######",
    "# .O@#",
    "######",
]

# List of all available levels
available_levels = [(game_board, "Default level")]

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
    load_levels()

    select_level()

    # Loops and asks for input until user manages to solve the board.
    while sokoban_solved() is False:
        display_board()
        user_move = input("Make your move (l)eft, (r)ight, (u)p, (d)own:")
        make_move(user_move)

    win_game()


# Main game-logic function.
def make_move(input_dir):
    # Add game logic here for moving the board positions.

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
    if dir == "l":
        pass
    if dir == "r":
        pass
    if dir == "u":
        pass
    if dir == "d":
        pass

    # Sets the old tile to the appropriate tile, floor or storage.
    if game_board[player_y][player_x] == tiles["worker"]:
        pass
    elif game_board[player_y][player_x] == tiles["storage_worker"]:
        pass


# Returns a boolean showing whether or not the player can move a certain direction.
def player_can_move(dir):
    can_move = True

    # Finds the coordinates of the player
    player_x, player_y = find_player()

    # Checks the direction if the player can move.
    if dir == "l":
        if game_board[player_y][player_x-1] == tiles["wall"]:
            can_move = False
    if dir == "r":
        if game_board[player_y][player_x+1] == tiles["wall"]:
            can_move = False
    if dir == "u":
        if game_board[player_y-1][player_x] == tiles["wall"]:
            can_move = False
    if dir == "d":
        if game_board[player_y+1][player_x] == tiles["wall"]:
            can_move = False

    return can_move


# Loads all levels from the levels folder.
def load_levels():
    # For every file in /levels, add a new element to the available_levels list.
    pass


# Function for selecting a level.
def select_level():
    print("Welcome to Sokoban, please choose a level:")
    for i in range(0, len(available_levels)):
        # Prints all the names of available levels.
        print(str(i + 1) + ".", available_levels[i][1])

    # Grabs input and makes the current level the selected one.
    choice = input()
    game_board = available_levels[int(choice) - 1]


# Checks whether or not the board is solved.
def sokoban_solved():
    is_solved = False
    # Logic for checking if the board is solved here.
    return is_solved


# Displays the current board.
def display_board():
    for row in game_board:
        print(row)


def win_game():
    print("Congratulations, you beat the level!")


run_game()
