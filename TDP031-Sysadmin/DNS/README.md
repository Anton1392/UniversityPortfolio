# DNS

## [Theory questions & answers](./DNS.md)

## Configuration
### Bind9
#### Install package
```bash
apt-get install bind9 #aka "named"
```
### Config files
#### Server
* [/etc/resolv.conf](../DNS/fs/server/etc/resolv.conf)  
* [/etc/bind/named.conf.local](../DNS/fs/server/etc/bind/named.conf.local)  
* [/etc/bind/named.conf.options](../DNS/fs/server/etc/bind/named.conf.options)  
* [/etc/bind/fwd.student.ida.liu.se.db](../DNS/fs/server/etc/bind/fwd.student.ida.liu.se.db)  
* [/etc/bind/rev.0.0.10.in-addr.arpa.db](../DNS/fs/server/etc/bind/rev.0.0.10.in-addr.arpa.db)  

#### Router
* [/etc/resolv.conf](../DNS/fs/router/etc/resolv.conf)  
* [/etc/hosts](../DNS/fs/router/etc/hosts)  

#### Client-1
* [/etc/resolv.conf](../DNS/fs/client-1/etc/resolv.conf)  
* [/etc/hosts](../DNS/fs/client-1/etc/hosts)  

#### Client-2
* [/etc/resolv.conf](../DNS/fs/client-2/etc/resolv.conf)  
* [/etc/hosts](../DNS/fs/client-2/etc/hosts)
