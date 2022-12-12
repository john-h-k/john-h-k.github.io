# Using Touch ID for `sudo`

Not everybody knows, but you can use macOS' TouchID for `sudo` authentication in your terminal. To do so, you simply need to add this line

```
auth       sufficient     pam_tid.so
```

to your `/etc/pam.d/sudo` file (which is responsible for determining what types of authentication can be used for what type of operations).

This unfortunately gets removed every OS update in my experience, so I put a little script to add it in a ZSH plugin (`$ZSH_CUSTOM/plugins/touchid-auth/touchid-auth.plugin.zsh`) and then add that to my `~/.zshrc` plugin list.

It first `grep`s to see if the line is already present, and then appends the line if not. Not much of a time saver, but a nice quality-of-life improvement to my terminal setup in my opinion.

```sh
# add line if not currently present in file
# '| sudo tee -a' is used as '>> /etc/pam.d/sudo' doesn't have sufficient permissions
grep -qx 'auth\s*sufficient\s*pam_tid\.so' /etc/pam.d/sudo ||
    print 'auth       sufficient     pam_tid.so' | sudo tee -a /etc/pam.d/sudo
```

