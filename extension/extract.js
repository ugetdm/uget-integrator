/*
 * uget-chrome-wrapper is an extension to integrate uGet Download manager
 * with Google Chrome, Chromium, Vivaldi and Opera in Linux and Windows.
 *
 * Copyright (C) 2017  Gobinath
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

extract();

function extract() {
    var txt = '';
    urls = []
    for (var i = 0; i < document.links.length; i++) {
        url = document.links[i].href;
        var valid = /^(ftp|http|https):\/\/[^ "]+$/.test(url);
        if(valid) {
            var decodedURL = unescape(url);
            if(urls.indexOf(decodedURL) < 0) {
                urls.push(decodedURL);
                txt += url + '\n';
            }
        }
    }
    
    if(txt !== '') {
        return {success: true, urls: txt};
    }
    return {success: false, urls: ""};
}