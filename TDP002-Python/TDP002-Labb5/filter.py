def compose(func_one, func_two):
    func_res = lambda x: func_one(func_two(x))
    return func_res

def partial(func, value):
    return lambda x: func(value, x)

def make_filter_map(filter_func, map_func):
    # Makes a function based on map, with one of the variables being map_func
    true_map_func = partial(map, map_func)

    # Makes a function based on filter, with one of the variables being filter_func.
    true_filter_func = partial(filter, filter_func)

    # Combines the true powers of map and filter.
    combined_true_funcs = compose(true_map_func, true_filter_func)

    # Constructs the return function based on the combined functions,
    # and returns the result as a list.
    result_func = lambda lst: list(combined_true_funcs(lst) )

    # Returns the final function.
    return result_func

process = make_filter_map(lambda x: x % 2 == 1, lambda x: x * x)
print(process(range(10)))
