### 2-2 Does the program support multiple sessions (e.g. tabs)? If so, how do you create new sessions? How do you delete them.
> File -> Open tab, or `Ctrl+Shift+T`  
Press X on the tab, or `Ctrl+Shift+W`  

### 2-3 What character encoding does the terminal expect (common ones are UTF-8 and ISO-8859-1, also known as latin-1).
> `en_US.UTF-8` (by running `echo $LANG`)

### 3-1 Answer the following questions concerning sections of the Unix Manual. Most of the information you need can be found in the man page for the man command (you will need to think a little too).
#### a) Which are the nine sections of the Unix manual.
> user commands, system calls, library functions, special files, file systems, games, miscellaneous, administration, kernel routines

#### b) Which section of the manual contains user commands such as cat and ls.
> section 1

#### c) Which section documents file formats, such as configuration files.
> section 5

#### d) Which section contains system administration commands, such as halt.
> section 8


### 4-1 The SYNOPSIS section briefly lists how a command is invoked. Read the man page for man and explain what the following command synopsis texts mean. Explain how each command may or must be invoked; you don't need to know what the commands actually do.
> [optional]  
repeatable...  
either | or  

#### a) mkpasswd PASSWORD SALT
> Should be "mkpasswd [args] [user]"?  
Generates a password, can also apply it to a [user] (optional). Accepts [args] for options (optional).

#### b) uniq [OPTION]... [INPUT [OUTPUT]]
> Accepts INPUT text (optional), processes it, outputs it to the OUTPUT (optional but requires input). OPTION flags can be added (optional and repeatable).

#### c) gzip [-acdfhlLnNrtvV19 ] [-S suffix] [ name ... ]
> Accepts any of the option flags "acdfhlLnNrtvV19" (optional). -S replaces the resulting file extension with .suf rather than .gz. (optional) name is the file(s) to be compressed (optional and repeatable).

#### d) chcon [OPTION]... CONTEXT FILE...
> Changes FILEs (required and repeatable) security context to CONTEXT. Can also accept [OPTION]s (optional and repeatable).  
chcon [OPTION]... [-u USER] [-r ROLE] FILE...  
Changes FILEs (required & repeatable) security context based on a USER (optional) and a ROLE (optional). Can also accept [OPTION]s (optional and repeatable)  
chcon [OPTION]... --reference=RFILE FILE...  
Changes FILEs security context based on RFILE (reference file)s (required and repeatable) security context. Can also accept [OPTION]s (optional and repeatable).  

### 4-2 Read the man page for man, as well as some other man pages (e.g. for ls, uniq, chmod, and adduser) and answer the following questions.
#### a) What do you usually find in the DESCRIPTION section.
> A general overview of the command and often option flags.

#### b) Which section(s) usually document, in detail, what each command-line option does.
> OPTIONS and sometimes DESCRIPTION

#### c) Let's say you're reading the man page for a command and the information you are looking for isn't there. In which part can you find references to other man pages that might contain what you are looking for (have a look at the man page for reboot, imagining that you are trying to find a command that will turn the computer off, for an example).
> SEE ALSO section

#### d) In which section do you find information about which configuration files a program uses?
> FILES section

### 4-3 Use the man page for man to answer the following questions.
#### a) Sometimes there are several man pages (located in different sections) for the same keyword. Which command-line option to man can you use to display all of them.
> `-f KEYWORD`

#### b) Sometimes you don't know the name of a command you are looking for, but can guess at a keyword related to the command. Which command-line option can you use to have man list all pages related to a specific keyword.
> `-k KEYWORD`

### 4-4 Display the man page for the ls command.
#### a) What does the ls command do.
> Lists information about the files in a directory (current directory is default).

#### b) What option to ls shows information about file sizes, owner, group, permissions and so forth.
> `-l`

#### c) What does the -R option to ls do? (Don't forget to try it.)
> It lists all subdirectories recursively.

### 5-1 In the example above name at least one relative path name indicating ssh if
#### a) The current working directory is /usr/bin.
> `./ssh`

#### b) The current working directory is /usr/local/bin.
> `../../bin/ssh`

