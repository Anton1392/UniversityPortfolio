import json, codecs, re
from pprint import pprint
#from terminal import Terminal
from run_path import Run_Path
from PostgreSQL.synonym_db import Synonym_DB



#make mme tread safe!!!!!!!!!!!
class API_Synonym:
    def __init__(self):
        #self.db = Synonym_DB()
        pass


    # Load Synonym database from synonyms.json
    def import_synonyms(self):
        db = Synonym_DB()
        db.__empty__()
        with open(Run_Path().file_abspath("synonyms.json"), "r") as f:
            data = json.load(f)
            # Structures the synonyms properly.
            db.bulk_insert_synonyms(data)
            #Terminal.affirmative("Synonyms successfully loaded from file.")


    # Gets the main categories of a particular word.
    def get_main_categories(self, word):
        db = Synonym_DB()
        ret = db.search_categories((word, 3)) # Second argument = fuzzy tolerance
        #Terminal.affirmative("Synonyms successfully found main categories " + str(ret) + " of word " + word + ".")
        return ret


    # Adds an empty category.
    def add_category(self, name):
        db = Synonym_DB()
        obj = {name:[name]}
        ret = db.bulk_insert_synonyms(obj)
        #Terminal.affirmative("Synonyms successfully added category " + name + ".")
        return ret


    # Adds a synonym to a category
    def add_synonym(self, category, synonym):
        db = Synonym_DB()
        ret = db.bulk_update_synonym({category:[synonym]})
        #Terminal.affirmative("Synonyms successfully added synonym " + synonym + " to category " + category + ".")
        return ret


    def delete_category(self, category):
        db = Synonym_DB()
        ret = db.delete_in_bulk([category])
        #Terminal.affirmative("Synonyms successfully deleted category " + category + ".")
        return ret


    def delete_synonym(self, category, synonym):
        db = Synonym_DB()
        syns = db.getone(category)
        syns.remove(synonym)
        ret = db.bulk_update_synonym({category:syns})
        #Terminal.affirmative("Synonyms successfully deleted synonym " + synonym + " from category " + category + ".")
        return ret


    def get_synonyms(self):
        db = Synonym_DB()
        return db.getall()

    def nuke_and_replace(self, syns):
        db = Synonym_DB()
        db.__empty__()
        data = json.loads(syns)
        return db.bulk_insert_synonyms(data)


if __name__ == "__main__":
    pass

