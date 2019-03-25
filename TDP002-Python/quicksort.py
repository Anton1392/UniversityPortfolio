import random


def quick_sort(db, func=lambda e: e, begin=0, end=None):
    if end is None:
        end = len(db)

    pivot_index = begin

    # Sorts pivot thing
    for i in range(begin, end):
        if func(db[i]) < func(db[pivot_index]):
            #insert before pivot index
            el = db.pop(i)
            db.insert(pivot_index, el)
            pivot_index += 1

    if len(db[begin:pivot_index]) > 1:
        quick_sort(db, begin=begin, end=pivot_index)
    if len(db[pivot_index+1:end]) > 1:
        quick_sort(db, begin=pivot_index+1, end=end)



testdb = random.sample(range(1, 1000), 10)
startdb = testdb[:]
print(startdb)
quick_sort(testdb)
print(testdb)
