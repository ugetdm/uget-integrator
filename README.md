# uGet Integrator

Integrate uGet Download Manager with Google Chrome, Chromium, Opera, Vivaldi and Mozilla Firefox.

## Features

> Click on each link to see GIF animation explaining how to use these features.

- [Browser Integration](https://github.com/ugetdm/uget-integrator/wiki/Features#browser-integration)
- [Skip uGet](https://github.com/ugetdm/uget-integrator/wiki/Features#skip-uget)
- [Download Youtube Videos](https://github.com/ugetdm/uget-integrator/wiki/Features#download-youtube-videos)
- [Filter URLs](https://github.com/ugetdm/uget-integrator/wiki/Features#filter-urls)
- [Batch Download](https://github.com/ugetdm/uget-integrator/wiki/Features#batch-download)
- [Download Videos (Experimental)](https://github.com/ugetdm/uget-integrator/wiki/Features#download-videos-experimental)

## Installation

> If you already have `uget-chrome-wrapper`, please uninstall it. Complete uninstallation guide is available at: [Remove Uget Chrome Wrapper](https://github.com/ugetdm/uget-integrator/wiki/Remove-Uget-Chrome-Wrapper)

1. Install `uget-integrator`
    - [Arch Linux](https://github.com/ugetdm/uget-integrator/wiki/Installation#arch)
    - [Ubuntu & Linux Mint](https://github.com/ugetdm/uget-integrator/wiki/Installation#ubuntu--linux-mint)
    - [Other Linux](https://github.com/ugetdm/uget-integrator/wiki/Installation#other-linux)
    - [Windows (Recommended method)](https://github.com/ugetdm/uget-integrator/wiki/Installation#recommended-method)
    - [Windows (Portable method)](https://github.com/ugetdm/uget-integrator/wiki/Installation#portable-method)

2. Install [uget-extension](https://github.com/ugetdm/uget-extension) and restart your browser

## Known Issues

- [Firefox not interrupting downloads](https://github.com/ugetdm/uget-integrator/wiki/Known-Issues#firefox-not-interrupting-downloads)


## Build Packages (Only for developer)

These commands are only for the developer to automate package creations.
```bash
mkdir build
cd build
rm -rf *; cmake ..; make deb_package zip_package nsis_package
```

## License

GNU General Public License v3