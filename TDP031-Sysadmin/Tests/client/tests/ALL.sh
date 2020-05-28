#!/bin/bash

echo "- - - NET - - -"
bash /root/tests/NET/HOSTNAME.sh
bash /root/tests/NET/NET.sh

echo "- - - DNS - - -"
bash /root/tests/DNS/DNS.sh

echo "- - - NIS - - -"
bash /root/tests/NIS/NIS.sh

echo "- - - NFS - - -"
bash /root/tests/NFS/NFS_auto.sh
bash /root/tests/NFS/NFS_clients.sh
bash /root/tests/NFS/NFS_permissions.sh