### 6-1 It is possible to set individual permissions for user, group and others using chmod. Review the documentation and answer the following questions.
#### a) How can you set the permission string to user read/write, group read, others read using chmod in long format.
```bash
chmod u=rw,g=r,o=r FILE
```

#### b) How can you revoke group write permissions on a file without changing any other permissions.
```bash
chmod g-w FILE
```

#### c) How can you grant user and group execute permissions without changing any other permissions.
```bash
chmod u+x,g+x FILE
```

### 7-1 What do the following numeric file modes represent.
#### a) 666
> Everyone can read and write.

#### b) 770
> User and group have full permissions. Others have no permissions.

#### c) 640
> User can read and write, group can read, others can do nothing.

#### d) 444
> Everyone can read.

### 7-2 What command-line argument to chmod allows you to alter the permissions of an entire directory tree.
> `-R`

### 7-3 What does execute (x) permission mean on directories.
> The directory can be entered.

### 7-4 A user wants to set the permissions of a directory tree rooted in dir so that the user and group can list, read and write (but not execute) files, but nobody else has any access. Which of the following commands is most appropriate? Why.
#### a) chmod -R 660 dir
> Most appropriate. Recursively sets permissions to the proper ones.

#### b) chmod -R 770 dir
> The permissions are wrong. Here, user and group get execute permissions where they should not have it.

#### c) chmod -R u+rw,g+rw,o-rwx dir
> The permissions here are only added and subtracted, not set. If the user or group had execute privileges beforehand they can still execute after the command.  
Replacing the "+" and "-" with "=" would work, but is still wordy compared to option a).  


### 8-1 How can you change the owner and group of an entire directory tree (a directory, its subdirectories and all the files they contain) with a single command.
```bash
chown -R OWNER:GROUP dir
```

### 9-1 What does cd .. do.
> Goes up one directory

### 9-2 What does cd ../.. do.
> Goes up two directories

### 9-3 What information about a file is shown by ls -laF?
> Permissions, number of links, owner, group, file size, latest modification time, file name and file type.

### 9-4 In the following output from {insert output here} explain the following
#### a) What does the "c" at the beginning of the second line mean.
> The file is a "character special file", meaning that it is a serial buffer for some device.

#### b) What do "dave" and "staff" mean on the first line, and "root" and "audio" on the second.
> The owner and group the file belongs to.

#### c) Which users may write to the file dsp.
> Root (owner) and members of the audio group.

### 9-5 If you have two files, a and b, and you issue the command mv a b, what happens? Is there an option to mv that will issue a warning in this situation.
> a is renamed to b, and the original b is deleted. The "-i" flag prompts a warning if something is to be overwritten.

### 9-6 What option(s) to cp allows you to copy the contents of /dir1 to /dir2, preserving modification times, ownership and permissions of all files.
> `-p`, `-a`

### 9-7 How do you make the file secret readable and writable by root, readable by the group wheel and completely inaccessible to everybody else.
```bash
chown root:wheel secret
chmod 640 secret
```

### 10-2 What init files does your shell use, and when are they used? (Hint: your shell has a man page, and somewhere near the end there is a section that lists which files it uses).
```
/etc/profile
/etc/bash.bashrc
~/.bash_profile
~/.bashrc
~/.inputrc
```

### 11-1 Use the env command to display all environment variables. What is PATH set to (you might want to use grep to find it)? What is this variable used for (the man pages for your shell might be helpful in answering this question).
```bash
PATH=/courses/TDIU16/lab/bin:/bin:/usr/bin:/opt/thinlinc/bin:/usr/local/bin:/usr/bin/X11:/sbin:/usr/sbin:/usr/local/sbin:/snap/bin:/opt/puppetlabs/bin
```

### 11-2 Use echo to display the value of HOME. What does the HOME variable normally contain.
> `/home/antsk320`  
The home folder of the current user

### 11-3 Prepend /sbin/:/courses/TDDI41/bin to the variable PATH. The easiest way to accomplish this is to use variable expansion in the right-hand side of the assignment.
```bash
PATH=/sbin/:/courses/TDDI41/bin:$PATH
```

