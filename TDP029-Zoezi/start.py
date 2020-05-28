#!/usr/bin/env python3
import os
import re
import subprocess

if __name__ == "__main__":
    terminal_name = re.findall("'(.*)'", subprocess.check_output("cat /etc/alternatives/x-terminal-emulator | grep exec", shell=True).rstrip().decode())[0]
    cmd = []
    cmd.append(terminal_name)
    cmd.append("--tab")
    cmd.append("-e")
    cmd.append("bash -i -c \"history -s python3 server/middleware.py; python3 server/middleware.py; exec bash\"")
    cmd.append("--tab")
    cmd.append("-e")
    cmd.append("bash -i -c \"history -s npm start; cd client/my-app; npm start; exec bash\"")
    event = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
