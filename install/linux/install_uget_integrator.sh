#!/bin/sh

# Set default umask permissions
umask 022

# Get the latest version
latest_release=$(curl -L -s -H 'Accept: application/json' https://github.com/ugetdm/uget-integrator/releases/latest)
version=$(echo $latest_release | sed -e 's/.*"tag_name":"\([^"]*\)".*/\1/')

echo "Installing uget-integrator $version"

# Remove old files if exist
sudo rm -f /usr/bin/uget-integrator

# Download uget-integrator to /usr/bin/uget-integrator
sudo wget --quiet https://raw.githubusercontent.com/ugetdm/uget-integrator/$version/bin/uget-integrator --output-document /usr/bin/uget-integrator

# Make the uget-integrator executable
sudo chmod +x /usr/bin/uget-integrator

# If you don't have Chromium, Google Chrome, Vivaldi or Opera, you can comment the following two lines
########################################################### Chromium, Google Chrome, Vivaldi and Opera ##########################################################
# Create the required directories for native messaging host configuration
sudo mkdir -p /etc/opt/chrome/native-messaging-hosts
sudo mkdir -p /etc/chromium/native-messaging-hosts
sudo mkdir -p /etc/opera/native-messaging-hosts

# Remove old files if exist
sudo rm -f /etc/opt/chrome/native-messaging-hosts/com.ugetdm.chrome.json
sudo rm -f /etc/chromium/native-messaging-hosts/com.ugetdm.chrome.json
sudo rm -f /etc/opera/native-messaging-hosts/com.ugetdm.chrome.json

# Download com.ugetdm.chrome.json to /etc/opt/chrome/native-messaging-hosts/com.ugetdm.chrome.json
sudo wget --quiet https://raw.githubusercontent.com/ugetdm/uget-integrator/$version/conf/com.ugetdm.chrome.json --output-document /etc/opt/chrome/native-messaging-hosts/com.ugetdm.chrome.json

# Download com.ugetdm.chrome.json to /etc/chromium/native-messaging-hosts/com.ugetdm.chrome.json
sudo wget --quiet https://raw.githubusercontent.com/ugetdm/uget-integrator/$version/conf/com.ugetdm.chrome.json --output-document /etc/chromium/native-messaging-hosts/com.ugetdm.chrome.json

# Download com.ugetdm.chrome.json to /etc/opera/native-messaging-hosts/com.ugetdm.chrome.json
sudo wget --quiet https://raw.githubusercontent.com/ugetdm/uget-integrator/$version/conf/com.ugetdm.chrome.json --output-document /etc/opera/native-messaging-hosts/com.ugetdm.chrome.json

# If you don't have Firefox, you can comment the following two lines
######################################################################## Mozilla Firefox ########################################################################
# Create the required directories for native messaging host configuration
sudo mkdir -p /usr/lib/mozilla/native-messaging-hosts
sudo mkdir -p /usr/lib64/mozilla/native-messaging-hosts

# Remove old files if exist
sudo rm -f /usr/lib/mozilla/native-messaging-hosts/com.ugetdm.firefox.json
sudo rm -f /usr/lib64/mozilla/native-messaging-hosts/com.ugetdm.firefox.json

# Download com.ugetdm.firefox.json to /usr/lib/mozilla/native-messaging-hosts/com.ugetdm.firefox.json
sudo wget --quiet https://raw.githubusercontent.com/ugetdm/uget-integrator/$version/conf/com.ugetdm.firefox.json --output-document /usr/lib/mozilla/native-messaging-hosts/com.ugetdm.firefox.json

# Download com.ugetdm.firefox.json to /usr/lib64/mozilla/native-messaging-hosts/com.ugetdm.firefox.json
sudo wget --quiet https://raw.githubusercontent.com/ugetdm/uget-integrator/$version/conf/com.ugetdm.firefox.json --output-document /usr/lib64/mozilla/native-messaging-hosts/com.ugetdm.firefox.json

echo "uget-integrator is installed successfully!"
echo "Please install the 'uGet Integration' extension and restart the browser"
echo "  - Google Chrome, Chromium & Vivaldi: https://chrome.google.com/webstore/detail/uget-integration/efjgjleilhflffpbnkaofpmdnajdpepi"
echo "  - Mozilla Firefox: https://addons.mozilla.org/en-US/firefox/addon/ugetintegration/"
echo "  - Opera: https://addons.opera.com/en/extensions/details/uget-integration"