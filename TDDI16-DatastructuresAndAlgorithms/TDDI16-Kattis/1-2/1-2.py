# From zero to n
def zeroAmount(n):
    amount = 0

    n = str(n)
    for i in range(1, len(n)):
        left = "".join(n[0:i])
        right = 10 ** (len(n) - i - 1)


        print("---------------")
        print("left: " + left)
        print("right: " + str(right))
        amount += int(left) * int(right)

    return amount

def countZeros(n):
    result = 0
    i = 1

    while True:
        b, c = divmod(n, i)
        a, b = divmod(b, 10)

        if a == 0:
            return result

        if b == 0:
            result += (a - 1) * i + c + 1
        else:
            result += a * i

        i *= 10

'''
def zeroInInteger(n):
    count = 0
    while n != 0:
        count += (n%10  == 0)
        n /= 10

    return count

# From 1 to n, total count of zeroes
def zeroAmount(n):
    # If n is single digit
    if(n == 0):
        return 0
    elif(n < 10):
        return 1

    # If n doesn't end in a nine, do recursion.
    if(n % 10 != 9):
        return zeroInInteger(n) + zeroAmount(n-1)

    # If 9 ends in a nine, you can put 0 -> N into 10 equal groups.
    # Each group has a different ending digit.
    # Each group contributes zeroAmount(N/10)
    # The zero group contributes an additional N/10
    return 10 * zeroAmount(n/10) + ((n)/10)
    '''

inputs = []

while True:
    line = input()
    line = line.split(" ")
    n = int(line[0])
    m = int(line[1])
    if(n < 0 or m < 0):
        break
    inputs.append((n, m))

for pair in inputs:
    n = pair[0]
    m = pair[1]

    amount = countZeros(m)-countZeros(n)
    print(amount)
