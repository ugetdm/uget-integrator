/*
 * uget-chrome-wrapper is an extension to integrate uGet Download manager
 * with Google Chrome, Chromium, Vivaldi and Opera in Linux and Windows.
 *
 * Copyright (C) 2016  Gobinath
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// TODO: LocalStorage support for Firefox (how does this work here?)

var interruptDownloads = true;
var ugetWrapperNotFound = true;
var disposition = '';
var hostName = 'com.javahelps.ugetchromewrapper';
var ugetChromeWrapperVersion;
var ugetVersion;
var chromeVersion;
var firefoxVersion;
var current_browser;
var filter = [];
var keywords = [];
var requestList = [{
	cookies: '',
	postdata: '',
	id: ''
}, {
	cookies: '',
	postdata: '',
	id: ''
}, {
	cookies: '',
	postdata: '',
	id: ''
}];
var currRequest = 0;
try {
	chromeVersion = /Chrome\/([0-9]+)/.exec(navigator.userAgent)[1];
} catch (ex) {
	chromeVersion = 33;
}
try {
	current_browser = browser;
	current_browser.runtime.getBrowserInfo().then(
		function(info) {
			if (info.name === 'Firefox') {
				firefoxVersion = info.version.replace(/[ab]\d+/, '');
			}
		}
	);
} catch (ex) {
	console.log('No firefox');
	firefoxVersion = 0;
	current_browser = chrome;
}

chromeVersion = parseInt(chromeVersion);
sendMessageToHost({
	version: "2.0.3"
});

if (localStorage["uget-keywords"]) {
	keywords = localStorage["uget-keywords"].split(/[\s,]+/);
} else {
	localStorage["uget-keywords"] = '';
}


if (!localStorage["uget-interrupt"]) {
	localStorage["uget-interrupt"] = 'true';
} else {
	var interrupt = (localStorage["uget-interrupt"] == "true");
	setInterruptDownload(interrupt);
}
// Message format to send the download information to the uget-chrome-wrapper
var message = {
	url: '',
	cookies: '',
	useragent: '',
	filename: '',
	filesize: '',
	referrer: '',
	postdata: ''
};

// Listen to the key press
current_browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	var msg = request.message;
	if (msg === 'enable') {
		// Temporarily enable
		setInterruptDownload(true);
	} else if (msg == 'disable') {
		// Temporarily disable
		setInterruptDownload(false);
	} else {
		// Toggle
		setInterruptDownload(!interruptDownloads, true);
	}
});

// Send message to the uget-chrome-wrapper
function sendMessageToHost(message) {
	current_browser.runtime.sendNativeMessage(hostName, message, function(response) {
		ugetWrapperNotFound = (response == null);
		if (!ugetWrapperNotFound && !ugetChromeWrapperVersion) {
			ugetChromeWrapperVersion = response.version;
			ugetVersion = response.uget;
		}
	});
}

function getInfo() {
	if (ugetWrapperNotFound || !ugetChromeWrapperVersion) {
		return "Error: Unable to connect to the uget-chrome-wrapper";
	} else if (!ugetChromeWrapperVersion.startsWith("2.")) {
		return "Warning: Please update the uget-chrome-wrapper to the latest version";
	} else {
		return "Info: Found uGet: " + ugetVersion + " and uget-chrome-wrapper: " + ugetChromeWrapperVersion;
	}
}

function clearMessage() {
	message.url = '';
	message.cookies = '';
	message.filename = '';
	message.filesize = '';
	message.referrer = '';
	message.useragent = '';
}

function postParams(source) {
	var array = [];
	for (var key in source) {
		array.push(encodeURIComponent(key) + '=' + encodeURIComponent(source[key]));
	}
	return array.join('&');
}

// Add to Chrome context menu
current_browser.contextMenus.create({
	title: 'Download with uGet',
	id: "download_with_uget",
	contexts: ['link']
});

current_browser.contextMenus.onClicked.addListener(function(info, tab) {
	"use strict";
	if (info.menuItemId === "download_with_uget") {
		clearMessage();
		message.url = info['linkUrl'];
		message.referrer = info['pageUrl'];
		sendMessageToHost(message);
		clearMessage();
	}
});

// Interrupt downloads on creation
current_browser.downloads.onCreated.addListener(function(downloadItem) {

	if (ugetWrapperNotFound || !interruptDownloads) { // uget-chrome-wrapper not installed
		return;
	}

	var fileSize = downloadItem['fileSize'];

	if (fileSize != -1 && fileSize < 300000) { // 300 kb
		return;
	}

	var url = '';
	if (chromeVersion >= 54) {
		url = downloadItem['finalUrl'];
	} else {
		url = downloadItem['url'];
	}

	if (!url) {
		return;
	}

	if (isBlackListed(url)) {
		return;
	}

	// Cancel the download
	current_browser.downloads.cancel(downloadItem.id).then(
		function() {
			// Erase the download from list
			current_browser.downloads.erase({
				id: downloadItem.id
			}); // ignore callbacks
		}
	);

	clearMessage();
	message.url = url;
	message.filename = downloadItem['filename'];
	message.filesize = fileSize;
	message.referrer = downloadItem['referrer'];
	sendMessageToHost(message);
});

current_browser.webRequest.onBeforeRequest.addListener(function(details) {
	if (details.method === 'POST') {
		message.postdata = postParams(details.requestBody.formData);
	}
	return {
		requestHeaders: details.requestHeaders
	};
}, {
	urls: [
		'<all_urls>'
	],
	types: [
		'main_frame',
		'sub_frame'
	]
}, [
	'blocking',
	'requestBody'
]);
current_browser.webRequest.onBeforeSendHeaders.addListener(function(details) {
	clearMessage();
	currRequest++;
	if (currRequest > 2)
		currRequest = 2;
	requestList[currRequest].id = details.requestId;
	for (var i = 0; i < details.requestHeaders.length; ++i) {
		if (details.requestHeaders[i].name.toLowerCase() === 'user-agent') {
			message.useragent = details.requestHeaders[i].value;
		} else if (details.requestHeaders[i].name.toLowerCase() === 'referer') {
			requestList[currRequest].referrer = details.requestHeaders[i].value;
		} else if (details.requestHeaders[i].name.toLowerCase() === 'cookie') {
			requestList[currRequest].cookies = details.requestHeaders[i].value;
		}
	}
	return {
		requestHeaders: details.requestHeaders
	};
}, {
	urls: [
		'<all_urls>'
	],
	types: [
		'main_frame',
		'sub_frame',
		'xmlhttprequest'
	]
}, [
	'blocking',
	'requestHeaders'
]);
current_browser.webRequest.onHeadersReceived.addListener(function(details) {

	if (ugetWrapperNotFound) { // uget-chrome-wrapper not installed
		return {
			responseHeaders: details.responseHeaders
		};
	}

	if (!details.statusLine.includes("200")) { // HTTP response is not OK
		return {
			responseHeaders: details.responseHeaders
		};
	}

	if (isBlackListed(details.url)) {
		return {
			responseHeaders: details.responseHeaders
		};
	}

	var interruptDownload = false;
	message.url = details.url;
	var contentType = "";

	for (var i = 0; i < details.responseHeaders.length; ++i) {
		if (details.responseHeaders[i].name.toLowerCase() == 'content-length') {
			message.filesize = details.responseHeaders[i].value;
			var fileSize = parseInt(message.filesize);
			if (fileSize < 300000) { // 300 kb
				return {
					responseHeaders: details.responseHeaders
				};
			}
		} else if (details.responseHeaders[i].name.toLowerCase() == 'content-disposition') {
			disposition = details.responseHeaders[i].value;
			if (disposition.lastIndexOf('filename') != -1) {
				message.filename = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1];
				message.filename = message.filename.replace(/["']/g, "");
				interruptDownload = true;
			}
		} else if (details.responseHeaders[i].name.toLowerCase() == 'content-type') {
			contentType = details.responseHeaders[i].value;
			if (/\b(?:xml|rss|javascript|json|html|text)\b/.test(contentType)) {
				interruptDownload = false;
				return {
					responseHeaders: details.responseHeaders
				};
			} else if (/\b(?:application\/|video\/|audio\/)\b/.test(contentType) == true) {
				interruptDownload = true;
			} else {
				return {
					responseHeaders: details.responseHeaders
				};
			}
		}
	}
	if (interruptDownload && interruptDownloads) {
		for (var i = 0; i < filter.length; i++) {
			if (filter[i] != "" && contentType.lastIndexOf(filter[i]) != -1) {
				return {
					responseHeaders: details.responseHeaders
				};
			}
		}
		for (var j = 0; j < 3; j++) {
			if (details.requestId == requestList[j].id && requestList[j].id != "") {
				message.referrer = requestList[j].referrer;
				message.cookies = requestList[j].cookies;
				break;
			}
		}
		if (details.method != "POST") {
			message.postdata = '';
		}
		sendMessageToHost(message);
		message.postdata = '';
		var scheme = /^https/.test(details.url) ? 'https' : 'http';
		if (chromeVersion >= 35 || firefoxVersion >= 51) {
			return {
				redirectUrl: "javascript:"
			};
		} else if (details.frameId === 0) {
			current_browser.tabs.update(details.tabId, {
				url: "javascript:"
			});
			var responseHeaders = details.responseHeaders.filter(function(header) {
				var name = header.name.toLowerCase();
				return name !== 'content-type' &&
					name !== 'x-content-type-options' &&
					name !== 'content-disposition';
			}).concat([{
				name: 'Content-Type',
				value: 'text/plain'
			}, {
				name: 'X-Content-Type-Options',
				value: 'nosniff'
			}]);
			return {
				responseHeaders: responseHeaders
			};
		}
		return {
			cancel: true
		};
	}
	clearMessage();
	return {
		responseHeaders: details.responseHeaders
	};
}, {
	urls: [
		'<all_urls>'
	],
	types: [
		'main_frame',
		'sub_frame'
	]
}, [
	'responseHeaders',
	'blocking'
]);

function updateKeywords(data) {
	keywords = data.split(/[\s,]+/);
}

function isBlackListed(url) {
	if (url.includes("//docs.google.com/") || url.includes("googleusercontent.com/docs")) { // Cannot download from Google Docs
		return true;
	}
	for (var keyword of keywords) {
		if (url.includes(keyword)) {
			return true;
		}
	}
	return false;
}


function setInterruptDownload(interrupt, writeToStorage) {
	interruptDownloads = interrupt;
	if (interrupt) {
		current_browser.browserAction.setIcon({
			path: "./icon_32.png"
		});
	} else {
		current_browser.browserAction.setIcon({
			path: "./icon_disabled_32.png"
		});
	}
	if (writeToStorage) {
		localStorage["uget-interrupt"] = interrupt.toString();
	}
}
