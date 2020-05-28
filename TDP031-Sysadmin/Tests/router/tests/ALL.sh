#!/bin/bash
echo "- - - NET - - -"
bash /root/tests/NET/HOSTNAME.sh
bash /root/tests/NET/NET.sh

echo "- - - DNS - - -"
bash /root/tests/DNS/DNS.sh
bash /root/tests/DNS/DNS_router.sh
