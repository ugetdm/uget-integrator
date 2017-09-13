; uget-chrome-wrapper is a tool to integrate uGet Download manager
; with Google Chrome, Chromium, Vivaldi and Opera in Linux and Windows.

; Copyright (C) 2016  Gobinath

; This program is free software: you can redistribute it and/or modify
; it under the terms of the GNU General Public License as published by
; the Free Software Foundation, either version 3 of the License, or
; (at your option) any later version.

; This program is distributed in the hope that it will be useful,
; but WITHOUT ANY WARRANTY; without even the implied warranty of
; MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
; GNU General Public License for more details.

; You should have received a copy of the GNU General Public License
; along with this program.  If not, see <http://www.gnu.org/licenses/>.

;--------------------------------
; StrRep function

!define StrRep "!insertmacro StrRep"
!macro StrRep output string old new
    Push `${string}`
    Push `${old}`
    Push `${new}`
    !ifdef __UNINSTALL__
        Call un.StrRep
    !else
        Call StrRep
    !endif
    Pop ${output}
!macroend

!macro Func_StrRep un
    Function ${un}StrRep
        Exch $R2 ;new
        Exch 1
        Exch $R1 ;old
        Exch 2
        Exch $R0 ;string
        Push $R3
        Push $R4
        Push $R5
        Push $R6
        Push $R7
        Push $R8
        Push $R9

        StrCpy $R3 0
        StrLen $R4 $R1
        StrLen $R6 $R0
        StrLen $R9 $R2
        loop:
            StrCpy $R5 $R0 $R4 $R3
            StrCmp $R5 $R1 found
            StrCmp $R3 $R6 done
            IntOp $R3 $R3 + 1 ;move offset by 1 to check the next character
            Goto loop
        found:
            StrCpy $R5 $R0 $R3
            IntOp $R8 $R3 + $R4
            StrCpy $R7 $R0 "" $R8
            StrCpy $R0 $R5$R2$R7
            StrLen $R6 $R0
            IntOp $R3 $R3 + $R9 ;move offset by length of the replacement string
            Goto loop
        done:

        Pop $R9
        Pop $R8
        Pop $R7
        Pop $R6
        Pop $R5
        Pop $R4
        Pop $R3
        Push $R0
        Push $R1
        Pop $R0
        Pop $R1
        Pop $R0
        Pop $R2
        Exch $R1
    FunctionEnd
!macroend
!insertmacro Func_StrRep ""
; !insertmacro Func_StrRep "un."


;--------------------------------
;Include Modern UI

  !include "MUI2.nsh"

;--------------------------------
;General
  !define _VERSION "2.0.5.0"

  ;Name and file
  Name "uGet Chrome Wrapper"
  OutFile "uget-chrome-wrapper_${_VERSION}.exe"

  ;Default installation folder
  InstallDir $PROGRAMFILES\uget-chrome-wrapper

  ;Get installation folder from registry if available
  InstallDirRegKey HKLM "Software\uget-chrome-wrapper" "Install_Dir"

  ;Request application privileges for Windows Vista
  RequestExecutionLevel admin

;--------------------------------
;Interface Settings

  !define MUI_ABORTWARNING

;--------------------------------
;Pages

  !insertmacro MUI_PAGE_LICENSE "../../LICENSE"
  !insertmacro MUI_PAGE_DIRECTORY
  !insertmacro MUI_PAGE_INSTFILES

  !insertmacro MUI_UNPAGE_CONFIRM
  !insertmacro MUI_UNPAGE_INSTFILES

;--------------------------------
;Languages

  !insertmacro MUI_LANGUAGE "English"

;--------------------------------
;Version Information
  VIProductVersion "${_VERSION}"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "ProductName" "uGet Chrome Wrapper"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "Comments" "Integrate uGet download manager with Google Chrome, Chromium, Vivaldi, Opera and Mozilla Firefox"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "CompanyName" "Gobinath"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "LegalCopyright" "Copyright 2016 Gobinath"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "FileDescription" "uGet Chrome Wrapper installer"
  VIAddVersionKey /LANG=${LANG_ENGLISH} "FileVersion" "${_VERSION}"
  
