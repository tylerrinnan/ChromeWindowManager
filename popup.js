

function renderSelectors(statusText) {
	document.getElementById('selector').textContent = statusText;
}

var currTabs;
var currWindow;
var stop = 50;
var counter = 0;

var resize = function (window, sizeToResizeBy) {
	if (counter < stop) {
		counter++;
		chrome.windows.update(window.id, {
			width : window.width + sizeToResizeBy,
			height : window.height
		}, function (win) {
			resize(win, sizeToResizeBy);
		});
		//console.log(counter);
	} else {
		//console.log('made it out of the loop');
	}
};

var bindEventHandlers = function () {
	$('#left').bind('click', function () {
		locationSelectorHandler(0)
	});
	$('#right').bind('click', function () {
		locationSelectorHandler(1)
	});
};

var updateResizeHandler = function () {
	var $update = $('#update');
	
	if($update === []){
		console.log('updateResizeHandler, update textbox not found');
		return;
	}
	
	var val = $update.val();
	$update.val('');
	
	if(val){
		saveToStorage()
	}
	
	
	
};

var locationSelectorHandler = function (position) {
	var storage = chrome.storage.sync;
	if (storage) {
		if (position !== undefined && position !== null) {
			chrome.windows.getCurrent(function (win) {
				var orientation;
				switch (position) {
				case 0:
					orientation = 'left';
					break;
				case 1:
					orientation = 'right'
						break;
				default:
					console.log('locationSelectorHandler, unrecognized position value: ' + position);
					return;
				}
				var json = {};
				json['pr_' + win.id] = {
					"orientation" : orientation,
					"oWidth" : win.width,
					"oHeight" : win.Height
				};

				saveToStorage(json, function () {
					//do nothing with callback.
					//there is a listener bound to storage that will notify the user when storage has been modified.
				});
			});
		} else {
			console.log('locationSelectorHandler, passed falsy parm: ' + position);
		}
	} else {
		console.log('locationSelectorHandler, chrome storage not available, value: ' + storage);
	}
};

// Takes an object in the following format {'key': 'value'}
var saveToStorage = function(obj, callback){
	var storage = getChromeStorage();
	if(obj){
		storage.set(obj, callback);
	}else{
		console.log('saveToStorage, falsy parm passed: ' + obj);
	}
}

var getFromStorage = function(key){
	var storage = getChromeStorage();
	if(!key || key.length <= 0){
		console.log('getFromStorage, invalid key: ' + key);
		return;
	}
	
	$.when(storage.get(key, function(obj){
		return obj;
	})).done(function(value){
		alert(value);
	});
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
	 for (key in changes) {
		 var storageChange = changes[key];
		 console.log('Storage key "%s" in namespace "%s" changed. ' +
			 'Old value was "%s", new value is "%s".',
			 key,
			 namespace,
			 storageChange.oldValue,
			 storageChange.newValue);
	 }	
});

var getChromeStorage = function(){
	if(chrome && chrome.storage && chrome.storage.sync){
		return chrome.storage.sync;
	}else{
		console.log('getChromeStorage, chrome storage not available. Check manifest.json');
	}
}

document.addEventListener('DOMContentLoaded', function () {
	bindEventHandlers();
});




// document.addEventListener('DOMContentLoaded', function () {
	// // chrome.windows.getCurrent(function (win) {
		// // currWindow = win;
		
		// // //TODO: tabs not necessary right now, but nice to have stored.
		// // chrome.tabs.getAllInWindow(win.id, function (tabs) {
			// // currTabs = tabs;
			// // resize(win, 1);
		// // }); 
	// // });
// });


// // Copyright (c) 2014 The Chromium Authors. All rights reserved.
// // Use of this source code is governed by a BSD-style license that can be
// // found in the LICENSE file.

// /**
 // * Get the current URL.
 // *
 // * @param {function(string)} callback - called when the URL of the current tab
 // *   is found.
 // **/
