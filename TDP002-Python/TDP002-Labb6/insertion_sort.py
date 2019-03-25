import random

'''
#Old version, using several lists
def insertion_sort_old(db, func = lambda e: e):
    # Makes an empty list where elements are inserted.
    sorted_list = []

    # Loops through all elements in our database
    for el in db:
        # Applies our function to the current element.
        cur_element = func(el)

        # If the sorted list is empty, simply append the element.
        if len(sorted_list) == 0:
            sorted_list.append(el)

        else:
            # If the current element is one of the largest in the list, add it to the end.
            if cur_element >= func(sorted_list[-1]):
                sorted_list.append(el)

            # Else finds it's proper position
            else:
                # Loops through the entire sorted list.
                for comparison_index in range(0, len(sorted_list)):

                    # If the current element is less than the sorted lists element
                    if cur_element < func(sorted_list[comparison_index]):
                        # Inserts the original element in the proper position in the sorted list.
                        sorted_list.insert(comparison_index, el)
                        break

    return sorted_list

'''

def insertion_sort(db, func = lambda e: e):
    for i in range(len(db)):
        current = func(db[i])
        for si in range(i):
            # From left to right, if current is less than or equal to anything in sorted, place before it and break.
            if current <= func(db[si]):
                _ = db.pop(i)
                db.insert(si, _)
                break


data = random.sample(range(1, 100), 10)
start_data = data[:]
print(start_data)
insertion_sort(data)
print(data)
