#!/bin/bash

# How to break: ifdown ens3 on clients, ifdown ens4 on gw

if ping -q -c 1 -W 1 10.0.0.1 >/dev/null; then
  echo "PASS: Can ping gw"
else
  echo "FAIL: Can not ping gw"
fi

if ping -q -c 1 -W 1 10.0.0.2 >/dev/null; then
  echo "PASS: Can ping server"
else
  echo "FAIL: Can not ping server"
fi

if ping -q -c 1 -W 1 10.0.0.3 >/dev/null; then
  echo "PASS: Can ping client-1"
else
  echo "FAIL: Can not ping client-1"
fi

if ping -q -c 1 -W 1 10.0.0.4 >/dev/null; then
  echo "PASS: Can ping client-2"
else
  echo "FAIL: Can not ping client-2"
fi

if nc -z -w 1 google.com 80; then
  echo "PASS: Can reach outside"
else
  echo "FAIL: Can not reach outside"
fi
