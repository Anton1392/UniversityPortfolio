from functools import reduce


# Sum all natural numbers up to 512 and the Product of all positive numbers up to 512.
def common_function(max):
    sum = reduce(lambda x, y: x + y, range(1, max+1))
    prod = reduce(lambda x, y: x * y, range(1, max+1))

    return sum, prod

print(common_function(512))
