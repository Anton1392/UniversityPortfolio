### 2-1 Explain what the automounter is and how it works.
> The automounter automatically mounts filesystems to folders when those folders are requested by users.
The automounter follows the rules of the automount maps to properly mount.

### 2-2 Explain what an automount map is, and the difference between direct and indirect maps.
> A description of how the automounter should mount filesystems.
A direct map is a map that has a full path name to the mount point.
An indirect map is a map that only has the base name of the mount point. It requires information from another map to build a correct full path.

### 2-3 What is the purpose of an automounter? Why not use static network mounts instead.
> To not have filesystems mounted all of the time. With autofs filesystems are only mounted when they are needed and unmounted afterwards.
If static mounts are used, they are constantly active. If something goes wrong with them, the client system may struggle to boot as it repeatedly tries to mount a broken point.
