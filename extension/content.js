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

window.onkeydown = function(event) {
    if (event.keyCode == 45) { // Insert
        current_browser.runtime.sendMessage({ message: 'disable' });
    }
};

window.onkeyup = function(event) {
    if (event.keyCode == 45) { // Insert
        current_browser.runtime.sendMessage({ message: 'enable' });
    } else if (event.keyCode == 85 && event.ctrlKey && event.shiftKey) { // Ctrl + Shift + U
        current_browser.runtime.sendMessage({ message: 'toggle' });
    }
};