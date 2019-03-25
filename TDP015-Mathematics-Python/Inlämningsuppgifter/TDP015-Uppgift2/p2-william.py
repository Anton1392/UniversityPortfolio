# TDP015 Programming Assignment 3

# Do not use any imports!

# In this assignment you are asked to implement functions on *nested
# pairs*. The set of nested pairs is defined recursively:
#
# 1. The empty tuple () forms a nested pair.
#
# 2. If a and b are nested pairs, then the tuple (a, b) forms a nested
#    pair.
#
# Here are some examples of nested pairs sorted by their *degree*. The
# degree of a nested pair is the number of empty tuples contained in it.
#
# degree 1 (1 pair):
#
# ()
#
# degree 2 (1 pair):
#
# ((), ())
#
# degree 3 (2 pairs):
#
# ((), ((), ()))
# (((), ()), ())
#
# degree 4 (5 pairs):
#
# ((), ((), ((), ())))
# ((), (((), ()), ()))
# (((), ()), ((), ()))
# (((), ((), ())), ())
# ((((), ()), ()), ())
#
# ((), ((), ((), ())))
# ((), (((), ()), ()))
# (((), ()), ((), ()))
# (((), ((), ())), ())
# ((((), ()), ()), ())
#
# The following sequence gives the number of nested pairs with degrees
# 1, 2, 3, ...:
#
# 1, 1, 2, 5, 14, 42, 132, 429, 1430, 4862, 16796, 58786, 208012, 742900,
# 2674440, 9694845, 35357670, 129644790, 477638700, 1767263190, ...

# ## Problem 1
#
# Implement a function nested_pairs() that yields all nested pairs
# with a specified degree. Each nested pair should be yielded exactly
# once. For example, nested_pairs(4) should yield the 5 nested pairs
# listed above. Use recursion. Test your function by counting the
# number of nested pairs yielded by it and comparing against the
# sequence of numbers given above.

def nested_pairs(n):
    """Yield all nested pairs with degree *n*."""
    if n == 1:
        yield ()
    else:
        for i in range(1, n):
            for right in nested_pairs(n-i):
                for left in nested_pairs(i):
                    yield(left, right)

# ## Problem 2
#
# Implement a function count_nested_pairs() that counts the number of
# nested pairs with a specified degree. A naive implementation of this
# function would call the nested_pairs() function from Problem 1. This
# is not what you are supposed to do! Instead, try to come up with a
# solution that counts the number of nested pairs without generating
# them. There is a way to solve this problem using a formula; but your
# solution should use recursion. Test your implementation by comparing
# your numbers to the numbers that you got above. What is the maximal
# degree for which you can compute the number of nested pairs in under
# one minute?

def count_nested_pairs(n):
    """Count the number of nested pairs with degree *n*."""
    if n == 1:
        return 1
    else:
        result = 0
        for i in range(1, n):
            right = count_nested_pairs(n-i)
            left = count_nested_pairs(i)
            for _ in range(0, right):
                for _ in range(0, left):
                    result += 1
        return result

# ## Problem 3
#
# Because it uses recursion, the function that you implemented in
# Problem 2 will call itself many times, and many times with the same
# argument. One way to speed things up is to cache the results of
# these calls. This strategy is called *memoization*.
#
# The idea is the following: All recursive calls of the function get
# access to a common cache in the form of a dictionary. Before a
# recursive call computes the number of nested pairs of a given degree
# *n*, it first checks whether that number is already stored in the
# cache. If yes, then the recursive call simply returns that
# value. Only if the value has not already been cached, the recursive
# call starts a computation on its own; but then it stores the result
# of that computation in the common cache, under the key *n*, so that
# subsequent calls will not have to recompute it.
#
# Write a function count_nested_pairs_memoized() that implements this
# idea. Test your implementation as above. How long does it take you to
# compute the number of nested pairs for the maximal degree that you
# could do in under one minute in Problem 2?
memo = {}
def count_nested_pairs_memoized(n):
    if n == 1:
        return 1
    else:
        if n in memo:
            return memo[n]
        else:
            result = 0
            for i in range(1, n):
                right = count_nested_pairs_memoized(n-i)
                left = count_nested_pairs_memoized(i)
                for _ in range(0, right):
                    for _ in range(0, left):
                        result += 1
            memo[n] = result
            return result

# -----------------------------------------------------------------------------
import time # For timing purposes, please do not fail us because of this import :)
def test(n, generate):
    print("Nested pairs degree #" + str(n) + "\n")

    #Generate pairs
    if generate:
        for pair in nested_pairs(n): print(pair)

    #Combo amount
    start_time = time.clock()
    print("\nCombinations: " + str(count_nested_pairs(n)))
    comb_time = time.clock() - start_time
    print("Time: " + str(comb_time))

    #Combo amount (memoized)
    start_time = time.clock()
    print("\nMemoized com: " + str(count_nested_pairs_memoized(n)))
    memo_time = time.clock() - start_time
    print("Time: " + str(memo_time))

    #Info (Somewhat stable time saving starts at: n = 6)
    print("\nMemoization saved %" + str((1-(memo_time/comb_time))*100) + " execution time")

test(14, False)
