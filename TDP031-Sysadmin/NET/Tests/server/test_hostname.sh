if [ "$HOSTNAME" = server ]; then
  echo "PASS: hostname is $HOSTNAME"
else
  echo "FAIL: hostname is $HOSTNAME"
fi
