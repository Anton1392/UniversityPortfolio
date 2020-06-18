
### 1-1 Read the documentation for apt-get and answer the following questions.
#### a) Which apt-get sub-command is used to install new packages.

> `install`

#### b) Which apt-get sub-command is used to remove packages.
> `remove`

#### c) What does apt-get update do.
> Updates the local index for available packages.

#### d) What does apt-get dist-upgrade do.
> Installs all newest versions of packages you own, and also handles dependencies in a "smart" way.

### 1-2 Read the documentation for dpkg and answer the following questions.
#### a) What does dpkg --get-selections do.
> Lists all packages on your system and their status.

#### b) What does dpkg --purge vim do.
> Purges an installed package, removing all related files.

#### c) What does dpkg -L bind9 do.
> Lists all files on your system related to the bind9 package.

### 2-1 Configure APT to use the following binary APT sources.
#### a) http://ftp.se.debian.org/debian (distribution jessie)
#### b) http://security.debian.org/ (distribution jessie/updates)
> Added this to /etc/apt/sources.list:  
`deb http://ftp.se.debian.org/debian buster main`  
`deb http://security.debian.org/ buster main`  
Then ran `apt-get update`  

### 4-1 Remove the hping package.
```bash
apt-get remove hping3
```

### 6-1 What command in aptitude will cause the package list to contain only those packages whose names contain a specific word.
> `l`

### 6-2 What command in aptitude lets you search the package list without hiding anything.
> `/`

### 6-3 What command marks a package for installation? For deletion.
> `+` for installation, `-` for deletion

### 6-4 What command causes all selected actions (installation, deletion, and upgrades) to take place.
> `g`

### 6-5 If there is a B in the leftmost column, what does that mean.
> That the package is broken.