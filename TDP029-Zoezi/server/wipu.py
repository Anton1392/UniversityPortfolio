import psycopg2
from psycopg2 import sql



# Will driop all tables in backend,
# so please be careful!

class Wipu:
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

    def all(self):
        lst_names = self.get_table_names()
        if lst_names == []:
            print("No tables to drop")
            return False
        else:
            for i in lst_names:
                if not self.drop_table(i[0]):
                    print("{:<15}{}".format("Failed to drop", i[0]))
                else:
                    print("{:<15}{}".format("Dropped", i[0]))
            return True

    def get_table_names(self):
        try:
            query = """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema='public'
            AND table_type='BASE TABLE';
            """
            self.cursor.execute(query)
            return self.cursor.fetchall()
        except (Exception, psycopg2.Error) as error:
            print("Failed to get all table names", error)

    def drop_table(self, table_name):
        #print(table_name)
        try:
            query = " DROP TABLE IF EXISTS {}".format(table_name)
            self.cursor.execute(query)
            return (self.cursor.rowcount != 0)
        except (Exception, psycopg2.DatabaseError) as error :
            print ("Error while dropping table", error)
            return False

if __name__ == "__main__":
    import sys
    print ("Will wipu everything")
    print("Are you sure?")
    inp = input("(Y/n): ")

    if inp != "Y":
        print("Aborting")
        sys.exit()

    w = Wipu()
    w.all()
