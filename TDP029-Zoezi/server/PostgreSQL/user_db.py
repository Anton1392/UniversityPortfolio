import psycopg2
import sys
from terminal import Terminal

"""
connection is by defult in autocommit mode.
This can be changed with:
 connection.autocommit=True or False
If switched to False:
 you have to write "self.connection.commit()" after each querry
"""

class User_DB:
    def __init__(self):
        try:
            self.connection = psycopg2.connect(user = "postgres",
                                               password = "postgres",
                                               host = "127.0.0.1",
                                               port = "5432",
                                               database = "zoezi")
            self.cursor = self.connection.cursor()
            #print ( self.connection.get_dsn_parameters(),"\n")
            #self.cursor.execute("SELECT version();")
            #self.record = self.cursor.fetchone()
            #print("You are connected to - ", self.record,"\n")
            self.connection.autocommit = True
            self.__create_users_table__()
        except (Exception, psycopg2.Error) as error :
            Terminal.error ("Error while connecting to PostgreSQL " + str(error))
            return


    def __del__(self):
        if(self.connection):
            self.cursor.close()
            self.connection.close()


    def __create_users_table__(self):
        try:
            create_table_query = '''
            CREATE TABLE IF NOT EXISTS users(
            id           SERIAL   PRIMARY KEY,
            username     TEXT     UNIQUE NOT NULL,
            password     TEXT     UNIQUE NOT NULL,
            permission   INT      NOT NULL,
            salt         TEXT     NOT NULL
            );
            '''
            self.cursor.execute(create_table_query)
        except (Exception, psycopg2.DatabaseError) as error:
            Terminal.error ("Error while creating users table " + str(error))

    def __drop_table__(self):
        try:
            postgres_query = """DROP TABLE IF EXISTS users"""
            self.cursor.execute(postgres_query)
            #print(self.cursor.rowcount, "Tables Deleted")
        except (Exception, psycopg2.DatabaseError) as error :
            Terminal.error ("Error while dropping admindata table " + str(error))


    # Return True if a table is deleted, otherwise False
    def __empty__(self):
        try:
            self.cursor.execute("DELETE FROM users;")
            return True
        except (Exception, psycopg2.DatabaseError) as error :
            Terminal.error ("Error while using __empty__ " + str(error))
            return False


    # Return user data if found, otherwise returns None
    def get_user(self, name):
        try:
            postgres_query = " SELECT * FROM users WHERE username = %s "
            self.cursor.execute(postgres_query, (name,))
            #print(self.cursor.rowcount, " found?")
            return self.cursor.fetchone()
        except (Exception, psycopg2.Error) as error:
            Terminal.error("Failed get one in users " + str(error))
            return None


    # Return True if a record is inserted, otherwise False
    def insert_user(self, username, password, permission, salt):
        try:
            postgres_query = """
            INSERT INTO users (
            username,
            password,
            permission,
            salt
            ) VALUES (%s,%s,%s,%s);
            """
            self.cursor.execute(postgres_query, (username, password, permission, salt))
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.Error) as error :
            Terminal.error("Failed to insert user into users table " + str(error))
            self.connection.rollback()
            return False


    # Return True if a record is removed, otherwise False
    def remove_user(self, username):
        try:
            sql_delete_query = """
            Delete from users where username = %s;
            """
            self.cursor.execute(sql_delete_query, (username,))
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.Error) as error:
            Terminal.error("Error in Delete operation " + str(error))
            self.connection.rollback()
            return False


    # Return True if a password is updated, otherwise False
    def update_password(self, username, password):
        try:
            postgres_query = """
            UPDATE users SET
            password = %s
            WHERE username = %s """
            self.cursor.execute(postgres_query, (password,username))
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.Error) as error:
            Terminal.error("Error in Change operation " + str(error))
            self.connection.rollback()
            return False


if __name__ == "__main__":
    """
    import json
    import urllib.request
    #connect and create class instance
    db = DataBase()
    db.create_users_table()
    db.create_salt_table()

    db.insert_one_user("sven","pass")
    db.change_one_user("sven","ketchup")
    db.insert_one_salt("sven","salt")
    db.delete_salt("sven")
    """
    pass
