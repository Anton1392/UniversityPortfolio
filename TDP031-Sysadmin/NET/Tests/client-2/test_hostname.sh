if [ "$HOSTNAME" = client-2 ]; then
  echo "PASS: hostname is $HOSTNAME"
else
  echo "FAIL: hostname is $HOSTNAME"
fi
