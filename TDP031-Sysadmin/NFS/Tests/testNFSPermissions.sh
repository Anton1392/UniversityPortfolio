#!/bin/bash

# How to break: service nis stop on server, service autofs restart on clients

# Try accessing tester1 as root (should not work)
echo "root:password"
if ssh root@localhost 'cd /home/tester1; touch test_file; rm test_file'; then
        echo "FAIL: root has incorrect permissions for /home/tester1"
else
        echo "PASS: root lacks permissions for /home/tester1"
fi

echo "tester2:password"
# Try accessing tester1 as tester1 (should work)
if ssh tester2@localhost 'cd /home/tester2; touch test_file; rm test_file'; then
        echo "PASS: tester2 has permissions for /home/tester2"
else
        echo "FAIL: tester2 incorrectly lacks permissions for /home/tester2"
fi
