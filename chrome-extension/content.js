/*
* uget-chrome-wrapper is an extension to integrate uGet Download manager
* with Google Chrome, Chromium and Vivaldi in Linux and Windows.
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

window.onkeydown = function(event) {
    if (event.keyCode == 45) { // Insert
        chrome.extension.sendRequest({ message: 'disable' });
    }
};

window.onkeyup = function(event) {
    if (event.keyCode == 45) { // Insert
       chrome.extension.sendRequest({ message: 'enable' });
    } else if (event.keyCode == 85 && event.ctrlKey && event.shiftKey) { // Ctrl + Shift + U
        chrome.extension.sendRequest({ message: 'toggle' });
    }
};