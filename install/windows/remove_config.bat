@echo off

:: Delete JSON config files
DEL com.ugetdm.chrome.json
DEL com.ugetdm.firefox.json

:: Delete registry entries
REG DELETE HKCU\SOFTWARE\Google\Chrome\NativeMessagingHosts\com.ugetdm.chrome /f
REG DELETE HKCU\SOFTWARE\Mozilla\NativeMessagingHosts\com.ugetdm.firefox /f