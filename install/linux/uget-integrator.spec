%define debug_package %{nil}

%global srcname uget-integrator

Summary:	Integrate uGet Download Manager with various browsers
Name:		uget-integrator
Version:	1.0.0
Release:	1%{?dist}
License:	GPLv3+
Group:		Networking/File transfer
URL:		https://github.com/ugetdm/uget-integrator

%undefine _disable_source_fetch
Source0:	https://github.com/ugetdm/%{srcname}/archive/v%{version}.tar.gz
%define		SHA256SUM0 bbc85c32d94e2b6a21977c559f6e49cea9613028713df89e91327a23fef19fa9


BuildArch: noarch
Requires:   python3
Requires:   uget

%description
Integrate uGet Download Manager with Google Chrome,
Chromium, Opera, Vivaldi and Mozilla Firefox

Note: Before using this application please install
uget-extension for your browser from your browser's
extension site/page.

%prep
echo "%SHA256SUM0 %SOURCE0" | sha256sum -c -
%autosetup -n %{srcname}-%{version}

%build

%install
mkdir -p %{buildroot}%{_bindir}
mkdir -p %{buildroot}%{_sysconfdir}/{chromium,opt/chrome,opera}/native-messaging-hosts
mkdir -p %{buildroot}%{_libdir}/mozilla/native-messaging-hosts

install -m755 bin/%{name} %{buildroot}%{_bindir}/%{name}
install -m644 conf/com.ugetdm.chrome.json \
    %{buildroot}%{_sysconfdir}/chromium/native-messaging-hosts/com.ugetdm.chrome.json
    
ln -s %{_sysconfdir}/chromium/native-messaging-hosts/com.ugetdm.chrome.json \
    %{buildroot}%{_sysconfdir}/opt/chrome/native-messaging-hosts/com.ugetdm.chrome.json
ln -s %{_sysconfdir}/chromium/native-messaging-hosts/com.ugetdm.chrome.json \
    %{buildroot}%{_sysconfdir}/opera/native-messaging-hosts/com.ugetdm.chrome.json

install -m644 conf/com.ugetdm.firefox.json \
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
%config(noreplace) %{_sysconfdir}/chromium/native-messaging-hosts/com.ugetdm.chrome.json
%dir %{_sysconfdir}/opt/chrome/native-messaging-hosts
%config(noreplace) %{_sysconfdir}/opt/chrome/native-messaging-hosts/com.ugetdm.chrome.json
%dir %{_sysconfdir}/opera/native-messaging-hosts
%config(noreplace) %{_sysconfdir}/opera/native-messaging-hosts/com.ugetdm.chrome.json
%dir %{_libdir}/mozilla/native-messaging-hosts
%{_libdir}/mozilla/native-messaging-hosts/com.ugetdm.firefox.json


%changelog
* Sat Jan 12 2019 Håkon Løvdal <kode@denkule.no> 1.0.0-1.fc29
- Updated for Fedora 29.

* Sun Sep 23 2018 umeabot <umeabot> 1.0.0-2.mga7
  (not released yet)
+ Revision: 1301506
- Mageia 7 Mass Rebuild

* Sat Mar 24 2018 tarakbumba <tarakbumba> 1.0.0-1.mga7
+ Revision: 1211781
- imported package uget-integrator

