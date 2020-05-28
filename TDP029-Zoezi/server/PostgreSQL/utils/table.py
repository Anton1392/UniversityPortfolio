class Table:
    def __init__(self, headers):
        self.__headers__ = headers
        self.__content__ = []

    def insert(self, tup):
        if len(tup) != len(self.__headers__):
            print(tup , "not same lenght as", self.__headers__)
            print("tup:",len(tup) , " head:", len(self.__headers__))
            return False
        else:
            self.__content__.append(tup)
            #print(tup)
            return True

    def __str__(self):
        return ''

    def _print(self):
        lens = []
        for i in self.__headers__:
            lens.append(len(i))
        #print(self.__headers__)
        #print(lens)

        for i in self.__content__:
            for j in range(len(lens)):
                if lens[j] < len(str(i[j])):
                    lens[j] = len(str(i[j]))

        #print(lens)
        self._print_line(lens)

        print('|',end='')
        entry = " {:{align}{width}} |"
        for i in range(len(lens)):
            print(entry.format(self.__headers__[i], align='^', width=lens[i]), end='')
        print()

        self._print_line(lens)

        for item in self.__content__:
            print('|',end='')
            for i in range(len(lens)):
                print(entry.format(item[i], align='<', width=lens[i]), end='')
            print()

        self._print_line(lens)
        print("({} rows)".format(len(self.__content__)))

        # passing format codes as arguments
        #print(entry.format('cat', align='<', width=len("cat")))

    def _print_line(self, lens):
        print('+',end='')
        for i in lens:
            print("-"*(i+2), end='')
            print("+", end='')
        print()
