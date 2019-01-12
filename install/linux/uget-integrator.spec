Summary:	Integrate uGet Download Manager with various browsers
Name:		uget-integrator
Version:	1.0.0
Release:	%mkrel 2
License:	GPLv3+
Group:		Networking/File transfer
URL:		https://github.com/ugetdm/uget-integrator
Source0:	https://raw.githubusercontent.com/ugetdm/%{name}/v%{version}/bin/%{name}
Source1:    https://raw.githubusercontent.com/ugetdm/%{name}/v%{version}/conf/com.ugetdm.chrome.json
Source2:    https://raw.githubusercontent.com/ugetdm/%{name}/v%{version}/conf/com.ugetdm.firefox.json

Requires:   python3
Requires:   uget

%description
Integrate uGet Download Manager with Google Chrome,
Chromium, Opera, Vivaldi and Mozilla Firefox

Note: Before using this application please install
uget-extension for your browser from your browser's
extension site/page.

%prep
%build

%install
mkdir -p %{buildroot}%{_bindir}
mkdir -p %{buildroot}%{_sysconfdir}/{chromium,opt/chrome,opera}/native-messaging-hosts
mkdir -p %{buildroot}%{_libdir}/mozilla/native-messaging-hosts

install -m755 %{_sourcedir}/%{name} %{buildroot}%{_bindir}/%{name}
install -m644 %{_sourcedir}/com.ugetdm.chrome.json \
    %{buildroot}%{_sysconfdir}/chromium/native-messaging-hosts/com.ugetdm.chrome.json
    
ln -s %{_sysconfdir}/chromium/native-messaging-hosts/com.ugetdm.chrome.json \
    %{buildroot}%{_sysconfdir}/opt/chrome/native-messaging-hosts/com.ugetdm.chrome.json
ln -s %{_sysconfdir}/chromium/native-messaging-hosts/com.ugetdm.chrome.json \
    %{buildroot}%{_sysconfdir}/opera/native-messaging-hosts/com.ugetdm.chrome.json

install -m644 %{_sourcedir}/com.ugetdm.firefox.json \
    %{buildroot}%{_libdir}/mozilla/native-messaging-hosts/com.ugetdm.firefox.json
    
cat > README.install.urpmi <<EOF

INSTALLATION NOTE:
Before using this application please install uget-extension
for your browser from your browser's extension site/page.
EOF


%files
%license LICENSE
%doc  README.install.urpmi
%{_bindir}/%{name}
%dir %{_sysconfdir}/chromium/native-messaging-hosts
%{_sysconfdir}/chromium/native-messaging-hosts/com.ugetdm.chrome.json
%dir %{_sysconfdir}/opt/chrome/native-messaging-hosts
%{_sysconfdir}/opt/chrome/native-messaging-hosts/com.ugetdm.chrome.json
%dir %{_sysconfdir}/opera/native-messaging-hosts
%{_sysconfdir}/opera/native-messaging-hosts/com.ugetdm.chrome.json
%dir %{_libdir}/mozilla/native-messaging-hosts
%{_libdir}/mozilla/native-messaging-hosts/com.ugetdm.firefox.json


%changelog
* Sun Sep 23 2018 umeabot <umeabot> 1.0.0-2.mga7
  (not released yet)
+ Revision: 1301506
- Mageia 7 Mass Rebuild

* Sat Mar 24 2018 tarakbumba <tarakbumba> 1.0.0-1.mga7
+ Revision: 1211781
- imported package uget-integrator

