import psycopg2
from psycopg2 import sql
from table import Table

class Info:
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
            print ("Error while connecting to PostgreSQL", error)


    def __del__(self):
        if(self.connection):
            self.cursor.close()
            self.connection.close()



    def tables_info(self):
        try:
            query = """
            SELECT
            table_schema, table_name, table_type
            FROM
            information_schema.tables
            WHERE
            table_schema = 'public';
            """
            self.cursor.execute(query)
            res = self.cursor.fetchall()

        except (Exception, psycopg2.Error) as error:
            print("Failed to get all table names", error)
            return

        print("Res:", res)
        if (res == []):
            print("No tables found")
            return

        t = Table(["status","name","type"])
        for i in res:
            #print(i)
            t.insert(i)

        t._print()

    def table_info(self,name):
        try:
            query = """
            SELECT
            COLUMN_NAME, DATA_TYPE, IS_NULLABLE
            FROM
            information_schema.COLUMNS
            WHERE
            TABLE_NAME = %s;
            """

            #get constraints+
            #get fks
            #get pk
            #someting more?
            self.cursor.execute(query,(name,))
            res = self.cursor.fetchall()
            #print("COLUMN_NAME", "DATA_TYPE", "IS_NULLABLE")
            #print(res)
            #print()
            t = Table(["COLUMN_NAME", "DATA_TYPE", "IS_NULLABLE"])
            for i in res:
                #print(i)
                t.insert(i)
            t._print()
            print()



            query ="""
            SELECT
            *
            FROM
            information_schema.SEQUENCES
            """
            self.cursor.execute(query)
            res = self.cursor.fetchall()
            t = Table(["SEQUENCE_CATALOG",
                  "SEQUENCE_SCHEMA",
                  "SEQUENCE_NAME",
                  "DATA_TYPE",
                  "NUMERIC_PRECISION",
                  "NUMERIC_PRECISION_RADIX",
                  "NUMERIC_SCALE",
                  "START_VALUE",
                  "MINIMUM_VALUE",
                  "MAXIMUM_VALUE",
                  "INCREMENT",
                  "CYCLE_OPTION"])
            for i in res:
                #print(i)
                t.insert(i)
            t._print()
            print()


        except (Exception, psycopg2.Error) as error:
            print("Failed to get all table names", error)
            return



if __name__ == "__main__":
    i = Info()
    i.tables_info()
    i.table_info("users")
