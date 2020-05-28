#!/bin/bash

# Tests that server responds to a query
if ntpdate -q 10.0.0.1 >/dev/null; then
  echo "PASS: Server responding to query."
else
  echo "FAIL: Server not responding to query. (could be because the server did not have time to stabilize)"
fi

# Tests that we are synchronized
if ntpstat >/dev/null; then
  echo "PASS: We are synchronized."
else
  echo "FAIL: We are not synchronized. (could be because the server did not have time to stabilize)"
fi
