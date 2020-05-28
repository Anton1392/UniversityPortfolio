from PostgreSQL.user_db import User_DB
from hashlib import sha256
import crypt
from terminal import Terminal

class API_User:
    def __init__(self):
        self.db = User_DB()


    ##### Super admin stuff: #####


    # Returns True if user is created, False otherwise
    def create_user(self, username, password, permission):
        db = User_DB()
        if db.get_user(username) != None:
            Terminal.error("{} already exist".format(username))
            return "Conflict", 409
        else:
            salt = crypt.mksalt(crypt.METHOD_SHA256)
            password = self.__encrypt_pasword__(password, salt)
            res = self.db.insert_user(username, password, permission, salt)
            if res == False:
                Terminal.error("For some reason {} could not be inserted".format(username))
                return "Internal Server Error", 500
            else:
                Terminal.affirmative("User {} created an account".format(username))
                return "OK", 200


    # Returns True if user is removed, False otherwise
    def delete_user(self, username):
        if (not self.db.remove_user(username)):
            Terminal.error("Failed to delete {}".format(username))
            return False
        else:
            # Run pass table cleaner     <------------------------------------
            Terminal.affirmative("User {} removed".format(username))
            return True


    def update_synonyms(self):
        pass


    ##### Admin stuff: #####
    def add_workout(self, workout, owner):
        pass


    def remove_workout(self, mongo_id, owner):
        pass


    def get_one_workouts(self):
        pass

    def get_all_workouts(self):
        pass



    ##### General stuff #####

    def change_pasword(self, username, password):
        user = self.db.get_user(username)
        if (user == None):
            Terminal.error("Username {} do not exist".format(username))
            return False
        n_password = self.__encrypt_pasword__(password, user[4])
        if(not self.db.update_password(username, n_password)):
            Terminal.error("{} failed to update password".format(username))
            return False
        else:
            Terminal.affirmative("user '{}' updated pasword".format(username))
            return True


    def get_user(self, username):
        return self.db.get_user(username)


    def validate_user(self, username, password):
        usr = self.get_user(username)
        if (usr == None):
            Terminal.error("Username {} do not exist".format(username))
            return False
        n_password = self.__encrypt_pasword__(password, usr[4])
        if(not n_password == usr[2]):
            Terminal.error("User {} gave wrong password".format(username))
            return False
        else:
            Terminal.affirmative("User '{}' logging in".format(username))
            return [usr[1],usr[3]]


    ## Help functions ##


    def __encrypt_pasword__(self, password, salt):
        n_password = sha256()
        n_password.update(salt.encode())
        n_password.update(password.encode())
        return n_password.hexdigest()


if __name__ == "__main__":
    #tests
    db = API_User()
    #db.db.__empty__()
    db.create_user("john", "john",0)
    db.create_user("john", "john",0)
    db.create_user("joh", "john","test")

    db.delete_user("john")
    db.delete_user("john")
    db.delete_user(1)

    db.change_pasword("john","test")
    db.change_pasword("hohn","test")

    print(db.validate_user("john","test"))
    db.validate_user("hohn","test")
