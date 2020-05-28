from api_log import API_Log
# Used for nicer terminal printouts
# Also logs the things that is sent to this class (except debug stuff)
class Terminal:
    @staticmethod
    def status(msg):
        print(msg)
    @staticmethod
    def error(msg):
        API_Log.append_server_log(msg)
        print("\033[91m{}\033[00m" .format(msg))
    @staticmethod
    def affirmative(msg):
        API_Log.append_server_log(msg)
        print("\033[92m{}\033[00m" .format(msg))
    @staticmethod
    def warning(msg):
        API_Log.append_server_log(msg)
        print("\033[93m{}\033[00m" .format(msg))
    @staticmethod
    def debug1(msg):
        print("\033[95m{}\033[00m" .format(msg))
    @staticmethod
    def debug2(msg):
        print("\033[94m{}\033[00m" .format(msg))

if __name__ == "__main__":
    Terminal.status("status")
    Terminal.affirmative("affirmative")
    Terminal.warning("warning")
    Terminal.error("error")

    Terminal.debug1("debug1")
    Terminal.debug2("debug2")
