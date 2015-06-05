

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



