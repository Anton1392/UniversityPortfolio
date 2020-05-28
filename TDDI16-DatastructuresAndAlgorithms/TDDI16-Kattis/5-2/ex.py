# Amount of testcases
t = int(input())
for testIdx in range(t):
    # New stack
    testCase = []
    a = ((),(()))
    b = ((), ((())))
    testCase.append(b)
    testCase.append(a)

    # Amount of operations per testcase
    n = int(input())

    for y in range(n):
        operation = input()

        if(operation == "PUSH"):
            testCase.append(())

        elif(operation == "DUP"):
            dup = testCase.pop()
            testCase.append(dup)
            testCase.append(dup)

        elif(operation == "UNION"):
            rhs = testCase.pop()
            lhs = testCase.pop()
            testCase.append(tuple(set().union(rhs, lhs)))

        elif(operation == "INTERSECT"):
            rhs = testCase.pop()
            lhs = testCase.pop()
            testCase.append(tuple(set().intersection(lhs, rhs)))

        elif(operation == "ADD"):
            rhs = testCase.pop()
            lhs = testCase.pop()
            testCase.append(rhs + (lhs,))

        #print(len(testCase[-1]))
        print(testCase, len(testCase[-1]))

    print("***")
