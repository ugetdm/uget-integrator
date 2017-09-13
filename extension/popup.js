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

var current_browser;

try {
	current_browser = browser;
	current_browser.runtime.getBrowserInfo().then(
		function(info) {
			if (info.name === 'Firefox') {
				// Do nothing
			}
		}
	);
} catch (ex) {
	// Not Firefox
	current_browser = chrome;
}

function saveChanges() {
	var keywordsToExclude = document.getElementById("keywordsToExclude").value;
	var keywordsToInclude = document.getElementById("keywordsToInclude").value;
	var interrupt = document.getElementById('chk-interrupt').checked;
	var minFileSize = parseInt(document.getElementById("fileSize").value) * 1024;
	if (isNaN(minFileSize)) {
		minFileSize = 300 * 1024;
	} else if(minFileSize < 0) {
		minFileSize = 0;
	}

	localStorage["uget-keywords-exclude"] = keywordsToExclude;
	localStorage["uget-keywords-include"] = keywordsToInclude;
	localStorage["uget-min-file-size"] = minFileSize;

	current_browser.runtime.getBackgroundPage(function(backgroundPage) {
		backgroundPage.updateKeywords(keywordsToInclude, keywordsToExclude);
		backgroundPage.setInterruptDownload(interrupt, true);
		backgroundPage.updateMinFileSize(minFileSize);
	});

	window.close();
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
	// Show the system status
	current_browser.runtime.getBackgroundPage(function(backgroundPage) {
		var state = backgroundPage.getState();
		// if (state == 0) {
		// 	document.getElementById('info').innerHTML = "Info: Found uGet and uget-chrome-wrapper";
		// } else if (state == 1) {
		// 	document.getElementById('warn').innerHTML = "Warning: Please update the uget-chrome-wrapper to the latest version";
		// } else {
		// 	document.getElementById('error').innerHTML = "Error: Unable to connect to the uget-chrome-wrapper";
		// }
		if (state == 0) {
			// document.getElementById('info').innerHTML = "Info: Found uGet and uget-chrome-wrapper";
			document.getElementById('info').style.display = 'block';
			document.getElementById('warn').style.display = 'none';
			document.getElementById('error').style.display = 'none';
			var element = document.getElementById("element-id");
			element.parentNode.removeChild(element);
		} else if (state == 1) {
			// document.getElementById('warn').innerHTML = "Warning: Please update the uget-chrome-wrapper to the latest version";
			document.getElementById('info').style.display = 'none';
			document.getElementById('warn').style.display = 'block';
			document.getElementById('error').style.display = 'none';
		} else {
			// document.getElementById('error').innerHTML = "Error: Unable to connect to the uget-chrome-wrapper";
			document.getElementById('info').style.display = 'none';
			document.getElementById('warn').style.display = 'none';
			document.getElementById('error').style.display = 'block';
		}
	});

	let interrupt = (localStorage["uget-interrupt"] == "true");
	document.getElementById('save').addEventListener('click', saveChanges);
	document.getElementById('keywordsToExclude').value = localStorage["uget-keywords-exclude"];
	document.getElementById('keywordsToInclude').value = localStorage["uget-keywords-include"];
	document.getElementById('fileSize').value = localStorage["uget-min-file-size"] / 1024;
	document.getElementById('chk-interrupt').checked = interrupt;
});