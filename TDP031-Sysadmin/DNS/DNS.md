### 1-2 Answer the following questions (the information can be found in e.g. the RFCs that describe DNS).
#### a) What is an authoritative name server? What is its role in DNS.
> An authoritative name server is a name server responsible for a certain DNS zone. It does not return answers that are outsize its authoritative zone.

#### b) What is the difference between a domain and a zone.
> A zone is part of a domain.
Domain "example.com" may contain information about example.com, mysite.example.com, a.example.com, b.example.com.
Zone "example.com" only contains information about example.com, and references to the name servers of the subdomains.

#### c) What is the difference between a recursive and a non-recursive query in DNS? When is each type of query used.
> With recursive queries, the name server handles all the work of finding the result.
You query a name. The DNS server doesn't know it. The DNS server queries other DNS servers to eventually find the name. Then the result is returned to you.
With non-recursive (iterative) queries, the name server does not do all of the work.
You query a name. The DNS server doesn't know it. The DNS server returns to you a list of other DNS servers who may know the name. You then query those servers to find the result.

#### d) What is the purpose of delegation in DNS.
> To distribute the workload across multiple name servers, and to get faster response times for local domains.

#### e) What is a resource record? What does a resource record consist of.
> It is a piece of information stored within a name server.
It consists of the record type, and depending on the type different information is stored.
A (Address) record example: router.example.com  A  10.0.0.1

#### f) DNS messages contain answer, authority and additional sections. What is the purpose of each section.
> Answer: The section containing the answer from the name server. (list of resource records)
Authority: Contains resource records referring to authoritative name servers who may be able to serve you responses (worst case Root).
Additional: Extra fields the client may find useful. Such as the A-records for the corresponding Authority records in the Authority-field.

#### g) How does the DNS protocol indicate if an answer comes from an authoritative name server or not? How does the DNS protocol indicate whether a query is recursive or not.
> The AA (authoritative answer) bit in the Control field is set to 1.
The RD and RA (recursive desired / available) bits in the Control field are set to 1.

#### h) Explain what glue records are and when they are necessary.
> They are manually entered records that reference name servers.
They are needed when a name server is responsible for the domain that it is in. To see it from outside its domain, you need to manually enter a reference to it in a Top-level domain.

### 1-3
#### a) Which zone in DNS contains PTR records corresponding to IP addresses in the network 10.131.24.64/27?
```
64.24.131.10.in-addr.arpa
```
#### b) Name some other networks that have PTR records in the same zone.
```
10.131.24.80/28
10.131.24.88/29
```
#### c) What is the problem with delegating authority over the DNS records corresponding only to 10.131.24.64/27.
> A zone can only be reverse-delegated once, so if we have multiple subnets in our zone, we run into reverse-lookup issues where only one subnet may have a reverse-dns server.

#### 1-4 Explain the purpose of classless in-addr.arpa delegation. Explain how it works.
> To delegate reverse-DNS lookups on subnets which IP ranges do not cover entire octets (/8, /16, /24).  
We have two nameservers, the higher level delegating one, and the local authoritative nameserver.  
Our local servers forward (not reverse) zone file looks like a regular zone file, no changes there.  
In the reverse zone file we name the zone differently, such as:
zone "`64/27.0.168.192.in-addr.arpa.`".    
We also specify it as a slave server, and reference the delegating nameserver as a master to it.  
>
> On the higher-level nameserver, the provider now needs to make some changes.  
In the class C zone file named "`0.168.192.rev` we add CNAME records pointing to each machine in the delegated subnet. If we have two machines in the subnet, it looks somewhat like:
`94  CNAME  94.64/27.0.168.192.in-addr.arpa.`  
`65  CNAME  65.64/27.0.168.192.in-addr.arpa.`  
And we point out the nameservers (the local nameservers) responsible for that delegation, using the `64/27 CNAME` to glue everything together.  
`64/27 NS  localnameserver.example.com.`  
>
> When someone looks up the name of local machine `192.168.0.94`, the CNAME transforms the request into `94.64/27.0.168.192.in-addr.arpa.`  
This request goes to the nameserver "`64/27`", our local nameserver, and asks it for machine `192.168.0.94`. Our local nameserver then returns the name of the machine, and all is good.  

