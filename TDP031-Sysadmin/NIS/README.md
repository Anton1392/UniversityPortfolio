# NIS

## [Theory questions & answers](./NIS.md)
### [setup.txt](./setup.txt)

## Configuration

### Install packages
```bash
apt-get install nis
```
### Setup server
#### Config files
* [/etc/default/nis](./NIS/fs/server/etc/default/nis)  
* [/etc/ypserv.securenets](./NIS/fs/server/etc/ypserv.securenets)  

#### Server initialization
```bash
/usr/lib/yp/ypinit -m #press Ctrl + D
```

#### Config files
* [/etc/yp.conf](./NIS/fs/server/etc/yp.conf)  
	* Restart service `service ypbind restart` after edit

#### User creation
```bash
useradd -d /home/testuser -m testuser
passwd testuser #interactive prompt (pass: "password")
cd /var/yp #set wd (for make)
make #compile new users into NIS db
ypcat passwd #validate changes
```

### Setup client
#### Install packages
```bash
apt-get install nis
```
#### Config files
* [/etc/yp.conf](./NIS/fs/client/etc/yp.conf)  
	* Restart service `service ypbind restart` after edit  
* [/etc/nsswitch.conf](./NIS/fs/client/etc/nsswitch.conf)

#### User retrieval
```bash
ypcat passwd #validate
```
