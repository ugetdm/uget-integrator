# uGet Chrome Wrapper
Integrate the famous FOSS uGet Download Manager with Google Chrome in Linux systems. With this tool, uGet can interrupt and catch your downloads from Google Chrome.


## Installation
**Method 1: From PPA**

1: Add the PPA: `sudo add-apt-repository ppa:slgobinath/uget-chrome-wrapper`

2: Download the package list: `sudo apt update`

3: Install uget-chrome-wrapper: `sudo apt install uget-chrome-wrapper`

4: Install [uGet Integration](https://chrome.google.com/webstore/detail/uget-integration/efjgjleilhflffpbnkaofpmdnajdpepi) extension to your Google Chrome.



**Method 2: From Debian**

1: Download and install the debian file from [here](http://ppa.launchpad.net/slgobinath/uget-chrome-wrapper/ubuntu/pool/main/u/uget-chrome-wrapper)

2: Install [uGet Integration](https://chrome.google.com/webstore/detail/uget-integration/efjgjleilhflffpbnkaofpmdnajdpepi) extension to your Google Chrome.



**Method 3: Manual Installation**

1: Download the uget-chrome-wrapper to /usr/lib/bin: `sudo wget https://raw.githubusercontent.com/slgobinath/uget-chrome-wrapper/master/uget-chrome-wrapper/bin/uget-chrome-wrapper --output-document /usr/lib/bin/uget-chrome-wrapper`

2: Create a new directory native-messaging-hosts if not exists: `sudo mkdir -p /etc/opt/chrome/native-messaging-hosts`

3: Download the com.javahelps.ugetchromewrapper.json to that directory: `sudo wget https://raw.githubusercontent.com/slgobinath/uget-chrome-wrapper/master/uget-chrome-wrapper/conf/com.javahelps.ugetchromewrapper.json --output-document /etc/opt/chrome/native-messaging-hosts/com.javahelps.ugetchromewrapper.json`

4: Install [uGet Integration](https://chrome.google.com/webstore/detail/uget-integration/efjgjleilhflffpbnkaofpmdnajdpepi) extension to your Google Chrome.

## Usage
Simply click on any downloadable links to download the file. 'uGet new Download' dialog will appear and continue the download.

To disable uGet from interrupting your download, press <kbd>Insert</kbd> key and click on the link.


## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request


## History
Version 1.1:
* Fix extension id mismatch
* Fix %20 in filename

Version 1.0:
* Integrate uGet Download Manager with Google Chrome


## License

GNU General Public License v3