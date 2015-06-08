var left = 'left';
var right = 'right';
var CWM = 'CWM';
var leftId;
var rightId;
var maxWidth = 9999; // chrome will resize to its maximum limit
var minWidth = 0; // chrome will resize to its minimum limit

var resize = function (window) {
	if(!leftId || !rightId){
		console.log('you dont have any windows designated');
		return;
	}

	if(window.id === leftId){
		chrome.windows.update(window.id, {
			width : 900,
			height : window.height
		});
	}else if(window.id === rightId){
		console.log('would have resized right side');
	}

};

var bindEventHandlers = function () {
	$('#orientation button').bind('click', function (event) {
		designateOrienation(event);
	})
};

/*
Designates the window orientation 'left' or 'right' depending on user input.
*/
var designateOrienation = function (event) {
		chrome.windows.getCurrent(function (win) {
			getFromStorage(CWM, function(json){
				var cwm = json;

				// Initializes object if storage does not have key
				if(!cwm[CWM]){
					cwm[CWM] = {
						leftId: null,
						rightId: null
					};
				}

				// Set the new window orientation before updating
				// If id is used for both 'right' and 'left', disable old destigation by assigning null
				if(event.toElement.dataset.orientation === left){
					cwm[CWM].leftId = win.id

					if(cwm[CWM].leftId === cwm[CWM].rightId){
						cwm[CWM].rightId = null;
					}
				}else{
					cwm[CWM].rightId = win.id;

					if(cwm[CWM].rightId === cwm[CWM].leftId){
						cwm[CWM].leftId = null;
					}
				}
				saveToStorage(cwm);
			});
		});
};

//bind event listeners:
document.addEventListener('DOMContentLoaded', function () {
	bindEventHandlers();
});

chrome.windows.onFocusChanged.addListener(function(windowId){
	if(windowId == chrome.windows.WINDOW_ID_NONE){
		//do nothing, focus has lost all chrome windows
		return;
	};

	resize(windowId);
});

// Takes an object in the following format {'key': 'value'}
var saveToStorage = function(obj, callback){
	var storage = getChromeStorage();
	if(obj){
		storage.set(obj, callback);
	}else{
		console.log('saveToStorage, falsy parm passed: ' + obj);
	}
}

//callback should have parm of items (which is response from storage)
var getFromStorage = function(key, callback){
	var storage = getChromeStorage();
	if(!key || key.length <= 0){
		console.log('getFromStorage, invalid key: ' + key);
		return;
	}

	storage.get(key, callback);
};

var getChromeStorage = function(){
	if(chrome && chrome.storage && chrome.storage.sync){
		return chrome.storage.sync;
	}else{
		console.log('getChromeStorage, chrome storage not available. Check manifest.json');
	}
}

/* TESTING PURPOSES, uncomment this code block to view changes to chrome storage.
chrome.storage.onChanged.addListener(function (changes, namespace) {
	 for (key in changes) {
		 var storageChange = changes[key];
		 console.log('Storage key "%s" in namespace "%s" changed. ' +
			 'Old value was "%s", new value is "%s".',
			 key,
			 namespace,
			 storageChange.oldValue,
			 storageChange.newValue);
	 };
});
*/
