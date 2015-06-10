var left = 'left';
var right = 'right';
var CWM = 'CWM';
var leftId;
var rightId;

var resize = function (windowId) {
	getFromStorage(CWM, function(json){
		var leftId = json[CWM].leftId;
		var rightId = json[CWM].rightId;
		if(leftId && rightId){
			if(windowId === leftId || windowId === rightId){

				// screen parms
				var large = Math.round(screen.width * .83);
				var small = Math.round(screen.width * .17);
				var height = screen.height;

				// scaling and offset for focus and fade windows
				var scaleDown;
				var focusOffset;
				var fadeOffset;

				if(windowId === leftId){
					scaleDown = rightId;
					focusOffset = 0;
					fadeOffset = large;
				}else{
					scaleDown = leftId;
					focusOffset = small;
					fadeOffset = 0;
				}

				chrome.windows.update(windowId, {
					left: focusOffset,
					top: 0,
					width : large,
					height : height
				});

				chrome.windows.update(scaleDown, {
					left: fadeOffset,
					top: 0,
					width : small,
					height : height
				});
			}else{
				console.log('you dont have any windows designated');
				return;
			}
		}else{
			// do something to show that left and right haven't been designated
		}
	});
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
};

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
