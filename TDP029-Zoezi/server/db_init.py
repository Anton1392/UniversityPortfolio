import sys

print ("DB INIT")
print("Have you wipu?")
inp = input("(Y/n): ")

if inp != "Y":
    print("Then wipu!")
    sys.exit()
print()

print("Trying to import all DBs:")
from PostgreSQL.Logg_db import Log_DB
from PostgreSQL.endpoints_db import EndP_DB
from PostgreSQL.pass_db import Pass_DB
from PostgreSQL.search_log_db import Search_Log_DB
from PostgreSQL.synonym_db import Synonym_DB
from PostgreSQL.user_db import User_DB
print("ALL import succeded!")

print()

print("Trying to create an instance of all DBs:")
l = Log_DB()
ep = EndP_DB()
p = Pass_DB()
sl = Search_Log_DB()
s = Synonym_DB()
u = User_DB()

print("ALL instances succeded!")

print()

print("Trying to insert into synonym DB")
syno = {
    "Nybörjarspinning":["Nybörjarspinning", "spinning", "spinna", "spin"],
    "Nybörjarlöpning":["Nybörjarlöpning", "löpning","springa","löp", "löpa"],
    "Löpträning":["Löpträning", "löpning","springa","löp", "löpa"],
    "Core":["Core", "gymnastik", "magträning", "zumba"],
    "Zumba":["Zumba", "träna", "zumba"],
    "Cirkelträning":["Cirkelträning", "cirkel","träning", "träna"],
    "Hopplös gympa":["Hopplös gympa", "gymnastik","gympa", "hopplös"],
    "Debugging":["Debugging", "bug-hunting","bugg"]
}
s.bulk_insert_synonyms(syno)
print("Synonym db set to defult")

print()

print("Trying to connect to DB")
import psycopg2
from psycopg2 import sql

connection = psycopg2.connect(user = "postgres",
                                   password = "postgres",
                                   host = "127.0.0.1",
                                   port = "5432",
                                   database = "zoezi")
cursor = connection.cursor()
print("Connect to DB!")

print()

print("Trying to describe db"
)
print("This wont do anyting!!")

print()

print("END")