;--------------------------------
; The stuff to install
Section "uget-chrome-wrapper (required)"

	SectionIn RO

	; Set output path to the installation directory.
	SetOutPath $INSTDIR

	; Put the script
	File "..\..\uget-chrome-wrapper\bin\uget-chrome-wrapper"

	Rename $INSTDIR\uget-chrome-wrapper $INSTDIR\uget-chrome-wrapper.py

	; Replace \ by \\ in the installation path
	${StrRep} $0 "$INSTDIR" "\" "\\"
	
	; Create the uget-chrome-wrapper.bat file
	FileOpen $9 $INSTDIR\uget-chrome-wrapper.bat w ;Opens a Empty File an fills it
	FileWrite $9 '@echo off$\r$\ncall python "$0\\uget-chrome-wrapper.py"$\r$\n'
	FileClose $9 ;Closes the filled file

	; Update the com.javahelps.ugetchromewrapper.json file
	FileOpen $9 $INSTDIR\com.javahelps.ugetchromewrapper.json w ;Opens a Empty File an fills it
	FileWrite $9 '{"name":"com.javahelps.ugetchromewrapper","description":"Integrate uGet with Google Chrome","path":"$0\\uget-chrome-wrapper.bat","type":"stdio","allowed_origins":["chrome-extension://efjgjleilhflffpbnkaofpmdnajdpepi/","chrome-extension://akcbnhoidebjpiefdkmaaicfgdpbnoac/"]}$\r$\n'
	FileClose $9 ;Closes the filled file

    ; Update the com.javahelps.ugetfirefoxwrapper.json file
	FileOpen $9 $INSTDIR\com.javahelps.ugetfirefoxwrapper.json w ;Opens a Empty File an fills it
	FileWrite $9 '{"name":"com.javahelps.ugetfirefoxwrapper","description":"Integrate uGet with Mozilla Firefox","path":"$0\\uget-chrome-wrapper.bat","type":"stdio","allowed_extensions":["uget-integration@slgobinath"]}$\r$\n'
	FileClose $9 ;Closes the filled file
	
	; Put the icon
	File "uget-icon.ico"

	; Write the installation path into the registry
	WriteRegStr HKLM SOFTWARE\uget-chrome-wrapper "Install_Dir" "$INSTDIR"
	WriteRegStr HKCU "SOFTWARE\Google\Chrome\NativeMessagingHosts\com.javahelps.ugetchromewrapper" "" "$INSTDIR\com.javahelps.ugetchromewrapper.json"
	WriteRegStr HKLM "SOFTWARE\Google\Chrome\NativeMessagingHosts\com.javahelps.ugetchromewrapper" "" "$INSTDIR\com.javahelps.ugetchromewrapper.json"
	WriteRegStr HKCU "SOFTWARE\Mozilla\NativeMessagingHosts\com.javahelps.ugetfirefoxwrapper" "" "$INSTDIR\com.javahelps.ugetfirefoxwrapper.json"
	WriteRegStr HKLM "SOFTWARE\Mozilla\NativeMessagingHosts\com.javahelps.ugetfirefoxwrapper" "" "$INSTDIR\com.javahelps.ugetfirefoxwrapper.json"


	; Write the uninstall keys for Windows
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper" "DisplayName" "uGet Chrome Wrapper"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper" "Publisher" "Gobinath"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper" "HelpLink" "https://github.com/slgobinath/uget-chrome-wrapper/issues"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper" "URLUpdateInfo" "https://github.com/slgobinath/uget-chrome-wrapper/releases"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper" "URLInfoAbout" "https://slgobinath.github.io/uget-chrome-wrapper/"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper" "DisplayVersion" "${_VERSION}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper" "UninstallString" '"$INSTDIR\uninstall.exe"'
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper" "DisplayIcon" "$INSTDIR\uget-icon.ico,0"
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper" "NoModify" 1
	WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper" "NoRepair" 1
	WriteUninstaller "uninstall.exe"

SectionEnd

;--------------------------------

; Uninstaller

Section "Uninstall"

	; Remove registry keys
	DeleteRegKey HKCU "SOFTWARE\Google\Chrome\NativeMessagingHosts\com.javahelps.ugetchromewrapper"
	DeleteRegKey HKLM "SOFTWARE\Google\Chrome\NativeMessagingHosts\com.javahelps.ugetchromewrapper"
	DeleteRegKey HKCU "SOFTWARE\Mozilla\NativeMessagingHosts\com.javahelps.ugetfirefoxwrapper"
	DeleteRegKey HKLM "SOFTWARE\Mozilla\NativeMessagingHosts\com.javahelps.ugetfirefoxwrapper"
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\uget-chrome-wrapper"
	DeleteRegKey HKLM SOFTWARE\uget-chrome-wrapper

	; Remove files and uninstaller
	Delete $INSTDIR\uget-chrome-wrapper.py
	Delete $INSTDIR\uget-chrome-wrapper.bat
	Delete $INSTDIR\com.javahelps.ugetchromewrapper.json
	Delete $INSTDIR\com.javahelps.ugetfirefoxwrapper.json
	Delete $INSTDIR\uget-icon.ico
	Delete $INSTDIR\uninstall.exe

	; Remove directories used
	RMDir "$INSTDIR"

SectionEnd
