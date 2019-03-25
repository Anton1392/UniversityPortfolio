def compose(func_one, func_two):
    func_res = lambda x: func_one(func_two(x))
    return func_res

def multiply_five(n):
    return n * 5

def add_ten(x):
    return x + 10

composition = compose(multiply_five, add_ten)
print(composition(3))
