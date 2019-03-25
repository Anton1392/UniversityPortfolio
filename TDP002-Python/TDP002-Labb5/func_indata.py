def generate_list(func, num):
    return [func(x) for x in range(1, num+1)]

def mirror(x): return x
def stars(n): return '*' * n
print(generate_list(mirror, 4))
print(generate_list(stars, 5))
