---
title: "The Idiot adds Two-Factor Authentication to Proxmox"
description: "A quick walkthrough for getting OATH-based 2FA running on a single Proxmox instance."
pubDate: 2018-03-01
tags: ["proxmox", "security"]
---

Let's get some simple 2FA running on a single Proxmox instance. Because why not?

This guide assumes you already have a user account created in the PVE realm. I recommend creating a new admin account/group and adding the necessary permissions. For more information on that, refer to [Proxmox's User Management docs](https://pve.proxmox.com/wiki/User_Management#_real_world_examples).

## Steps

1. Open a **Shell** within Proxmox.

![Proxmox shell](/images/shell.png)

2. Ensure your time in Proxmox is accurate with the `date` command. If your time is off by more than 30 seconds, time-based codes will fail.

3. Generate an OATH key with the `oathkeygen` command.

![OATH key generation](/images/oath-1.png)

4. Copy the generated 16-character code and close the console.

5. In the **Datacenter** view, open the **Users** tab under **Permissions**.

6. Select the user you want to add 2FA to and click **Edit**.

7. Paste the code into the **KeyIDs** field (make sure no spaces snuck in) and click **OK**.

![PVE user KeyID field](/images/pveuserkeyid.png)

8. Select **Authentication** under **Permissions**.

9. Select `pve` and click **Edit**, then set TFA to **OATH** and click **OK**.

10. Add that same code to your authenticator app (I use [Google Authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2)). The account name can be anything, but the key must match the code generated earlier. Leave **Time based** unchanged. Click **Add**.

![Google Authenticator setup](/images/gauth.png)

11. Log out of Proxmox.

12. When you log back in using your account (don't forget to select the right realm), an OTP field will appear. Enter the code from your authenticator.

![Login with OTP](/images/loginotp.png)

That's it — you've got 2FA on Proxmox.