### 2-1 Use the host tool to answer the following questions.
#### a) What is the address of informatix.ida.liu.se.
```
130.236.180.77
```
#### b) What is the address of www.ida.liu.se.
```
130.236.180.77
```
#### c) What is the address of liu.se.
```
130.236.5.66
```

### 2-2 Compare the output of host www.ida.liu.se ns3.liu.se and host www.ida.liu.se dns.liu.se and answer the following questions.
#### a) Why is there no answer in the first query but in the second query.
> The first server is not recursive, and hence did not bother finding our answer. (checked with dig)
The second server is recursive, and hence found our answer for us.

#### b) Both answers are correct, even though they differ. Explain why.
> The first server expects us to make additional queries to other name servers to find our result. (Non-recursive)
The second server makes the additional queries itself until it finds an answer, and then returns it to us.

### 3-1 Use host to find out which name servers are authoritative for the zone adlibris.se. Which organization(s) operate them.
```bash
host -t NS adlibris.se
dns02.ports.se
dns04.ports.net
dns03.ports.se
dns01.dipcon.com
```
> All name servers are operated by Ports Group.

### 3-2 Use host to list all records in the ida.liu.se zone and wc to count them. How many records are there? If this is temporarily unavailable (181017), go on through the tasks.
```bash
host -a ida.liu.se
ida.liu.se.		73817	IN	AAAA  2001:6b0:17:f032::80
ida.liu.se.		496	  IN	MX	10 e-mailfilter04.sunet.se.
ida.liu.se.		496	  IN	MX	10 v-mailfilter03.sunet.se.
ida.liu.se.		496	  IN	MX	10 e-mailfilter03.sunet.se.
ida.liu.se.		64430	IN	A	 130.236.180.77
ida.liu.se.		5920 	IN	NS	ns1.liu.se.
ida.liu.se.		5920 	IN	NS	ns2.liu.se.
ida.liu.se.		5920 	IN	NS	ns.ida.liu.se.
```
> There are 8 records.


### 3-3 Use host to find out all information you can about the name ida.liu.se (i.e. the name itself, not the contents of the zone). What did you find out? How can you be sure that is all the information that is available.
```bash
host -a ida.liu.se
```
> `ida.liu.se` contains three mail servers, its IPv4 is `130.236.180.77` and IPv6 is `2001:6b0:17:f032::80`.  
It also contains three name servers.  
There is no other information as we asked for all possible fields, and that the Authority field is empty. I.e. there's no one else to ask for more information regarding ida.liu.se.  

### 4-1 Use dig to answer the following questions. If the tests below fail, do this for www.ida.liu.se.
#### a) What is the address of www.ida.liu.se.
```bash
dig www.ida.liu.se
130.236.180.77
```

#### b) Which nameservers have authoritative information for www.ida.liu.se.
```bash
dig -t NS www.ida.liu.se
ns.ida.liu.se
ns2.liu.se
ns1.liu.se
```

#### c) Which name corresponds to the IPv4 address 130.236.180.77.
```bash
dig -x 130.236.180.77
informatix.ida.liu.se
```

### 4-2 Use the trace feature of dig to answer the following questions.
#### a) What nameservers are consulted in a query for the A record of www.ida.liu.se.
```bash
dig +trace www.ida.liu.se
130.236.1.9
d.root-servers.net
f.ns.se
ns3.liu.se
ns1.liu.se
```

#### b) What nameservers are consulted when determining the address of update.microsoft.com? Note that the presence of a CNAME record makes this question different from the previous one: you will need to run dig more than once to get the answer.
```bash
dig +trace update.microsoft.com
130.236.1.9
f.root-servers.net
k.gtld-servers.net # Returns a CNAME record, which we now trace instead.

dig +trace update.microsoft.com.nsatc.net
130.236.1.9
g.root-servers.net
j.gtld-servers.net
usa-b.prod1.footprint.net # Returns two A-records to our destination.
```
