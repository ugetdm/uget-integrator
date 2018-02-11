@echo off

:: Create JSON config files
@echo {"name":"com.ugetdm.chrome","description":"Integrate uGet with Google Chrome","path":"%~dp0uget-integrator.bat","type":"stdio","allowed_origins":["chrome-extension://efjgjleilhflffpbnkaofpmdnajdpepi/","chrome-extension://akcbnhoidebjpiefdkmaaicfgdpbnoac/"]}> com.ugetdm.chrome.json

@echo {"name":"com.ugetdm.firefox","description":"Integrate uGet with Mozilla Firefox","path":"%~dp0uget-integrator.bat","type":"stdio","allowed_extensions":["uget-integration@slgobinath"]}> com.ugetdm.firefox.json

:: Create required registry entries
REG ADD HKCU\SOFTWARE\Google\Chrome\NativeMessagingHosts\com.ugetdm.chrome /f /ve /t REG_SZ /d "%~dp0com.ugetdm.chrome.json"
REG ADD HKCU\SOFTWARE\Mozilla\NativeMessagingHosts\com.ugetdm.firefox /f /ve /t REG_SZ /d "%~dp0com.ugetdm.firefox.json"