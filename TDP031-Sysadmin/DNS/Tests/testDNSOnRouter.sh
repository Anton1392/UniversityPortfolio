#!/bin/bash

# How to break: service bind9 stop on server

RES=$(dig -b 10.0.2.15 google.com @10.0.0.2)
if [[ $RES == *"status: REFUSED"* ]]; then
  echo "PASS: DNS server refused external recursive query"
else
  echo "FAIL: DNS server either allowed external recursive query or is down"
fi
