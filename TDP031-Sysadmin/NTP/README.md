# NTP

## [Theory questions & answers](./NTP.md)
### [setupClients.txt](./setupClients.txt)
### [setupRouter.txt](./setupRouter.txt)

## Configuration
### Install packages
```bash
apt-get install ntp #includes: ntpd (daemon) ntpq (query)
apt-get install ntpstat #for testing
apt-get install ntpdate #for testing
```
### Config files
#### Router
* [/etc/ntp.conf](../NTP/fs/router/etc/ntp.conf)  

#### Server
* [/etc/ntp.conf](../NTP/fs/server/etc/ntp.conf)  
	* disable previous service `timedatectl set-ntp off`  

#### Client-1
* [/etc/ntp.conf](../NTP/fs/client-1/etc/ntp.conf)  
	* disable previous service `timedatectl set-ntp off`  

#### Client-2
* [/etc/ntp.conf](../NTP/fs/client-2/etc/ntp.conf)  
	* disable previous service `timedatectl set-ntp off`
