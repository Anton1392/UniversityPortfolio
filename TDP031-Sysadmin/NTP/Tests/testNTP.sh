#!/bin/bash

# How to break: service ntp stop on server, after startup tests may take a while to start working.

# Tests that server responds to a query
if ntpdate -q 10.0.0.1 >/dev/null; then
  echo "PASS: Server responding to query."
else
  echo "FAIL: Server not responding to query."
fi

# Tests that we are synchronized
if ntpstat >/dev/null; then
  echo "PASS: We are synchronized."
else
  echo "FAIL: We are not synchronized."
fi

# Tests that the client gets time from the server
# Set wrong year, force-refresh NTP daemon, check that we were updated.
# Note: This test temporarily unsynchronizes us, hence the above test can fail immediately afterwards.
date -s "1 year"
WRONG=$(date "+%y")
service ntp stop
ntpd -gq >/dev/null
service ntp start >/dev/null
CORRECT=$(date "+%y")
if [[ "$CORRECT" -lt "$WRONG" ]]; then
  echo "PASS: NTP corrected our time."
else
  echo "FAIL: NTP did not correct our time."
fi
