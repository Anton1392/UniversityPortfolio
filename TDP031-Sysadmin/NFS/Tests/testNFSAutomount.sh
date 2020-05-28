#!/bin/bash

# Run this test on any client.
# The server needs to have some file in /home1/tester1 and /home2/tester2

# How to break: service nis stop on server, service autofs restart on clients

# tester1 home and tester2 home has content
RES=$(ls /home/tester1);
if [[ ! -z $RES ]]; then
  echo "PASS: /home/tester1 has content"
else
  echo "FAIL: /home/tester1 does not have content"
fi

RES=$(ls /home/tester2);
if [[ ! -z $RES ]]; then
  echo "PASS: /home/tester2 has content"
else
  echo "FAIL: /home/tester2 does not have content"
fi


# Test permissions
# Run with root to pass (touch fails)
cd /home/tester1
if touch test2.txt 2>/dev/null; then
  echo "FAIL: Permission allows client root improperly"
else
  echo "PASS: Permission denies client root properly"
fi