### 12-1 Where will stdout and stderr be redirected in the following examples? If you want to test your theories, use /courses/TDDI41/bin/stdio for command. This program outputs a series of E:s to stderr (file descriptor 2) and a series of O:s to stdout (file descriptor 1).
#### a) command >file1
> stdout redirects to file1

#### b) command 2>&1 >file1
> stderr redirects to current stdout which redirects to file1.

#### c) command >file1 2>&1
> stdout directs to file1. Stderr redirects to stdout, which in turn points to file1.

### 13-1 What do the following commands do? If you want to test your theories, use /courses/TDDI41/bin/stdio for command and grep for "E" rather than "fail".
#### a) ls | grep -i doc
> Pipes a list of files to grep, and finds lines containing "doc" while ignoring case.

#### b) command 2>&1 | grep -i fail
> Pipes stdout to grep, redirects stderr to stdout (to grep). grep then finds lines containing "fail" while ignoring case.

#### c) command 2>&1 >/dev/null | grep -i fail
> Redirects stdout to null. Stderr to redirect into grep, which then finds lines containing "fail" while ignoring case.

### 13-2 Write command lines to perform the following tasks.
#### a) Output a recursive listing (using ls) of your home directory, including invisible files, to the file /tmp/HOMEFILES.
```bash
ls ~ -Ra > /tmp/HOMEFILES
```

#### b) Find any files (using find) on the system that are world-writable (i.e. the write permission for "others" is set). Error messages should be discarded (redirected to /dev/null). This command is actually useful for auditing the security of a system - world-writable files can be security risks.
```bash
find / -perm -o+w 2>/dev/null
```

### 14-1 Create a long running process by typing ping 127.0.0.1. Suspend it with vZ and bring it to the foreground with fg. Terminate it with vC.
> ok

### 14-2 Create a long running process in the background by typing ping 127.0.0.1 >/dev/null&. Find out its process id using ps and kill it using kill.
```bash
ping 127.0.0.1 >/dev/null&
ps aux | grep "ping 127.0.0.1"
kill 67962
```

### 14-3 What does the command kill -9 pid do, where pid is the number of a process? What does kill -9 -1 do? Read the documentation to figure the last one out as it is a somewhat dangerous command.
> Sends the SIGKILL signal to a process with process number pid. -1 as pid kills all processes except itself and init.

### 14-4 Create a long running process in the background by typing ping 127.0.0.1 >/dev/null&. Kill it using pkill. The pkill command is very useful when you need to kill several processes that share some attribute (such as a command name).
```bash
ping 127.0.0.1 >/dev/null&
pkill ping
```

### 16-1 What keystroke in less moves to the beginning of the file.
> `g`
### 16-2 What keystroke in less moves to the end of the file.
> `G`
### 16-3 What would you type in less to start searching for "option".
> `/option`
### 16-4 What would you type in less to move to the next match for "option".
> `n`

### 16-5 Locate the package documentation for the ssh package and answer the following questions by reading the README.Debian.gz file (hint: remembering the answers to these questions may be useful in the project).
#### a) What is the default setting for ForwardX11.
> info ssh_config  
"no"

#### b) If you want X11 forwarding to work, what other package(s) need to be installed on the server.
> `xauth`

### 18-1 What does tail -f /var/log/syslog do.
> It outputs the last part of syslog, and also outputs more of the file as it grows "live".

### 18-2 If you want to extract the last ten lines in /var/log/syslog that are related to the service cron, what command would you use? (Hint: the grep command can search for matching lines in a file).
```bash
grep cron /var/log/syslog | tail
```

### 19-1 What services are started when your system boots into run level 2 (i.e. not only services exclusive to run level 2, but all services started as the computer boots into run level 2).
```bash
ls /etc/rc2.d/ /etc/rc1.d/
K01rsyslog
S01console-setup.sh  S01cron  S01dbus  S01rsyslog  S01ssh
```

### 19-2 If you wanted to restart the ssh process, what command would you use.
```bash
/etc/init.d/ssh restart
```
