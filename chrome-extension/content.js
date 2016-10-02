var value = "true";
window.onkeydown = function(event) {
    if (event.keyCode == 45) {
        value = "false";
        chrome.extension.sendRequest({ enableEXT: value });
    }

};
window.onkeyup = function(event) {
    if (event.keyCode == 45) {
        value = "true";
        chrome.extension.sendRequest({ enableEXT: value });
    }
};
