import psycopg2
from terminal import Terminal

class Synonym_DB:
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
            self.cursor.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm;")
            self.connection.commit()
            self.cursor.execute("CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;")
            self.connection.commit()
            self.__create_synonym_table__()
        except (Exception, psycopg2.Error) as error :
            Terminal.error ("Error while connecting to PostgreSQL")


    def __del__(self):
        if(self.connection):
            self.cursor.close()
            self.connection.close()
            #Terminal.error("PostgreSQL connection is closed")


    def __create_synonym_table__(self):
        try:
            #These can be canged to correct type later (if known)
            create_table_query = ''' CREATE TABLE IF NOT EXISTS synonym(
            ID         TEXT   PRIMARY KEY   NOT NULL,
            SYNONYMS   TEXT
            );
            '''
            self.cursor.execute(create_table_query)
            self.connection.commit()
            #print("synonym table created successfully")
        except (Exception, psycopg2.DatabaseError) as error :
            Terminal.error ("Error while creating synonym table")

    def __drop_synonym_table__(self):
        try:
            sql_query = """DROP TABLE IF EXISTS synonym"""
            self.cursor.execute(sql_query)
            self.connection.commit()
            row_count = self.cursor.rowcount
            #print(row_count, "Tables Deleted")
        except (Exception, psycopg2.DatabaseError) as error :
            Terminal.error("Error while dropping synonym table")

    def bulk_update_synonym(self, items):
        items = self.__transform_synonym_dict__(items)
        #move id to be last
        for i in range(len(items)):
            length = len(items[i])
            items[i] =  items[i][1:length] + (items[i][0],)

        try:
            # Update multiple items
            postgres_query = """ UPDATE synonym SET
            SYNONYMS = SYNONYMS || CONCAT(',', %s)
            where ID = %s"""
            self.cursor.executemany(postgres_query, items)
            self.connection.commit()
            return (self.cursor.rowcount > 0)
            #print(self.cursor.rowcount, "Records Updated")
        except (Exception, psycopg2.Error) as error:
            Terminal.error("Error while updating PostgreSQL table")
            print(error)
            return False


    def delete_in_bulk(self, cats):
        try:
            records = []
            for i in cats:
                records.append((i,))

            ps_delete_query = """Delete from synonym where id = %s"""
            self.cursor.executemany(ps_delete_query, records)
            self.connection.commit()
            row_count = self.cursor.rowcount
            return (row_count > 0)
            #print(row_count, "Record Deleted")
        except (Exception, psycopg2.Error) as error:
            Terminal.error("Error while connecting to PostgreSQL")
            return False



    def bulk_insert_synonyms(self, records):
        records = self.__transform_synonym_dict__(records)
        try:
            postgres_query = """
            INSERT INTO synonym
            (ID, SYNONYMS)
            VALUES (%s,%s)
            """
            self.cursor.executemany(postgres_query, records)
            self.connection.commit()
            #print(self.cursor.rowcount, "Record inserted successfully into synonym table")
            return self.cursor.rowcount > 0
        except (Exception, psycopg2.Error) as error:
            Terminal.error("Failed inserting record into mobile table {}".format(error))
            return False

    # Finds main categories of term[0], using term[1] for tolerance.
    # Higher tolerance = more matches.
    def search_categories(self, term):
        try:
            term = term * 2

            postgres_query = """
            SELECT DISTINCT (u.id)
            FROM synonym AS u
            LEFT JOIN
            (SELECT u.id, unnest(string_to_array(u.synonyms, ',')) AS ALIAS FROM synonym AS u) AS q
            ON u.id=q.id
            WHERE levenshtein(u.synonyms,%s)<%s
            OR levenshtein(q.ALIAS,%s)<%s;
            """
            self.cursor.execute(postgres_query, term)
            res1 = self.cursor.fetchall()

            row_count = self.cursor.rowcount

            # Makes return data correct format.
            ret = []
            for tup in res1:
                ret.append(tup[0])

            return ret
        except (Exception, psycopg2.DatabaseError) as error :
            Terminal.error("Error while searching categories")
            return []
    #transfrom python dict to format sql accepts
    def __transform_synonym_dict__(self, data):
        try:
            to_ret = []
            for k, v in data.items():
                to_ret.append((k,",".join(v)))
            return to_ret
        except (Exception, psycopg2.DatabaseError) as error :
            Terminal.error("Error while transforming synonym to dict")
            return []

    #rebuild sql tupel list to python dict
    def __rebuild_synonym_dict__(self, data):
        try:
            to_ret = {}
            for i in data:
                n_data = []
                for j in i[1].split(","):
                    n_data.append(j)
                to_ret[i[0]] = n_data
            return to_ret
        except (Exception, psycopg2.DatabaseError) as error :
            Terminal.error("Error while rebuilding synonym dict")
            return {}

    def __empty__(self):
        try:
            self.__drop_synonym_table__()
            self.__create_synonym_table__()
        except (Exception, psycopg2.DatabaseError) as error :
            Terminal.error("Erroring while using empty")

    def getall(self):
        try:
            postgres_query = """
            SELECT * FROM synonym
            """
            self.cursor.execute(postgres_query)
            return self.__rebuild_synonym_dict__(self.cursor.fetchall())
        except (Exception, psycopg2.DatabaseError) as error :
            Terminal.error("Error while using getall")
            return {}
    # Gets the string representing synonyms of the category
    def getone(self, category):
        try:
            postgres_query = "SELECT * FROM synonym WHERE id = %s"
            self.cursor.execute(postgres_query, (category,))
            ret = self.__rebuild_synonym_dict__(self.cursor.fetchall())
            return ret[category]
        except (Exception, psycopg2.DatabaseError) as error :
            Terminal.error("Error while using getall")
            return NULL

if __name__ == "__main__":
    """
    import sys
    print("Running this test will ruin synonym db")
    print("Continue? Y/n")
    x = input()
    if x != "Y":
        sys.exit(0)
    print("Running test")
    """

    db = Synonym_DB()
    db.__empty__()
    syno = {
        "löp":["löp", "löpa", "löpning", "löpare"],
        "spin":["spin", "spinning","cykling","cykla"],
        "gympa":["gympa", "gymnastik"],
        "träning":["träning", "träna"],
        "pt":["pt", "personlig","tränare"],
        "nybörjar":["nybörjar", "nybörjare"],
        "dans":["dans", "dansa","dansning"],
        "test":["test", "löpa","dansa"],
        "träna":["träna", "träning"]
    }
    db.bulk_insert_synonyms(syno)
    #print(db.getone("dans"))
    """
    print()
    print(db.getall())
    """
    while(True):
        x = input("Type word: ")
        y = input("Type sens: ")
        print("Found synonyms: " + str(db.search_categories((x, y))))
