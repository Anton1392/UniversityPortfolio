patterns = []

while True:
    i = input()
    if i == "END":
        break
    else:
        patterns.append(i)

count = 1
for pat in patterns:
    # Go from first black to next black counting whites:
    w_spacing = 0
    found_first = False
    for c in pat:
        if c == "*" and found_first:
            break
        elif c == "*":
            found_first = True
        
        if c == ".":
            w_spacing += 1

    even = True
    cur_spacing = 0
    for c in pat[1:]: # Ignore first black
        if c == ".":
            cur_spacing += 1
        if c == "*":
            if cur_spacing != w_spacing:
                even = False
                break
            else:
                cur_spacing = 0

    if even:
        print(str(count) + " EVEN")
    else:
        print(str(count) + " NOT EVEN")

    count += 1
