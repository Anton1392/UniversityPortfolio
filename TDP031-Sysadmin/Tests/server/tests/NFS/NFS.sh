#!/bin/bash

# Run this test on server.
# Test may not echo if tests fail.

# Exportlist contains the proper /usr/local folder
RES=$(showmount -e 10.0.0.2);
if [[ $RES == *"/usr/local 10.0.0.4,10.0.0.3"* ]]; then
  echo "PASS: NFS exports /usr/local properly"
else
  echo "FAIL: NFS does not export /usr/local properly"
fi

# Exportlist contains the proper /home1 folder
RES=$(showmount -e 10.0.0.2);
if [[ $RES == *"/home1     10.0.0.4,10.0.0.3"* ]]; then
  echo "PASS: NFS exports /home1 properly"
else
  echo "FAIL: NFS does not export /home1 properly"
fi

# Exportlist contains the proper /home2 folder
RES=$(showmount -e 10.0.0.2);
if [[ $RES == *"/home2     10.0.0.4,10.0.0.3"* ]]; then
  echo "PASS: NFS exports /home2 properly"
else
  echo "FAIL: NFS does not export /home2 properly"
fi
