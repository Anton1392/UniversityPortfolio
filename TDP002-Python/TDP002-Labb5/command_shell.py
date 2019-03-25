import re
import os

cur_dir = ""


def run_terminal():
    # Initializes the working directory to the dir this file is in.
    initialize_dir()

    while True:
        command = input("command>")
        process_command(command)


def process_command(command):
    # Matches pwd, it takes no additional flags/arguments.
    if command == "pwd":
        pwd()

    # Matches cd, or cd followed by whitespace followed by anything.
    elif re.match("cd\s*", command):
        cd(command)

    # Matches ls, it takes no additional flags/arguments.
    elif command == "ls":
        ls()

    # Matches cat, or cat followed by whitespace followed by anything.
    elif re.match("cat\s*", command):
        cat(command)

    elif command == "clean":
        clean_cur_dir()


# Finds the current directory
def initialize_dir():
    global cur_dir
    cur_dir = os.getcwd()
    clean_cur_dir()


# Prints the current working directory.
def pwd():
    print(cur_dir)


# Prints all files in the current working directory.
def ls():
    for file in os.listdir(cur_dir):
        print(file)


# Prints the content of a file.
def cat(command):
    # Finds the file name. "cat " is 4 characters, so those are cut away.
    file_name = command[4:]

    # Constructs the file path.
    path = cur_dir + "/" + file_name
    if os.path.exists(path):
        with open(path, 'r') as file:
            for line in file:
                print(line)
    else:
        print("Invalid path.")


def cd(command):
    global cur_dir

    # Cuts out the parameter. "cd " is 3 characters.
    param = command[3:]

    # If "..", go down a directory.
    if param == "..":
        # Splits the current directory with \ as separator.
        split = cur_dir.split("/")

        # Constructs a new path without the last part of the old cur_dir.
        new_path = "/"
        new_path = new_path.join(split[:-1])
        cur_dir = new_path

    # If the parameter actually exists.
    elif param != "":
        # Constructs a new path with the parameter.
        new_path = cur_dir + "/" + param

        # If said path exists, set cur_dir to it.
        if os.path.isdir(new_path):
            cur_dir = new_path
        else:
            print("Invalid path.")

    # If no other match, it's an invalid command.
    else:
        print("Invalid command, add a path after cd.")

    # Cleans the current directory after each cd call.
    clean_cur_dir()


# Replaces backslashes with forwardslashes.
# This increases versatility across operating systems, mainly Linux and Windows.
def clean_cur_dir():
    global cur_dir
    # Replaces all backslashes for forwardslashes.
    cur_dir = cur_dir.replace("\\", "/")

    # Replaces duplicate forwardslashes with a singular forwardslash.
    cur_dir = re.sub(r"/(/)+", r"/", cur_dir)


run_terminal()
