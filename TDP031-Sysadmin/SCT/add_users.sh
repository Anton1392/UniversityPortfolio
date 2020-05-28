read -p "Confirm permanent changes (y/n)" confirm
case "$confirm" in
	Y|y ) doSave=true;;
	* ) doSave=false;;
esac

if [ $doSave = true ]; then
	printf "(y) Live mode\n"
else
	printf "(n) Test mode\n"
fi

while read line; do

	# Generate username
	name=$line
	name=$(echo $name | iconv -f UTF-8 -t ascii//translit)
	name=$(echo $name | tr -d "?_")
	if [ "$name" = "" ]; then
		name="user"
	fi
	name=$(echo $name | tr '[:upper:]' '[:lower:]')
	name=$(echo $name | tr -cd "[:print:]\n")
	username=""
	for part in $name
	do
		#printf "part: $part\n"
		new=$(echo "$part" | cut -c1-4)
		username="${username}${new}"
	done
	username=$(echo "$username" | cut -c1-6)

	unique="$username"
	while grep ^$unique: /etc/passwd >/dev/null; do
		unique="${username}${RANDOM}"
	done
	username=$unique
	#printf "\n"
	#printf "realname: $name\n"
	#printf "username: $username\n"

	# Generate password
	password=$(openssl rand -base64 12)

	if [ $doSave = true ]; then
		useradd -d /home/"$username" "$username"
    echo $username:$password | chpasswd
    mkdir /home1/"$username"
    echo "Welcome to your home, ${username}." > /home1/"$username"/readme.txt
		chown "$username" -R /home1/"$username"
		chmod -R 700 /home1/"$username"

    # Add to auto.home
    echo "$username -fstype=nfs,rw  10.0.0.2:/home1/$username" >> /etc/auto.home
	fi

	printf "$username:$password\n"

done < $1

if [ $doSave = true ]; then
	cd /var/yp
	make >/dev/null
	service nis restart
	service autofs restart
fi
