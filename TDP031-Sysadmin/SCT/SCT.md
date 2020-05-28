## [Add users script](./add_users.sh)

### 1-1 What is the difference between using $* and $@ to access all parameters to a script or function? Hint: it has to do with how spaces in parameters are handled when $* or $@ are placed within (double) quotation marks (as in the for loop example, below).
> "$@" expands into a list of all arguments, and works properly even if the arguments contain spaces.  
"$\* expands into a list of all arguments, but it doesn't handle spaces well.  
myProgram file1.txt file2.txt  
"$@" translates the above to myProgram "file1.txt" "file2.txt"  
"$\*" translates the above to myProgram "file1.txt file2.txt", which is wrong.  
$@ works properly in all argument cases, whereas $\* can fail.  

### 2-1 Why is $@ quoted (inside quotation marks) in the for loop.
> So it can handle file names containing spaces. Having quotes will put each argument in quotes, which make spaces a non-issue.

### 2-2 Could $* have been used instead of $@? Explain your answer. Hint: if you got exercise 3-1 right, this one should be easy to answer.
> I assume this refers to the quoted $@ from 2-1.  
Only if you only pass one file at a time. Otherwise it would interpret "myProgram file1.txt file2.txt" as "myProgram "file1.txt file2.txt"", which is incorrect.  

### 3-1 How do while loops work.
> They perform the listed commands over and over as long as the while-expression evaluates to true.  
This script prints the numbers 1 to 5. It loops as long as count is less than (-lt) 5.  

```bash
#!/bin/bash
let count=0
while [ $count -lt 5 ] ; do
let count=$count+1
echo $count
done
```

### 5-1 What does ${line:0:1} do? Note that it is a form of parameter expansion.
> It splices a string by index. First integer is inclusive, second is exclusive.

### 5-2 What does a colon on a single line do (the true branch of the if statement in the example).
> Colon evaluates to a boolean true-value. On a single line it does nothing, and thus works as a "do nothing" statement. (no-op)

### 5-3 Bash has an alternate syntax for command substitution (backticks). What is it.
> `$(command)`

### 5-4 What does $((...))do? What is this called in the bash man page.
> Arithmetic expansion. It allows for an easy way of computing arithmetics and assigning it to variables.

### 5-5 How could you count the number of dotfiles using a single pipeline (no loops or variables, just simple commands). You may want to read about commands like grep and wc.
```bash
find / -name ".\*" | wc -l
```

### 6-1 Look at the first two lines of the script (after the initial "#!" line).
#### a) What does the backslash at the end of the first of these mean.
> It escapes the following newline, effectively adding the line with the line below.

#### b) What do the braces around echo and exit mean? What would happen if you used parenthesis instead of braces.
> It groups the echo and exit commands, making them run as a unit. If you used parenthesis it would work similarly, but start them in a subshell instead.

### 6-2 What does the local command do at the beginning of smtp_send.
> It makes the mailserver variable local to the block of code that it's in (the smtp_send function).

### 6-3 Why call sleep 1 in the script.
> To make sure we wait 1 second between each input to socat as it's constantly/realtime getting the echoed line.
