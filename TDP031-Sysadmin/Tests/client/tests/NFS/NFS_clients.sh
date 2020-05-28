#!/bin/bash

# Run this test on any client.
# Test may not echo if tests fail.

# Exportlist contains the proper folder
RES=$(showmount -e 10.0.0.2);
if [[ $RES == *"/usr/local 10.0.0.4,10.0.0.3"* ]]; then
  echo "PASS: NFS exports /usr/local properly"
else
  echo "FAIL: NFS does not export /usr/local properly"
fi

# Mounted folder has content.
RES=$(ls /mnt/usr/local);
if [[ ! -z $RES ]]; then
  echo "PASS: /mnt/usr/local has content"
else
  echo "FAIL: /mnt/usr/local does not have contenti (might need client-reboot if client started before server)"
fi
