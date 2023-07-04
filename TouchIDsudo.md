# Using Touch ID for `sudo`

macOS is really good at not making you use your login password. _Really_ good. Keychain passwords, new device plugins, setting changes, all can be done 
via TouchID, which (particularly for those of us with lengthy passwords) is extremely useful.
One place you can't by default use TouchID is for `sudo`, however it can be enabled manually.

`/etc/pam.d/sudo` is the file used to control the parameters needed to successfully use `sudo`.

### The structure of `/etc/pam.d/sudo`

> [You can skip this part if you only care about getting TouchID working](#adding-touchid-support)

The `/etc/pam.d/sudo` file is a type of PAM (Pluggable Authentication Module), which is used for granting and denying access to services.
It is quite powerful, and here I will only cover the subset used by the `sudo` PAM. A more comprehensive guide to PAM syntax is covered [on the man page](https://linux.die.net/man/5/pam.d).

This is how the file looks by default:

```
# sudo: auth account password session
auth       sufficient     pam_tid.so
auth       sufficient     pam_smartcard.so
auth       required       pam_opendirectory.so
account    required       pam_permit.so
password   required       pam_deny.so
session    required       pam_permit.so
```

Comments begin with `#` in PAM files, and after that it consists of a series of tab-seperated 3-column rows with the following syntax:

```
service    type    control    module-path    module-arguments
```

Of course, this has 5 columns and the file above only ever uses 3.
The `service` column is only used by the root `/etc/pam.conf` file, and for any `/etc/pam.d/<SERVICE>` file, `service` is implicit. For example, `service` is `sudo` in our file.
The `module-arguments` column can be used, but none of the modules used here need any arguments, so it is ignored.

The order of the file is significant, as it is processed line by line.

#### Type

There are 4 different types of management group, which is what this column represents:

* `account` - non-authentication based management
    * Certains services may only be usable by certain roles. They could also be restricted by time of day, available system resources, or other arbitrary requirements.
`account` is used for these type of modules which don't actually perform any authentication of the user themselves.

* `auth` - the actual authentication modules
    * These modules actual perform authentication of the user and grant credentials. Examples include password entry, TouchID, other biometrics, and things like OpenDirectory/LDAP.

* `password` - these modules relate to changing passwords and aren't relevant to most services

* `session` - modules related to session creation/destruction

### Control

There are 6 different control values, but we will only cover the 2 relevant to our PAM file, check the man page for others.

* `sufficient` - if a `sufficient` module succeeds, execution is stopped. If all previous `required` modules were successful, the auth was successful, else, if any `required` modules failed, the auth fails
* `required` - a `required` module will be executed, and its success recorded, and then execution continues. Failure of a `required` module means authentication will eventually fail, but it does not stop execution

For example, let's show the execution flow for the following PAM file:

(Note: the file doesn't really make sense as an actual PAM file, it is just a demo)

```
auth    required      pam_permit.so
auth    required      pam_deny.so
auth    sufficient    pam_deny.so
auth    sufficient    pam_permit.so
```

> `pam_permit.so` always passes, and `pam_deny.so` always fails

* Line 1: `pam_permit.so` is `required`. It runs, and succeeds. Its exit status is remembered
* Line 2: `pam_deny.so` is `required`. It runs, and fails. Its exit status is remembered.
* Line 3: `pam_deny.so` is `sufficient`. It runs, fails, and so execution continues. The fact it failed is irrelevant and forgotten.
* Line 4: `pam_permit.so` is `sufficient`. It runs, passes, and so execution now stops (as a `sufficient` module succeeded).

However, even though execution has stopped, a previous `required` module had failed. Therefore, authentication fails.

### Module

The modules are relatively self-explanatory - these are the actual libraries used to authenticate. A few note worthy ones:

* `pam_permit.so` - always passes
* `pam_deny.so` - always fails
* `pam_tid.so` - the PAM for TouchID
* `pam_opendirectory.so` - the PAM for macOS OpenDirectory (this is what normally prompts you for a password)


## Adding TouchID support

The line we need to add is as follows:

```
auth       sufficient     pam_tid.so
```

This line says to use the TouchID PAM module (`pam_tid.so`) as an authentication module, and consider it passing sufficient authentication.
We want to insert it at the _top_ of the module, so it runs before `pam_opendirectory.so`, which will prompt for a password.

Note that as this is a system file, it is restricted, and editing it will require `sudo`.

This unfortunately gets removed every OS update, so I put a little script to add it in a ZSH plugin (`$ZSH_CUSTOM/plugins/touchid-auth/touchid-auth.plugin.zsh`) and then add that to my `~/.zshrc` plugin list.


```sh
# add line if not currently present in file
grep -qx 'auth\s*sufficient\s*pam_tid\.so' /etc/pam.d/sudo || {
  tmp=$(mktemp)

  # Take the first line (the comment line) from the auth file
  head -1 /etc/pam.d/sudo >> $tmp

  # Insert our line as the first real line of the file - this ensures TouchID is tried _before_ password
  print 'auth       sufficient     pam_tid.so' >> $tmp

  # Copy the rest of the file
  tail -n +2 /etc/pam.d/sudo >> $tmp

  # Save to the auth file
  prompt='Trying to enable TouchID for `sudo` but command does not have `sudo` access - enter password to continue: '
  sudo -p "$prompt" cp /etc/pam.d/sudo /etc/pam.d/sudo.bak
  sudo -p "$prompt" mv $tmp /etc/pam.d/sudo

  print 'TouchID enabled for `sudo` - old `sudo` auth file backed up to /etc/pam.d/sudo.bak'

  # No need to remove the temp file because we moved it
}
```
