// uget-chrome-wrapper is an extension to integrate uGet Download manager
// with Google Chrome in Linux systems.

var enableExtension = true;
var ugetWrapperNotFound = true;
var interruptDownload = false;
var disposition = '';
var hostName = 'com.javahelps.ugetchromewrapper';
var chromeVersion;
var filter = [];
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
chromeVersion = parseInt(chromeVersion);
sendMessageToHost({ version: "1.0" });


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
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.enableEXT == 'false')
        enableExtension = false;
    else
        enableExtension = true;
});

// Send message to the uget-chrome-wrapper
function sendMessageToHost(message) {
    chrome.runtime.sendNativeMessage(hostName, message, function(response) {
        ugetWrapperNotFound = (response == null);
    });
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
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    if (details.method == 'POST') {
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
chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
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
chrome.webRequest.onHeadersReceived.addListener(function(details) {

    if (ugetWrapperNotFound) {  // uget-chrome-wrapper not installed
        return {
            responseHeaders: details.responseHeaders
        };
    }

    if (!details.statusLine.includes("200")) {    // HTTP response is not OK
        return {
            responseHeaders: details.responseHeaders
        };
    }

    interruptDownload = false;
    message.url = details.url;
    var contentType = "";

    if (details.url.includes("//docs.google.com/")) {    // Cannot download from Google Docs
        return {
            responseHeaders: details.responseHeaders
        };
    }

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
    if (interruptDownload == true && enableExtension == true) {
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
        if (chromeVersion >= 35) {
            return { redirectUrl: "javascript:" };
        } else if (details.frameId === 0) {
            chrome.tabs.update(details.tabId, {
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
    enableExtension == true;
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
