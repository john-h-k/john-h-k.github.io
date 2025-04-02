# Install GNU tools for macOS

By default, macOS has FreeBSD-based core utilities such as `date`, `grep`, and `sed`. While these are adequate for many tasks, they're very limited in comparison to the GNU standard utilites that you may be used to from bash, and that are often used in stackoverflow bash scripts and the like. To install the improved GNU-standard tools, run these Homebrew commands.

```sh
brew install coreutils # The majority of them
brew install findutils # find
brew install gnu-indent # indent
brew install gnu-sed # sed
brew install gnutls # TLS
brew install grep # grep
brew install gnu-tar # tar
brew install gawk # [g]awk
```

However, to prevent breaking the large number of tools expecting FreeBSD utilities, all of these will be installed with a `g` prefix. So now you can use `ggrep`, `gdate`, and `gsed` to your heart's content without any of the limits of the Free-BSD versions!
