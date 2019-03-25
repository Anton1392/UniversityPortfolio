def partial(func, value):
    return lambda x: func(value, x)

def add(n, m): return n + m
def mult(n, m): return n * m

add_five = partial(add, 5)
print(add_five(3))
print(add_five(16))

add_two = partial(add, 2)
print(add_two(7))

mult_by_two = partial(mult, 2)
print(mult_by_two(64))
