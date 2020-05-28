import configparser
import sys
from terminal import Terminal
from run_path import Run_Path

# Import this module to access the config.ini file.
# Example usage: a = CONFIG["BACKEND"]["WEBSOCKET_URL"]


CONFIG = configparser.ConfigParser()
#CONFIG.read(Run_Path().file_abspath("config.ini"))

try:
    CONFIG.read_file(open(Run_Path().file_abspath("config.ini"), "r"))
except:
    Terminal.error("Config file not found")
    Terminal.error("Will refuse to start")
    sys.exit(0)

Terminal.affirmative("Configuration loaded.")
