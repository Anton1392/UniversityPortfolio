#!/bin/bash

# Run this test on any machine.

# How to break: service nis stop on server

# Has the correct NIS server

NAME=$(ypwhich)
if [ $NAME == "server.student.ida.liu.se" ]; then
  echo "PASS: Correct NIS-server set"
else
  echo "FAIL: Wrong NIS-server set"
fi

# Can communicate with server
if ypcat passwd >/dev/null; then
  echo "PASS: Can ypcat passwd"
else
  echo "FAIL: Can not ypcat passwd"
fi

RES=$(ypcat passwd);
# Contains a NIS-only user (testuser)
if [[ $RES == *"testuser"* ]]; then
  echo "PASS: testuser exists on server"
else
  echo "FAIL: testuser does not exist on server"
fi
