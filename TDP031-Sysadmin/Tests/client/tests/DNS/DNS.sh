#!/bin/bash

# Test authoratitive answer
if [ "$(dig +norecurse +short @10.0.0.2 gw.student.ida.liu.se)" == "10.0.0.1" ]; then
  echo "PASS: Authoratitive answer on non-recursive"
else
  echo "FAIL: No authoratitive answer on non-recursive"
fi

# Test recursive answer from local hosts
if dig +short @10.0.0.2 google.com >/dev/null; then
  echo "PASS: Recursive answer from local hosts"
else
  echo "FAIL: No recursive answer from local hosts"
fi

# Test reverse zone requests from local hosts.
if [ "$(dig +norecurse +short @10.0.0.2 -x 10.0.0.4)" == "client-2.student.ida.liu.se." ]; then
  echo "PASS: Reverse lookup from local hosts"
else
  echo "FAIL: No reverse lookup from local hosts"
fi

# Test ping local machine
if ping -q -c 1 -W 1 client-2.student.ida.liu.se >/dev/null; then
  echo "PASS: Can ping using a name"
else
  echo "FAIL: Can not ping using a name"
fi
