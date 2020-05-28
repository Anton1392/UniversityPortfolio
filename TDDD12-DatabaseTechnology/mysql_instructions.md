# TDDD12 Database Technology

## Info

Labs: [ida.liu.se](https://www.ida.liu.se/~TDDD12/labs/index.en.shtml)  
MySQL Server: `mariadb.edu.liu.se`  
ThinLinc Server: `thinlinc.edu.liu.se`

---
## Commands

### SSH
ThinLinc client  
[Download](https://www.cendio.com/thinlinc/download)  

CLI
```bash
ssh <liu_id>@thinlinc.edu.liu.se
```

### SQL
Unix
```bash
mysql -h mariadb.edu.liu.se -u <liu_id> -p <liu_id>
```

MySQL Shell (Windows)  
[Download](https://dev.mysql.com/downloads/shell/)  
[Commands](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-shell-commands.html)  
```bash
\sql # enter SQL mode
\c --mysql <liu_id>@mariadb.edu.liu.se # connect to server
```

### Atom  
[Data Package](https://atom.io/packages/data-atom)    
Hotkey [F5] -  Execute query  
Settings - Use query at cursor  

[data-settings]: docs/images/atom_data_package.jpg  
![Server connection settings][data-settings]
