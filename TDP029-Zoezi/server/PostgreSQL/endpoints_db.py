import psycopg2
import sys


class EndP_DB:
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
            self.__create_table__()
        except (Exception, psycopg2.Error) as error :
            print ("Error while connecting to PostgreSQL", error)



    def __del__(self):
        if(self.connection):
            self.cursor.close()
            self.connection.close()


    def __create_table__(self):
        try:
            postgres_query = """
            CREATE TABLE IF NOT EXISTS endpoints(
             ID         SERIAL   PRIMARY KEY,
             URL        TEXT,
             OWNER      TEXT
            );
            """
            self.cursor.execute(postgres_query)
            self.connection.commit()
            if(len(self.get_endpoints()) == 0):
                self.add_endpoint("""https://ipstudenter.zoezi.se/api/marketplace/products/""", "zoezi")

            #print("endpoints created successfully")

        except (Exception, psycopg2.DatabaseError) as error :
            print ("Error while creating zoezidata table", error)


    def get_endpoints(self):
        try:
            postgres_query = " SELECT * FROM endpoints "
            self.cursor.execute(postgres_query)
            return self.cursor.fetchall()
        except (Exception, psycopg2.Error) as error:
            print("Failed get many in zoezidata", error)

    def add_endpoint(self, url, owner):
        try:
            postgres_query = """
             INSERT into endpoints(URL, OWNER) values(%s, %s);
            """
            self.cursor.execute(postgres_query, (url, owner))
            self.connection.commit()
            return True
        except (Exception, psycopg2.Error) as error:
            self.connection.rollback()
            print("Failed add_endpoint in endpoints", error)
            return False
