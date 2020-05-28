import psycopg2, sys


class Pass_DB:
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
            #print("PostgreSQL connection is closed")



    def __create_table__(self):
        try:
            query = """
            CREATE TABLE IF NOT EXISTS pass_data(
            ID             SERIAL   PRIMARY KEY   NOT NULL,
            ADDRESS        TEXT,
            AVAILABLE      REAL,
            CITY           TEXT,
            DESCRIPTION    TEXT,
            DURATION       TEXT,
            ENDTIME        TEXT,
            LOCATION_NAME  TEXT,
            NAME           TEXT,
            OWNER          TEXT,
            PDESCRIPTION   TEXT,
            PRICE          TEXT,
            PTYPE          TEXT,
            STARTTIME      TEXT,
            S_ID           TEXT    UNIQUE,
            TYPE           TEXT,
            URL            TEXT,
            ZIPCODE        TEXT
            );
            """
            self.cursor.execute(query)
            self.connection.commit()
            #print("pass_data created successfully")
        except (Exception, psycopg2.DatabaseError) as error :
            print ("Error while creating pass_data table", error)


    def insert_many(self,records):
        try:
            records = self.__clean_many_data__(records)
            postgres_query = """ INSERT INTO pass_data (
            S_ID,
            ADDRESS,
            AVAILABLE,
            CITY,
            DESCRIPTION,
            DURATION,
            ENDTIME,
            NAME,
            LOCATION_NAME,
            OWNER,
            PDESCRIPTION,
            PRICE,
            PTYPE,
            STARTTIME,
            TYPE,
            URL,
            ZIPCODE
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s);"""
            self.cursor.executemany(postgres_query, records)
            self.connection.commit()
            #print(self.cursor.rowcount, "Record inserted successfully into mobile table")
            return True
        except (Exception, psycopg2.Error) as error:
            print("Failed inserting record into pass_data table", error)
            return False


    def update_many(self, records):
        try:
            records = self.__clean_many_data__(records)
            #move id to be last
            for i in range(len(records)):
                length = len(records[i])
                records[i] =  records[i][1:length] + (records[i][0],)

            print("NEW RECORDS: \n", records)

            postgres_query = """ UPDATE pass_data SET
            ADDRESS = %s,
            AVAILABLE = %s,
            CITY = %s,
            DESCRIPTION = %s,
            DURATION = %s,
            ENDTIME = %s,
            LOCATION_NAME = %s,
            NAME = %s,
            OWNER = %s,
            PDESCRIPTION = %s,
            PRICE = %s,
            PTYPE = %s,
            STARTTIME = %s,
            S_ID = %s,
            TYPE = %s,
            URL = %s,
            ZIPCODE = %s
            where ID = %s"""
            self.cursor.executemany(postgres_query, records)
            self.connection.commit()
            #print(self.cursor.rowcount, "Records Updated")
        except (Exception, psycopg2.Error) as error:
            print("Failed update record in pass_data table", error)

    def get_one(self, item_id):
        item_id = (item_id,)
        try:
            postgres_query = " SELECT * FROM pass_data WHERE ID = %s " # should be id
            self.cursor.execute(postgres_query, item_id)
            res = self.cursor.fetchone()
            if(res != None):
                return self.__rebuild_one_data__(res)
            else:
                return {}
            #print(self.cursor.rowcount, " found?")
        except (Exception, psycopg2.Error) as error:
            print("Failed get one in pass_data", error)


    def delete_many(self, tmp):
        record_id_list = []
        for i in tmp:
            record_id_list.append((i,))
        try:
            ps_delete_query = """Delete from pass_data where ID = %s"""
            self.cursor.executemany(ps_delete_query, record_id_list)
            self.connection.commit()
            #print(self.cursor.rowcount, "Records Deleted")
        except (Exception, psycopg2.Error) as error:
            print("Failed deleting in pass_data", error)

    def __clean_one_data__(self, dictt):
        return ( dictt["id"],               # S_ID
                 dictt["site"]["address"],  # ADDRESS
                 dictt["available"],        # AVAILABLE
                 dictt["site"]["city"],     # CITY
                 dictt["description"],      # DESCRIPTION
                 dictt["duration"],         # DURATION
                 dictt["endTime"],          # ENDTIME,
                 dictt["name"],             # NAME
                 dictt["site"]["name"],     # LOCATION_NAME
                 dictt["owner"],            # OWNER
                 dictt["pdescription"],     # PDESCRIPTION
                 dictt["price"],            # PRICE
                 dictt["ptype"],            # PTYPE
                 dictt["startTime"],        # STARTTIME
                 dictt["type"],             # S_ID
                 dictt["url"],              # URL
                 dictt["site"]["zipCode"]   # ZIPCODE
        )
            #ID
            #OWNER

    def __clean_many_data__(self, list_dict):
        to_ret = []
        for i in list_dict:
            to_ret.append(self.__clean_one_data__(i))
        return to_ret


    def __rebuild_one_data__(self, tupel):
            #ID             0
            #ADDRESS        1
            #AVAILABLE      2
            #CITY           3
            #DESCRIPTION    4
            #DURATION       5
            #ENDTIME        6
            #LOCATION_NAME  7
            #NAME           8
            #OWNER          9
            #PDESCRIPTION  10
            #PRICE         11
            #PTYPE         12
            #STARTTIME     13
            #S_ID          14
            #TYPE          15
            #URL           16
            #ZIPCODE       17
        return {
            "id":               tupel[0],
            "available":        tupel[2],
            "description":      tupel[4],
            "duration":         tupel[5],
            "endTime":          tupel[6],
            "s_id":             tupel[14],
            "name":             tupel[8],
            "pdescription":     tupel[10],
            "price":            tupel[11],
            "ptype":            tupel[12],
            "site": {"address": tupel[1],
                     "city":    tupel[3],
                     "name":    tupel[7],
                     "zipCode": tupel[17]},
            "startTime":        tupel[13],
            "type":             tupel[15],
            "url":              tupel[16]
               }

    def __rebuild_many_data__(self, list_tupel):
        to_ret = []
        for i in list_tupel:
            to_ret.append(self.__rebuild_one_data__(i))
        return to_ret


    # Accepts a filter with field:value pairs and a list of fields to return.
    # If filter empty, returns all entries
    def find(self, my_filter = {}):
        # Ugly solution, but easy fix. Issues arise when needing multiple AND-statements in query, based on my_filter. Can't really parameterize it to be safe from injection, so whitelist it is.
        # Removes everything but allowed characters in filter
        clean_filter = {}
        allowed_chars="abcdefghijklmnopqrstuvwxyzåäö1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ"
        for key in my_filter:
            newKey = "".join(filter(allowed_chars.__contains__, key))
            newVal = "".join(filter(allowed_chars.__contains__, my_filter[key]))
            clean_filter[newKey] = newVal

        # Builds query
        query = "SELECT * FROM pass_data"
        if clean_filter != {}:
            query += " WHERE "
            for key in clean_filter:
                query += "LOWER(" + key + ") = LOWER(\'" + clean_filter[key] + "\')"
                query += " AND "
            query = query[:-5] # Remove trailing and
        query += ";"

        # Performs query
        self.cursor.execute(query)
        res = self.cursor.fetchall()
        res = self.__rebuild_many_data__(res)
        return res


    def empty(self):
        self.cursor.execute("DELETE FROM pass_data;")

"""
ID  SERIAL PRIMARY KEY
URL
OWNER
"""

if __name__ == "__main__":
    print("hello")


{
  "available": 30.0,
  "description": None,
  "duration": None,
  "endTime": "2019-05-08 09:00:00",
  "id": "w1552_1",
  "name": "Spinning",
  "pdescription": "Cykling p\u00e5 v\u00e5ra moderna cyklar. \u00c4ven m\u00f6jlighet till att k\u00f6ra med pulsband.",
  "price": None,
  "ptype": "workout",
  "site": {
    "address": "Storgatan 7",
    "city": "Link\u00f6ping",
    "name": "Link\u00f6ping",
    "zipCode": "12345"
  },
  "startTime": "2019-05-08 08:00:00",
  "type": "Spinning",
  "url": "https://ipstudenter.zoezi.se/member#/schedule/1/1552"
}
