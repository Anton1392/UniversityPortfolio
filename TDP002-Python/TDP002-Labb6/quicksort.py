import random

'''
#Old verison, using several lists
def quick_sort_old(db, func = lambda e: e):
    # Finds the pivot.
    pivot_index = len(db)//2

    # The two parts, part 1 is lower than pivot, part 2 is higher than pivot.
    part1 = []
    part2 = []

    # Loops through all elements in our input data.
    for i in range(len(db)):
        if i is not pivot_index:
            # Compare the element to our pivot, and add it appropriately to our list.
            if func(db[i]) <= func(db[pivot_index]):
                part1.append(db[i])
            else:
                part2.append(db[i])

    # If any of the parts are still sortable, sort them using Re(recursion)cursion
    if len(part1) > 1:
        part1 = quick_sort(part1)
    if len(part2) > 1:
        part2 = quick_sort(part2)

    # When the parts are sorted, return them with the pivot in between!
    return part1 + [db[pivot_index]] + part2
'''


def quick_sort(db, func = lambda e: e, begin = 0, end = None):
    if end is None:
        end = len(db)

    pivot_index = begin

    # From left to right, pivot starting at 0
    for i in range(begin, end):
        # If value is less than pivot, place before pivot
        if func(db[i]) < func(db[pivot_index]):
            el = db.pop(i)
            db.insert(pivot_index, el)
            pivot_index += 1

    # If one of the sorted portions is more than 1, keep sorting
    if len(db[begin:pivot_index]) > 1:
        quick_sort(db, func = func, begin = begin, end = pivot_index)
    if len(db[pivot_index:end]) > 1:
        quick_sort(db, func = func, begin = pivot_index+1, end = end)




testdb = random.sample(range(1, 100), 10)
startdb = testdb[:]
print(startdb)
quick_sort(testdb)
print(testdb)
