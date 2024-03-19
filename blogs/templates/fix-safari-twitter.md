# Fix Twitter not loading on macOS Safari

Recently I had a problem where Twitter would load if I was not signed in, but when signed in the pages would get stuck on the big "X" screen and not progress due to a ton of errors about `ton.local.twitter.com` being an unrecognised domain.

This can be fixed by clearing the DNS cache and restarting Safari:

```bash
sudo dscacheutil -flushcache
sudo killall mDNSResponder
```
