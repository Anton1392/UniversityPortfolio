# Used for making relative file paths to absolute
# Made relative from root of server (where this file is located)

import os.path

def singleton(cls, *args, **kw):
    instances = {}
    def _singleton():
        if cls not in instances:
            instances[cls] = cls(*args, **kw)
        return instances[cls]
    return _singleton


@singleton
class Run_Path:
    def __init__(self):
        self.server_root_path = os.path.abspath(os.path.dirname(__file__))
        #Terminal.affirmative("Server run_path set to: " + self.server_root_path)

    def file_abspath(self, caller_relative_path):
        return os.path.join(self.server_root_path, caller_relative_path)


if __name__ == "__main__":
    from terminal import Terminal

    test = Run_Path()
    Terminal.debug1("Root_path: " + test.server_root_path)
    t = test.file_abspath(__file__)
    Terminal.debug1("My path: " + t)

    test2= Run_Path()

    Terminal.debug1("Instance 1: " + str(id(test)))
    Terminal.debug1("Instance 2: " + str(id(test2)))
    Terminal.debug1("Are instances eq: " +  str(id(test2) == id(test2) ))
    Terminal.debug1( test == test2)
    Terminal.debug1( test is test2)
