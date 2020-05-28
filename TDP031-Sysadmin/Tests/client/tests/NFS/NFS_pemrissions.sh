#!/bin/bash

# Try accessing tester1 as root (should not work)
# echo "root:password" # uses ssh key
if ssh root@localhost 'cd /home/tester1; touch test_file; rm test_file' >/dev/null 2>&1; then
	echo "FAIL: root has incorrect permissions for /home/tester1"
else
	echo "PASS: root lacks permissions for /home/tester1"
fi

# echo "tester1:password" # uses ssh key
# Try accessing tester1 as tester1 (should work)
if ssh tester1@localhost 'cd /home/tester1; touch test_file; rm test_file' >/dev/null; then
	echo "PASS: tester1 has permissions for /home/tester1"
else
	echo "FAIL: tester1 incorrectly lacks permissions for /home/tester1"
fi
