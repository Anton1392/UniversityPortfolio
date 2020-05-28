echo ""
echo "- - - Router - - -"
bash ~/tests/ALL.sh

echo ""
echo "- - - Server - - -"
ssh root@10.0.0.2 'bash ~/tests/ALL.sh'

echo ""
echo "- - - Client - - -"
ssh root@10.0.0.3 'bash ~/tests/ALL.sh'
