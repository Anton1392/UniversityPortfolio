#!/bin/bash
RES=$(dig -b 10.0.2.15 google.com @10.0.0.2)
if [[ $RES == *"status: REFUSED"* ]]; then
  echo "PASS: DNS server refused external recursive query"
else
  echo "FAIL: DNS server allowed external recursive query"
fi
