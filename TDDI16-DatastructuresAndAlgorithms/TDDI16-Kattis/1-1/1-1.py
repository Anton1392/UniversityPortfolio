import sys

n = int(input())

# Make into arrays
before = list(input())
after = list(input())

# Flips n amount of times
for x in range(n):
    for i in range(0, len(before)):
        if(before[i] == '1'):
            before[i] = '0'
        elif(before[i] == '0'):
            before[i] = '1'

# Make into string
before = "".join(before)
after = "".join(after)

# Compare
if(before == after):
    print("Deletion succeeded")
else:
    print("Deletion failed")