// function getCurrentTabUrl(callback) {
	// // Query filter to be passed to chrome.tabs.query - see
	// // https://developer.chrome.com/extensions/tabs#method-query
	// var queryInfo = {
		// active : true,
		// currentWindow : true
	// };

	// chrome.tabs.query(queryInfo, function (tabs) {
		// // chrome.tabs.query invokes the callback with a list of tabs that match the
		// // query. When the popup is opened, there is certainly a window and at least
		// // one tab, so we can safely assume that |tabs| is a non-empty array.
		// // A window can only have one active tab at a time, so the array consists of
		// // exactly one tab.
		// var tab = tabs[0];

		// // A tab is a plain object that provides information about the tab.
		// // See https://developer.chrome.com/extensions/tabs#type-Tab
		// var url = tab.url;

		// // tab.url is only available if the "activeTab" permission is declared.
		// // If you want to see the URL of other tabs (e.g. after removing active:true
		// // from |queryInfo|), then the "tabs" permission is required to see their
		// // "url" properties.
		// console.assert(typeof url == 'string', 'tab.url should be a string');

		// callback(url);
	// });

	// // Most methods of the Chrome extension APIs are asynchronous. This means that
	// // you CANNOT do something like this:
	// //
	// // var url;
	// // chrome.tabs.query(queryInfo, function(tabs) {
	// //   url = tabs[0].url;
	// // });
	// // alert(url); // Shows "undefined", because chrome.tabs.query is async.
// }

// /**
 // * @param {string} searchTerm - Search term for Google Image search.
 // * @param {function(string,number,number)} callback - Called when an image has
 // *   been found. The callback gets the URL, width and height of the image.
 // * @param {function(string)} errorCallback - Called when the image is not found.
 // *   The callback gets a string that describes the failure reason.
 // */
// function getImageUrl(searchTerm, callback, errorCallback) {
	// // Google image search - 100 searches per day.
	// // https://developers.google.com/image-search/
	// var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
		// '?v=1.0&q=' + encodeURIComponent(searchTerm);
	// var x = new XMLHttpRequest();
	// x.open('GET', searchUrl);
	// // The Google image search API responds with JSON, so let Chrome parse it.
	// x.responseType = 'json';
	// x.onload = function () {
		// // Parse and process the response from Google Image Search.
		// var response = x.response;
		// if (!response || !response.responseData || !response.responseData.results ||
			// response.responseData.results.length === 0) {
			// errorCallback('No response from Google Image search!');
			// return;
		// }
		// var firstResult = response.responseData.results[0];
		// // Take the thumbnail instead of the full image to get an approximately
		// // consistent image size.
		// var imageUrl = firstResult.tbUrl;
		// var width = parseInt(firstResult.tbWidth);
		// var height = parseInt(firstResult.tbHeight);
		// console.assert(
			// typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
			// 'Unexpected respose from the Google Image Search API!');
		// callback(imageUrl, width, height);
	// };
	// x.onerror = function () {
		// errorCallback('Network error.');
	// };
	// x.send();
// }




	// getCurrentTabUrl(function(url) {
	// // Put the image URL in Google search.
	// renderStatus('Performing Google Image search for ' + url);

	// getImageUrl(url, function(imageUrl, width, height) {

	// renderStatus('Search term: ' + url + '\n' +
	// 'Google image search result: ' + imageUrl);
	// var imageResult = document.getElementById('image-result');
	// // Explicitly set the width/height to minimize the number of reflows. For
	// // a single image, this does not matter, but if you're going to embed
	// // multiple external images in your page, then the absence of width/height
	// // attributes causes the popup to resize multiple times.
	// imageResult.width = width;
	// imageResult.height = height;
	// imageResult.src = imageUrl;
	// imageResult.hidden = false;

	// }, function(errorMessage) {
	// renderStatus('Cannot display image. ' + errorMessage);
	// });
	// });

