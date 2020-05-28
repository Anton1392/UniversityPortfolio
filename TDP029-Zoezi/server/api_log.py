from datetime import date, datetime
from PostgreSQL.Logg_db import Log_DB


class API_Log:
    # is db created each call to API_LOG?
    __db__ = Log_DB()

    @staticmethod
    def append_log(msg):
        # This is probobly very ineffective, especialy under heavy load
        today_table = datetime.strftime(datetime.now(), "t_%Y_%m_%d")
        API_Log.__db__.create_table(today_table)
        API_Log.__db__.insert_one(msg, today_table)


    @staticmethod
    def append_server_log(msg):
        API_Log.append_log(msg)


    @staticmethod
    def append_search_log(msg):
        API_Log.append_log(msg)


if __name__ == "__main__":
    pass
