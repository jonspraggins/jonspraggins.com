---
title: "The Idiot clumsily migrates VMware VMs into ProxmoxVE"
description: "A quick and dirty guide on how to migrate VMware VMs to Proxmox Virtual Environment. Tested in the 5.0 Beta."
pubDate: 2017-07-30
tags: ["proxmox", "virtualization"]
---

A quick and dirty guide on how to migrate VMware VMs to Proxmox Virtual Environment. Tested in the 5.0 Beta.

## Steps

- Remove VMware Tools from the VM you wish to migrate.

- Download and run the **MergeIDE** registry edit to make the system bootable by IDE.

- Shut down the VM in VMware.

- Convert the VMDK files to a single grow-able file using `vmware-vdiskmanager` (may be a separate download):

  ```
  C:/location/of/vmware/vmware-vdiskmanager.exe -r tobeconverted.vmdk -t 0 converted-pve.vmdk
  ```

- Allow the conversion to complete.

- Update your local storage on the Proxmox node to allow Disk Images: **Datacenter → Storage → Local**.

- Create a KVM VM using the Proxmox web GUI, with the hard disk type set to **VMware**, stored on **local** (not local-lvm).

- **Do not start the VM.**

- Take note of the VM ID (e.g. `109`).

- SCP into the Proxmox node and navigate to `/var/lib/vz/images/VMID`.

- Delete the disk associated with the VM (e.g. `vm-109-disk1`).

- Upload your converted VMDK, renamed appropriately.

- In the Proxmox web GUI, select **Move Disk** and choose **local-lvm** as the target. Delete the source if you want.

- Allow the disk move to complete — this may take a few minutes.

- Start the VM in Proxmox and check progress in the console.

## Going Further

VMware VMs work in Proxmox, but they aren't the most performant format. If you want to go one step further — at the cost of a little backwards compatibility — convert the disk image to qcow2 using the built-in `qemu-img` utility:

```bash
qemu-img convert -f vmdk -O qcow2 winServer.vmdk winServer.qcow2
```
