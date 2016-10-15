# uGet Chrome Wrapper
Integrate the famous FOSS uGet Download Manager with Google Chrome in Linux systems. With this tool, uGet can interrupt and catch your downloads from Google Chrome.


## Installation
### Installing uGet Download Manager

If you do not have [uGet](http://ugetdm.com/) Download Manager, install the latest version using the following commands.

1: Add the PPA: `sudo add-apt-repository ppa:plushuang-tw/uget-stable`

2: Download the package list: `sudo apt update`

3: Install uget: `sudo apt install uget`


### Installing uget-chrome-wrapper

***

#### Linux:

**Method 1: From PPA**

1: Add the PPA: `sudo add-apt-repository ppa:slgobinath/uget-chrome-wrapper`

2: Download the package list: `sudo apt update`

3: Install uget-chrome-wrapper: `sudo apt install uget-chrome-wrapper`

4: Install [uGet Integration](https://chrome.google.com/webstore/detail/uget-integration/efjgjleilhflffpbnkaofpmdnajdpepi) extension to your browser.

5: Restart the browser



**Method 2: From Debian**

1: Download and install the debian file from [here](http://ppa.launchpad.net/slgobinath/uget-chrome-wrapper/ubuntu/pool/main/u/uget-chrome-wrapper)

2: Install [uGet Integration](https://chrome.google.com/webstore/detail/uget-integration/efjgjleilhflffpbnkaofpmdnajdpepi) extension to your browser.

3: Restart the browser



**Method 3: Manual Installation**

1: Download the uget-chrome-wrapper to /usr/lib/bin: `sudo wget https://raw.githubusercontent.com/slgobinath/uget-chrome-wrapper/master/uget-chrome-wrapper/bin/uget-chrome-wrapper --output-document /usr/lib/bin/uget-chrome-wrapper`

2: Create a new directory native-messaging-hosts if not exists: `sudo mkdir -p /etc/opt/chrome/native-messaging-hosts`

3: Download the com.javahelps.ugetchromewrapper.json to that directory: `sudo wget https://raw.githubusercontent.com/slgobinath/uget-chrome-wrapper/master/uget-chrome-wrapper/conf/com.javahelps.ugetchromewrapper.json --output-document /etc/opt/chrome/native-messaging-hosts/com.javahelps.ugetchromewrapper.json`

4: Install [uGet Integration](https://chrome.google.com/webstore/detail/uget-integration/efjgjleilhflffpbnkaofpmdnajdpepi) extension to your browser.

5: Restart the browser


***

#### Windows:
1: Download and install [Python 2.7](https://www.python.org/downloads/release/python-2712/)

2: Add uGet to the system path [Screenshot](https://github.com/slgobinath/uget-chrome-wrapper/blob/master/build/windows/add_uget_to_path.png)

3: Download and install [uget-chrome-wrapper](https://github.com/slgobinath/uget-chrome-wrapper/releases/download/v1.2/uget-chrome-wrapper_1.2.1.exe)

4: Install [uGet Integration](https://chrome.google.com/webstore/detail/uget-integration/efjgjleilhflffpbnkaofpmdnajdpepi) extension to your browser.

5: Restart the browser

> Please note that this is my leisure time project. Even though I will continue development and bug fixes, Windows is not my targeted operating system. Even for the first release, I installed the trial version of Windows in Virtual Box and created the setup file. Therefore there may be delays in releasing the bug fixes and new features to Windows users.

## Usage
Simply click on any downloadable links to download the file. 'uGet new Download' dialog will appear and continue the download.

To disable uGet from interrupting your download, press <kbd>Insert</kbd> key and click on the link.


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

## History
Version 1.2:
 * Now uget-chrome-wrapper supports Google Chrome, Chromium and Vivaldi

Version 1.1:
* Fix extension id mismatch
* Fix %20 in filename

Version 1.0:
* Integrate uGet Download Manager with Google Chrome


## License

GNU General Public License v3