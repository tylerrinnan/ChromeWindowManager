var left = 'left';
var right = 'right';
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

var designateOrienation = function (event) {
		chrome.windows.getCurrent(function (win) {
			var orientation = event.toElement.dataset.orientation
			if(orientation == left){
				leftId = win.id;
			}else if(orientation == right){
				rightId = win.id;
			}else{
				//tampered with data values
				console.log('messing with data values will cause CWM to work incorrectly...');
				return;
			}
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

// var json = {};
// json['pr_' + win.id] = {
// 	"orientation" : event.toElement.dataset.orientation,
// };
//
// saveToStorage(json, function () {
// 	//do nothing with callback.
// 	//there is a listener bound to storage that will notify the user when storage has been modified.
// });

// // Takes an object in the following format {'key': 'value'}
// var saveToStorage = function(obj, callback){
// 	var storage = getChromeStorage();
// 	if(obj){
// 		storage.set(obj, callback);
// 	}else{
// 		console.log('saveToStorage, falsy parm passed: ' + obj);
// 	}
// }
//
// var getFromStorage = function(key){
// 	var storage = getChromeStorage();
// 	if(!key || key.length <= 0){
// 		console.log('getFromStorage, invalid key: ' + key);
// 		return;
// 	}
//
// 	storage.get(key, function(obj){
// 		console.log(obj["pr_1"].orientation);
// 	});
// };
//
// var getChromeStorage = function(){
// 	if(chrome && chrome.storage && chrome.storage.sync){
// 		return chrome.storage.sync;
// 	}else{
// 		console.log('getChromeStorage, chrome storage not available. Check manifest.json');
// 	}
// }



// chrome.storage.onChanged.addListener(function (changes, namespace) {
// 	 for (key in changes) {
// 		 var storageChange = changes[key];
// 		 console.log('Storage key "%s" in namespace "%s" changed. ' +
// 			 'Old value was "%s", new value is "%s".',
// 			 key,
// 			 namespace,
// 			 storageChange.oldValue,
// 			 storageChange.newValue);
// 	 };
// }
