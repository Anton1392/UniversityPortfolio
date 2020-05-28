### 1-1 Read about NIS and answer the following questions.
#### a) What is a NIS map.
> A key:value mapping file containing information. Such as usernames:passwords.

#### b) What is a NIS domain? What is the NIS domain of your server and clients.
> A grouping of systems that all share the same NIS values.
(none), as we haven't yet set up NIS.

#### c) What is the name of the map that is used to look up users by name.
```
passwd.byname
```

#### d) How do users change passwords when NIS is in use? How does that work.
> Use yppasswd to change your NIS password.
yppasswd prompts you to enter your current password, and after successful entry, prompts you for the updated information.

### 1-2 Read the documentation for the commands ypcat, ypwhich and ypbind and answer the following questions.
#### a) What is ypcat used for.
> Printing all keys in a certain NIS map.

#### b) What is ypwhich used for.
> Prints which NIS server is used to provide information for the current client.

#### c) What is ypbind used for.
> Connecting to and maintaining connection to a NIS server.

#### d) What does the -k command-line option to ypcat do.
> Displays the names of the keys.

#### e) If you want to list all users on a NIS client, what command would you use.
```bash
ypcat passwd
```

#### f) If you want to see which NIS server a client is bound to, which command would you use.
```bash
ypwhich
```

#### g) If you want to see the NIS domain of a client, what command would you use.
```bash
domainname
```

### 2-1 Why use a directory service? Name one alternative to a directory service.
> To maintain consistent information across an entire network.
Active Directory is one directory service alternative.

### 2-2 Name at least two common directory services other than NIS.
> DNS
NIS+

### 5-1 What is the difference between using "compat" and using "files nis" as the list of sources for e.g. passwords in the name service switch.
> compat is compatibility mode. It supports the old style syntax of configuring NSS

### 5-2 Configure the name service switch on your clients so they use NIS for as much as possible. Note that you should still use local files as the first information source. Please do not use compat unless you intend to use the special features it provides.
> passwd, shadow, group, and gshadow are now all "files nis". We can log in as the NIS-only user "testuser" successfully on our clients.

### 5-3 Why should you use local files as the first information source instead of NIS.
> If the NIS server is down it can take a long time to get the timeout-response.
If NIS is before files, the system always checks NIS even if the user is trying to log onto a local account. This can take long.
If NIS is before files, a username could be found in the NIS server, effectively overwriting the local user. Worst case scenario: root.
