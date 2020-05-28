### 2-1
#### a) Explain the concept of "stratum" in a clock hierarchy (e.g. NTP, but also synchronized networks and other clock hierarchies).
> Stratum is how high up in the clock hierarchy a time server is.
Stratum 0 are the first-hand sources of time, measuring it in precise ways such as atom clocks, GPS-clocks etc.
Stratum 1 clocks reference the stratum 0 clocks for their time, Stratum 2 clocks reference stratum 1 clocks, etc.

#### b) Why is it necessary to have a hierarchy of clocks rather than just a bunch of reference clocks.
> Redundancy, accuracy, and load balancing.
If we directly refer to a Stratum 0 clock, and the clock dies, we no longer have any sense of time.
If we instead refer to a hierarchy/network of clocks, and 1 out of 3 reference clocks die, we still have a sense of time.
If all NTP-servers are connected together within a hierarchy, they refer to each other and average out, making all servers agree upon what time it is.
In a hierarchical structure, the request loads are evened out. If all requests traveled to a reference clock, they may be overloaded.


### 2-2 How large a difference between the reference clock and the system clock does NTP accept and attempt to adjust.
> 1024 seconds (~17 minutes). If the time difference is larger than 17 minutes it is considered "insane" and will not be used for adjustment.

### 2-3 NTP usually works by speeding up or slowing down the clock, not setting it outright. Why.
> Some software does not handle jumping (discontinuous) time very well.
Speeding up/Slowing down the system clock in small intervals is more software-friendly.

### 3-3 Explain the output of ntpq -p.
```
remote           refid           st t when poll reach   delay   offset  jitter
==============================================================================
*gw.student.ida. 45.154.255.240   2 u   46   64    3    2.958    2.982   4.502
```
> remote - NTP peers declared in ntp.conf. * before the name means that it's used as the current time source.  
refid - The peers own synchronization source.  
st - Statum of the source.  
t - type. "u" means unicast.  
when - Seconds since the last server poll  
poll - Interval of polls in seconds.  
reach - A byte, where each bit are the past successes/failures of polls. When a poll happens, it is shifted left. If a poll succeeds, the rightmost bit becomes 1, else it becomes 0. A non-zero reach implies the server is reachable.  
delay - The round-trip-time to the peer in ms.  
offset - Time difference between us and the peer.  
jitter - The variance in latency between us and the peer.  
