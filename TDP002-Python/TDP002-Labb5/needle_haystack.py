haystack = 'Can you find the needle in this haystack?'.split()


# Recursive function. If it doesn't find it at index 0, it reduces list size by 1 and calls itself.
def contains(target, data):
    if len(data) == 0:
        return False
    return target == data[0] or contains(target, data[1:])


print(contains('find', haystack))
print(contains('needle', haystack))
print(contains('potato', haystack))
