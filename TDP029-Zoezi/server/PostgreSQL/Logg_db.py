import psycopg2
from psycopg2 import sql
from datetime import date, datetime,timedelta

"""
connection is by defult in autocommit mode.
This can be changed with:
 connection.autocommit=True or False
If switched to False:
 you have to write "self.connection.commit()" after each querry
"""


class Log_DB:
    def __init__(self):
        try:
            self.connection = psycopg2.connect(user = "postgres",
                                               password = "postgres",
                                               host = "127.0.0.1",
                                               port = "5432",
                                               database = "zoezi")
            self.cursor = self.connection.cursor()
            self.connection.autocommit = True
        except (Exception, psycopg2.Error) as error :
            print("Error while connecting to PostgreSQL", error)


    def __del__(self):
        if(self.connection):
            self.cursor.close()
            self.connection.close()


    def create_table(self, table_name):
        try:
            self.cursor.execute(sql.SQL("""
            CREATE TABLE IF NOT EXISTS {}(
            id        SERIAL   PRIMARY KEY,
            message   TEXT     NOT NULL
            );
            """).format(sql.Identifier(table_name)))
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.DatabaseError) as error :
            print ("Error while creating table", error)
            return False


    def drop_table(self, table_name):
        try:
            self.cursor.execute(sql.SQL("""
            DROP TABLE IF EXISTS {};
            """).format(sql.Identifier(table_name)))
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.DatabaseError) as error :
            print ("Error while dropping table", error)
            return False



    def insert_one(self, message, table_name):
        try:
            postgres_query = """
            INSERT INTO {} (message) VALUES (%s);
            """.format(table_name)
            self.cursor.execute(postgres_query, (message,))
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.Error) as error:
            print("Failed inserting", error)
            return False


    def read(self, table_name):
        try:
            self.cursor.execute(sql.SQL('SELECT * FROM {}').format(sql.Identifier(table_name)))
            return self.cursor.fetchall()
        except (Exception, psycopg2.Error) as error:
            print("Failed get one in zoezidata", error)
            return None


    def read_many(self, table_names):
        try:
            to_ret = {}
            for i in table_names:
                self.cursor.execute(sql.SQL('SELECT * FROM {}').format(sql.Identifier(i)))
                to_ret[i] = self.cursor.fetchall()
                #print(self.cursor.rowcount, " found?")
            return to_ret
        except (Exception, psycopg2.Error) as error:
            print("Failed get many in zoezidata", error)
            return None


    def read_all_tables(self):
        table_names = self.get_table_names()
        return self.read_many(table_names)


    def get_table_names(self):
        try:
            postgres_query = """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema='public'
            AND table_type='BASE TABLE';
            """
            self.cursor.execute(postgres_query)
            res = self.cursor.fetchall()
            #print(self.cursor.rowcount, " found?")
            to_ret = []
            for i in res:
                strr = str(i[0])
                if strr.startswith("t_"):
                    to_ret.append(strr)
            return to_ret
        except (Exception, psycopg2.Error) as error:
            print("Failed to get all table names", error)


    def drop_all_tables(self):
        table_names = self.get_table_names()
        for i in table_names:
            self.drop_table(i)


if __name__ == "__main__":
    pass
