# NET

## [Theory questions & answers](./NET.md)

## Info
```
(IPv4 A)
router:   10.0.0.1
server:   10.0.0.2
client-1: 10.0.0.3
client-2: 10.0.0.4
```

## Configuration
### Router
* [/etc/sysctl.conf](../NET/fs/router/etc/sysctl.conf)
  * Uncomment `net.ipv4.ip_forward=1`
* [/etc/resolv.conf](../NET/fs/router/etc/resolv.conf)  
	* Needs overwriting protection by `chattr +i /etc/resolv.conf`  
* [/etc/network/interfaces](../NET/fs/router/etc/network/interfaces)  
* [/proc/sys/net/ipv4/ip_forward](../NET/fs/router/proc/sys/net/ipv4/ip_forward)  
	* Alt: Uncomment `#net.ipv4.ip_forward=1` in `/etc/sysctl.conf` for boot persistence
* [/etc/rc.local](../NET/fs/router/etc/rc.local)  
	1. File needs to be created
	2. Needs to be executable `sudo chmod +x /etc/rc.local`
	3. Needs service enabled `sudo systemctl enable rc-local`
* [/etc/hosts](../NET/fs/router/etc/hosts)
* [/etc/hostname](../NET/fs/router/etc/hostname)  

### Server
* [/etc/resolv.conf](../NET/fs/server/etc/resolv.conf)  
* [/etc/network/interfaces](../NET/fs/server/etc/network/interfaces)  
* [/etc/hosts](../NET/fs/server/etc/hosts)  
* [/etc/hostname](../NET/fs/server/etc/hostname)  

### Client-1
* [/etc/resolv.conf](../NET/fs/client-1/etc/resolv.conf)
* [/etc/network/interfaces](../NET/fs/client-1/etc/network/interfaces)  
* [/etc/hosts](../NET/fs/client-1/etc/hosts)  
* [/etc/hostname](../NET/fs/client-1/etc/hostname)  

### Client-2
* [/etc/resolv.conf](../NET/fs/client-2/etc/resolv.conf)  
* [/etc/network/interfaces](../NET/fs/client-2/etc/network/interfaces)  
* [/etc/hosts](../NET/fs/client-2/etc/hosts)  
* [/etc/hostname](../NET/fs/client-2/etc/hostname)  

## Test scripts
* All:
  * [reachability & default route](../NET/Tests/testNET.sh)
* Router:
  * [hostname](../NET/Tests/gw/test_hostname.sh)
* Server:
  * [hostname](../NET/Tests/server/test_hostname.sh)
* Client-1:
  * [hostname](../NET/Tests/client-1/test_hostname.sh)
* Client-2:
  * [hostname](../NET/Tests/client-2/test_hostname.sh)
