# STO

## [Theory questions & answers](./STO.md)
### [setup.txt](./setup.txt)

## Configuration

### Server setup
#### /home1 (small files)
```bash
mdadm --create /dev/md0 --level=raid1 --raid-devices=2 /dev/vda /dev/vdb #create raid
mkfs -b 1024 /dev/md0 #make file system (bock size optimized for smaller files. 1KB)
mkdir /home1
mount /dev/md0 /home1 # will not persist on boot
blkid #get UUID of md0 (since it might/will change name to something else/md127)
```
Copy the UUID and paste it into `/etc/fstab`
```
UUID=ID_HERE	/home1	ext2
```
#### /home2 (big files)
```bash
pvcreate /dev/vdc
pvcreate /dev/vdd
vgcreate vg1 /dev/vdc /dev/vdd --physicalextentsize 10MB
lvcreate -n lvol0 -L 80MB vg1
mkfs -b 4096 /dev/vg1/lvol0
mkdir /home2
mount /dev/vg1/lvol0 /home2 #will not persist reboot
blkid #get UUID of dev/mapper/vg1-lvol0
```
Copy the UUID and paste it into `/etc/fstab`
```
UUID=ID_HERE	/home2	ext2
```
**Save and reboot**
