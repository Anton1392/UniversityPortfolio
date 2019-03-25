import sys
import os
import re


def add_copyright(copyright_path, dest_path, ext=None):
    print("Source path:", copyright_path)
    print("Destination:", dest_path)

    ext = input("Which file types do you want changed? Leave nothing for all files.")
    target_ext = input("Do you want to change the extension of the file at the end? Leave nothing to keep the old extension.")

    # Finds all files that the user wants to work with.
    work_files = []

    # If the destination is a folder
    if os.path.isdir(dest_path):
        # Add all actual files to the work_files list.
        if ext is "":
            work_files = [dest_path + "/" + f for f in os.listdir(dest_path) if os.path.isfile(dest_path + "/" + f)]
        else:
            work_files = [dest_path + "/" + f for f in os.listdir(dest_path) if os.path.isfile(dest_path + "/" + f) and os.path.splitext(f)[1] == ext]
    # If the destination is a file, add it to work_files.
    elif os.path.isfile(dest_path):
        if ext is "":
            work_files.append(dest_path)
        elif os.path.splitext(dest_path)[1] == ext:
            work_files.append(dest_path)

    # Else you dun goofed.
    else:
        print("Invalid path")

    # Grabs the copyright information from a the specified file.
    copyright_info = ""
    if os.path.isfile(copyright_path):
        with open(copyright_path) as copyright_file:
            copyright_info = "\n" + copyright_file.read()

    # Loops through all file paths we want to work with.
    for file_path in work_files:
        # Opens the file path in read/write mode.
        with open(file_path, "r+") as file:
            # Stores all file data as a string.
            data = file.read()

            # Regex replaces all old copyright-sections with a new section with new information in it.
            data = re.sub("BEGIN COPYRIGHT(.|\s)*?END COPYRIGHT", "BEGIN COPYRIGHT" + copyright_info + "\nEND COPYRIGHT", data)

            # Cleanses the old file of content.
            delete_content(file)

            # Write the file with new content.
            file.write(data)
            print("Wrote new copyright content to:", file_path)

    # Renames all files to the new extension, if one was specified.
    if target_ext != "":
        for file in work_files:
            try:
                os.rename(file, os.path.splitext(file)[0] + target_ext)
            except:
                print("Couldn't rename", file, "Maybe the name already exists, or you don't have permission.")

# Deletes all content from an opened file.
def delete_content(pfile):
    # Sets the pointer to beginning of file.
    pfile.seek(0)

    # Tries to get the file size down to 0 kb, cleansing it.
    pfile.truncate()


def try_arguments():
    # Loads all system arguments.
    args = sys.argv

    # Calls add_copyright using the copyright file path and the destination path.
    if len(args) == 3:
        add_copyright(args[1], args[2])

    else:
        print("Invalid arguments. Arguments are -copyright_path, -destination_path")


try_arguments()
