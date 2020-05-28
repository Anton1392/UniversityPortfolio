if [ "$HOSTNAME" = client-1 ]; then
  echo "PASS: hostname is $HOSTNAME"
else
  echo "FAIL: hostname is $HOSTNAME"
fi
