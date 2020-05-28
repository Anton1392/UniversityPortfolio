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


class Search_Log_DB:
    def __init__(self):
        try:
            self.connection = psycopg2.connect(user = "postgres",
                                               password = "postgres",
                                               host = "127.0.0.1",
                                               port = "5432",
                                               database = "zoezi")
            self.cursor = self.connection.cursor()
            self.connection.autocommit = True
            self.create_log_table()
        except (Exception, psycopg2.Error) as error :
            print ("Error while connecting to PostgreSQL", error)


    def __del__(self):
        if(self.connection):
            self.cursor.close()
            self.connection.close()


    def create_log_table(self):
        try:
            self.cursor.execute(sql.SQL("""
            CREATE TABLE IF NOT EXISTS search_log_db(
            term      TEXT  PRIMARY KEY NOT NULL,
            count     REAL
            );
            """))
            self.connection.commit()
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.DatabaseError) as error :
            print ("Error while creating table", error)
            return False


    def drop_table(self):
        try:
            self.cursor.execute(sql.SQL("""
            DROP TABLE IF EXISTS search_log_db;
            """))
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.DatabaseError) as error :
            print ("Error while dropping table", error)
            return False



    def __insert_search__(self, term):
        try:
            postgres_query = """
                INSERT INTO search_log_db (term, count) VALUES (%s,%s)
            """

            self.cursor.execute(postgres_query, (term,1))
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.Error) as error:
            print("Failed inserting term", error)
            return False

    def __increment_count__(self, term):
        try:
            postgres_query = """
                    UPDATE search_log_db SET count = count + 1 WHERE term = %s;
            """
            self.cursor.execute(postgres_query, (term,))
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.Error) as error:
            print("Failed incrementing count", error)
            return False

    # Either adds a search term, or increments counter. This should be public.
    def add_search(self, term):
        if(self.get_one(term) == []):
            self.__insert_search__(term)
        else:
            self.__increment_count__(term)


    def get_one(self, term):
        try:
            postgres_query = "SELECT * FROM search_log_db WHERE term = %s"
            self.cursor.execute(postgres_query, (term,))
            ret = self.cursor.fetchall()
            return self.__rebuild_many_data__(ret)
        except (Exception, psycopg2.Error) as error:
            print("Failed getting one in search_log_db", error)
            return False
    
    def get_all(self):
        try:
            postgres_query = "SELECT * FROM search_log_db"
            self.cursor.execute(postgres_query)
            ret = self.cursor.fetchall()
            return self.__rebuild_many_data__(ret)
        except (Exception, psycopg2.Error) as error:
            print("Failed getting all in search_log_db", error)
            return False

    def remove_one(self, term):
        try:
            postgres_query = "DELETE FROM search_log_db WHERE term = %s"
            self.cursor.execute(postgres_query, (term,))
            return (self.cursor.rowcount > 0)
        except (Exception, psycopg2.Error) as error:
            print("Failed removing one in search_log_db", error)
            return False

    def __rebuild_one_data__(self, tupel):
        return {
                "term":        tupel[0],
                "count":       tupel[1]
                }
        return to_ret


    def __rebuild_many_data__(self, list_tupel):
        to_ret = []
        for i in list_tupel:
            to_ret.append(self.__rebuild_one_data__(i))
        return to_ret

if __name__ == "__main__":
    pass
