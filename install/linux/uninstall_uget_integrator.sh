#!/bin/sh

# Remove the uget-chrome-wrapper executable
sudo rm -f /usr/bin/uget-chrome-wrapper

# If you don't have Chromium, Google Chrome, Vivaldi or Opera, you can comment the following two lines
########################################################### Chromium, Google Chrome, Vivaldi and Opera ##########################################################
# Remove /etc/opt/chrome/native-messaging-hosts/com.javahelps.ugetchromewrapper.json
sudo rm -f /etc/opt/chrome/native-messaging-hosts/com.javahelps.ugetchromewrapper.json

# Remove /etc/chromium/native-messaging-hosts/com.javahelps.ugetchromewrapper.json
sudo rm -f /etc/chromium/native-messaging-hosts/com.javahelps.ugetchromewrapper.json

# Remove /etc/opera/native-messaging-hosts/com.javahelps.ugetchromewrapper.json
sudo rm -f /etc/opera/native-messaging-hosts/com.javahelps.ugetchromewrapper.json

# If you don't have Firefox, you can comment the following two lines
######################################################################## Mozilla Firefox ########################################################################
# Remove /usr/lib/mozilla/native-messaging-hosts/com.javahelps.ugetfirefoxwrapper.json
sudo rm -f /usr/lib/mozilla/native-messaging-hosts/com.javahelps.ugetfirefoxwrapper.json

# Remove /usr/lib64/mozilla/native-messaging-hosts/com.javahelps.ugetfirefoxwrapper.json
sudo rm -f /usr/lib64/mozilla/native-messaging-hosts/com.javahelps.ugetfirefoxwrapper.json

echo "uget-chrome-wrapper is uninstalled successfully!"
echo "Please remove the 'uGet Integration' extension from your browser"