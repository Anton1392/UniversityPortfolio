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
