db = [
0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
]


def binary_search(db, val, func = lambda e: e):
    search_db = db[:]
    target = func(val)
    # Check center element
    while len(search_db) > 0:
        center = len(search_db)//2
        print("Searching index:", center)
        print("Database:", search_db)

        # If we found it, return
        if search_db[center] == target:
            return search_db[center]

        # If the center value is less than target, remove the last half of the search range.
        elif search_db[center] < target:
            search_db = search_db[center+1:]

        # If the center value is less than target, remove first last half of the search range.
        elif search_db[center] > target:
            search_db = search_db[:center]
    print("Couldn't find your value.")

db = range(0, 1000000)
print(binary_search(db, 1))