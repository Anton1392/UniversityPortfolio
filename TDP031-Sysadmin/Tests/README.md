# Automatic test scripts over SSH
To enable automatic testing over ssh  
setup ssh-keys from router to server/client  
and from client to user@localhost  

Some DNS issues can be resolved by restarting the server service  
Some NTP issues can be resolved by letting the server stabilize  

```sh
# On router (10.0.0.1):
ssh-keygen -t rsa -b 2048
ssh-copy-id root@10.0.0.2
ssh-copy-id root@10.0.0.3

# On client (10.0.0.3):
ssh-keygen -t rsa -b 2048
ssh-copy-id root@localhost
ssh-copy-id tester1@localhost
```

## Breaking tests
### NET
```sh
ifdown ens3 # on clients
ifdown ens4 # on router
```
### DNS
```sh
service bind9 stop # on server
```
### NTP
```sh
service ntp stop # on server (may take time to re-enable)
```
### NIS
```sh
service nis stop # on server
```
### NFS
```sh
service nis stop # on server
service autofs restart # on clients
```
Comment out `/usr/local, /home1, /home2` in `/usr/local` on the server.  
Then restart both server and clients.
