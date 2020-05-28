# TDP031 - Introduction to System Administration
Anton Sköld (antsk320)  
William Utbult (wilut499)  

## Info
Each lab folder regarding system configuration contains an *fs* (file system) folder which mirrors all the files we've edited or added and a *Tests* folder containing our automated tests (bash scripts) to validate our configurations.  
They also contain setup instructions (text files) detailing what we've done.  
As well as our answers to the theory questions in files named after the lab code.

Our *add users script* can be found at [`/SCT/add_users.sh`](./SCT/add_users.sh)  

Automatic testing [here](./Tests)  


## Index
1. [QEMU](./QEMU/QEMU.md) - Running virtual machines
2. [LXB](./LXB/LXB.md) - Linux Basics
3. [APT](./APT/APT.md) - Simple Debian Package Management
4. [SCT](./SCT/SCT.md) - Scripting and Testing
5. [NET](./NET) - Networking
6. [DNS](./DNS) - DNS Fundamentals
7. [NTP](./NTP) - Network Time
8. [NIS](./NIS) - Network Information Service
9. [STO](./STO) - Storage
10. [NFS](./NFS) - Network File Systems

## Links
* [Course page](https://www.ida.liu.se/~TDDI41/index.en.shtml)  
* [Gitlab repo](https://gitlab.ida.liu.se/anton-william/tdp031-sysadmin)

## Start QEMU Instances
```bash
/courses/TDDI41/start_single.sh
/courses/TDDI41/start_project.sh
```
