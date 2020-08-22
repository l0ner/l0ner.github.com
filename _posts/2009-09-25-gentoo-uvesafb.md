---
layout: default
title: Gentoo + UvesaFb + widescreen
---

howto: uvesafb widescreen

1. You need to configure your kernel kernel. In the "Device Drivers" section select:

   ~~~~
   [*] Connector - unified userspace kernelspace linker
   Graphics support --->
     Support for frame buffer devices --->
       [*] Userspace VESA VGA graphics support
   ~~~~~

2. build the kernel: make

1. emerge klibc
2. emerge v86d

   ~~~~
   # emerge klibc
   ~~~~

   Note: This step is necessary because klibc has to be compiled against a
   kernel tree that includes uvesafb. You only need to do this once, i.e. you
   won't have to remerge klibc every time you install a new kernel or a new
   kernel module.

4. install v86d:

   ~~~~
   # emerge v86d
   ~~~~

5. reconfigure your kernel; in the "General Setup" section select:

   ~~~~~
   [*] Initial RAM filesystem and RAM disk (initramfs/initrd) support
   ~~~~~

   and use `/usr/share/v86d/initramfs` in Initramfs source file(s).
   (that's `CONFIG_INITRAMFS_SOURCE="/usr/share/v86d/initramfs"`)

6. rebuild the kernel: make, and install it

7. add `video=uvesafb:1024x768-32,mtrr:3,ywrap` (or similar) to your kernel command line

8. reboot and enjoy uvesafb :)

check `/sys/bus/platform/drivers/uvesafb/uvesafb.0/vbe_modes` for available video modes.

[Source](http://dev.gentoo.org/~spock/projects/uvesafb)
