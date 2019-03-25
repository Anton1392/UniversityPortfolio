# Global game board with a sample level. Change this directly in functions.
# The board is a list of strings, where every string is a row in the level.
game_board = [
    "######",
    "# .O@#",
    "######",
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
    level_choice = input("Welcome to Sokoban, please choose a level:\n1. first_level\n2. second_level\n3. my_level")
    select_level(level_choice)

    # Loops and asks for input until user manages to solve the board.
    while sokoban_solved() is False:
        display_board()
        user_move = input("Make your move (l)eft, (r)ight, (u)p, (d)own:")
        make_move(user_move)

    win_game()


# Main game-logic function.
def make_move(input_dir):
    # Add game logic here for moving the board positions.
    pass


# Function for selecting a level.
def select_level(choice):
    if choice == 1:
        # game_board = level2. Make this a unique level later on.
        pass
    elif choice == 2:
        # game_board = level2. Make this a unique level later on.
        pass
    elif choice == 3:
        # game_board = level3. Make this a unique level later on.
        pass


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
