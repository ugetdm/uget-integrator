# uGet Chrome Wrapper
Integrate the famous FOSS uGet Download Manager with Google Chrome in Linux systems. With this tool, uGet can interrupt and catch your downloads from Google Chrome.

For more details, visit the official page: [uGet Chrome Wrapper](https://slgobinath.github.io/uget-chrome-wrapper/)

## Installation

To see how to install, visit the [installation guide](https://slgobinath.github.io/uget-chrome-wrapper/#installation) and click on your operating system.

## Usage
Simply click on any downloadable links to download the file. 'uGet new Download' dialog will appear and continue the download.

To disable uGet from interrupting your download, press <kbd>Insert</kbd> key and click on the link. <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>U</kbd> can be used to disable the extension for a longer period. The same shortcut can enable the extension again.

## Known Problems
### Firefox not interrupting downloads (Issue [#43](https://github.com/slgobinath/uget-chrome-wrapper/issues/43))
If Firefox does not interrupt the downloads but `Download with uGet` works, delete the `handlers.json` from the following path.

```
~/.mozilla/firefox/mwad0hks.default/handlers.json
```

You may have a different folder name instead of `mwad0hks.default`. Firefox Nightly users may have `firefox-trunk` folder instead of `firefox`.

### uGet does not capture the downloads in Windows (Issue [#43](https://github.com/slgobinath/uget-chrome-wrapper/issues/43))

Ensure that `uget` directory is directly under the `C:\` drive and the `C:\uget\bin` directory is added to the environment variable `PATH`. Also start uGet manually (recommended to add to the system startup) before downloading any files.


## Contributing
**Are you a user?**

Please test uget-chrome-wrapper on your system and report any issues [here](https://github.com/slgobinath/uget-chrome-wrapper/issues)

**Are you a developer?**

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

**Are you using a different operating system?**

Please test uget-chrome-wrapper and create installers for your operating system


## License

GNU General Public License v3