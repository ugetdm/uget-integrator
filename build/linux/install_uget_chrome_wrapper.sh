#!/bin/sh

# Get the latest version
latest_release=$(curl -L -s -H 'Accept: application/json' https://github.com/slgobinath/uget-chrome-wrapper/releases/latest)
version=$(echo $latest_release | sed -e 's/.*"tag_name":"\([^"]*\)".*/\1/')

echo "Installing uget-chrome-wrapper $version"

# Download uget-chrome-wrapper to /usr/bin/uget-chrome-wrapper
sudo wget --quiet https://raw.githubusercontent.com/slgobinath/uget-chrome-wrapper/$version/uget-chrome-wrapper/bin/uget-chrome-wrapper --output-document /usr/bin/uget-chrome-wrapper

# Make the uget-chrome-wrapper executable
sudo chmod +x /usr/bin/uget-chrome-wrapper

# If you don't have Chromium, Google Chrome, Vivaldi or Opera, you can comment the gollowing two lines
########################################################### Chromium, Google Chrome, Vivaldi and Opera ##########################################################
# Create the required directories for native messaging host configuration
sudo mkdir -p /etc/opt/chrome/native-messaging-hosts
sudo mkdir -p /etc/chromium/native-messaging-hosts
sudo mkdir -p /etc/opera/native-messaging-hosts

# Download com.javahelps.ugetchromewrapper.json to /etc/opt/chrome/native-messaging-hosts/com.javahelps.ugetchromewrapper.json
sudo wget --quiet https://raw.githubusercontent.com/slgobinath/uget-chrome-wrapper/$version/uget-chrome-wrapper/conf/com.javahelps.ugetchromewrapper.json --output-document /etc/opt/chrome/native-messaging-hosts/com.javahelps.ugetchromewrapper.json

# Download com.javahelps.ugetchromewrapper.json to /etc/chromium/native-messaging-hosts/com.javahelps.ugetchromewrapper.json
sudo wget --quiet https://raw.githubusercontent.com/slgobinath/uget-chrome-wrapper/$version/uget-chrome-wrapper/conf/com.javahelps.ugetchromewrapper.json --output-document /etc/chromium/native-messaging-hosts/com.javahelps.ugetchromewrapper.json

# Download com.javahelps.ugetchromewrapper.json to /etc/opera/native-messaging-hosts/com.javahelps.ugetchromewrapper.json
sudo wget --quiet https://raw.githubusercontent.com/slgobinath/uget-chrome-wrapper/$version/uget-chrome-wrapper/conf/com.javahelps.ugetchromewrapper.json --output-document /etc/opera/native-messaging-hosts/com.javahelps.ugetchromewrapper.json

# If you don't have Firefox, you can comment the gollowing two lines
######################################################################## Mozilla Firefox ########################################################################
# Create the required directories for native messaging host configuration
sudo mkdir -p /usr/lib/mozilla/native-messaging-hosts
sudo mkdir -p /usr/lib64/mozilla/native-messaging-hosts
# Download com.javahelps.ugetfirefoxwrapper.json to /usr/lib/mozilla/native-messaging-hosts/com.javahelps.ugetfirefoxwrapper.json
sudo wget --quiet https://raw.githubusercontent.com/slgobinath/uget-chrome-wrapper/$version/uget-chrome-wrapper/conf/com.javahelps.ugetfirefoxwrapper.json --output-document /usr/lib/mozilla/native-messaging-hosts/com.javahelps.ugetfirefoxwrapper.json

# Download com.javahelps.ugetfirefoxwrapper.json to /usr/lib64/mozilla/native-messaging-hosts/com.javahelps.ugetfirefoxwrapper.json
sudo wget --quiet https://raw.githubusercontent.com/slgobinath/uget-chrome-wrapper/$version/uget-chrome-wrapper/conf/com.javahelps.ugetfirefoxwrapper.json --output-document /usr/lib64/mozilla/native-messaging-hosts/com.javahelps.ugetfirefoxwrapper.json

echo "uget-chrome-wrapper is installed successfully!"
echo "Please install the 'uGet Integration' extension and restart the browser"
echo "  - Google Chrome, Chromium & Vivaldi: https://chrome.google.com/webstore/detail/uget-integration/efjgjleilhflffpbnkaofpmdnajdpepi"
echo "  - Mozilla Firefox: https://addons.mozilla.org/en-US/firefox/addon/ugetintegration/"
echo "  - Opera: https://addons.opera.com/en/extensions/details/uget-integration"