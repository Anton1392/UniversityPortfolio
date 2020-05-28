#!/bin/bash

echo "- - - NET - - -"
bash /root/tests/NET/HOSTNAME.sh
bash /root/tests/NET/NET.sh

echo "- - - DNS - - -"
bash /root/tests/DNS/DNS.sh

echo "- - - NTP - - -"
bash /root/tests/NTP/NTP.sh

echo "- - - NFS - - -"
bash /root/tests/NFS/NFS.sh
