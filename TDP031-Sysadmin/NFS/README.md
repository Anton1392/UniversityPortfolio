# NFS

## [Theory questions & answers](./NFS.md)
### [setup.txt](./setup.txt)

## Configuration

### Server
#### Install packages
```bash
apt-get install nfs-kernel-server
```
#### Config files
* [/etc/exports](./NFS/fs/server/etc/exports)  
	* `exportfs -a`
	* `systemctl restart nfs-kernel-server`
* [/etc/auto.master](./NFS/fs/server/etc/auto.master)
* [/etc/auto.home](./NFS/fs/server/etc/auto.home)
### Map config files to nis
```bash
cd /var/yp
make auto.master
make auto.home
cp auto.master student.ida.liu.se/auto.master
cp auto.home student.ida.liu.se/auto.home
service nis restart
```

### Client
#### Install packages
```bash
apt-get install autofs
```
#### Config files
* [/etc/nsswitch.conf](./NFS/fs/client/etc/nsswitch.conf)  
