import os
from run_path import Run_Path
from datetime import date, datetime
from PostgreSQL.search_log_db import Search_Log_DB


class API_Search_Log:
    @staticmethod
    def add_search(search):
        s = Search_Log_DB()
        s.add_search(search);

    @staticmethod
    def get_one(search):
        s = Search_Log_DB()
        return s.get_one(search);

    @staticmethod
    def remove_one(search):
        s = Search_Log_DB()
        return s.remove_one(search);

    @staticmethod
    def get_all():
        s = Search_Log_DB()
        # Sorts by searchcount before returning.
        to_ret =  s.get_all();
        to_ret = sorted(to_ret, key=lambda x: x["count"], reverse=True)
        return to_ret

    # Careful when calling this!
    @staticmethod
    def drop():
        s = Search_Log_DB()
        s.drop_table()


if __name__ == "__main__":
    a = API_Search_Log()
    a.drop()
    a.add_search("beepbep")
    a.add_search("bop blep")
    a.add_search("bop blep")
    a.add_search("barf boom")
    a.add_search("bop blep")
    a.add_search("beepbep")
    a.add_search("bop blep")
    a.remove_one("beepbep")
    print(a.get_one("bop blep"))
    print(a.get_all())
