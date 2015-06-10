var left = 'left';
var right = 'right';
var CWM = 'CWM';

var resize = function (windowId) {
	getFromStorage(CWM, function(json){
		if(isEmpty(json) || !json){
			return;
		}
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
				return;
			}
		}else{
			// do something to show that left and right haven't been designated
		}
	});
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

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }

    return true;
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
