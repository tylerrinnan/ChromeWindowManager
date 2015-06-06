

function renderSelectors(statusText) {
	document.getElementById('selector').textContent = statusText;
}

var currTabs;
var currWindow;
var maxWidth = 9999; // chrome will resize to its maximum limit, therefore 9999 is fine
var minWidth = 0; // chrome will resize to its minimum limit, therefore 0 is fine
var counter = 0;

// var resize = function (window, resizeBy) {
// 	if (counter < stop) {
// 		counter++;
// 		chrome.windows.update(window.id, {
// 			width : window.width + resizeBy,
// 			height : window.height
// 		}, function (win) {
// 			resize(win, sizeToResizeBy);
// 		});
// 		//console.log(counter);
// 	} else {
// 		//console.log('made it out of the loop');
// 	}
// };

var resize = function (window, resizeBy, minOrMax) {
		var width = minOrMax === 0 ? minWidth : maxWidth;
		chrome.windows.update(window.id, {
			width : width,
			height : window.height
		}, function (win) {
			//do nothing here.
		})
};

var bindEventHandlers = function () {
	$('#orientation button').bind('click', function (event) {
		designateOrienation(event);
	});

	$('#update').on('click', {value: this}, function (event) {
		updateResizeHandler();
	});
};

var updateResizeHandler = function () {
	var $resizeInput = $('#resizeInput');

	if($resizeInput === []){
		console.log('updateResizeHandler, update textbox not found');
		return;
	}

	//Grab the value to store, and clear out the textbox
	//TODO: Move this out into it's own function
	var val = $resizeInput.val();
	$resizeInput.val('');

	if(val){
		saveToStorage()
	};
};

var designateOrienation = function (event) {
		chrome.windows.getCurrent(function (win) {
			var json = {};
			json['pr_' + win.id] = {
				"orientation" : event.toElement.dataset.orientation,
			};

			saveToStorage(json, function () {
				//do nothing with callback.
				//there is a listener bound to storage that will notify the user when storage has been modified.
			});
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

var getFromStorage = function(key){
	var storage = getChromeStorage();
	if(!key || key.length <= 0){
		console.log('getFromStorage, invalid key: ' + key);
		return;
	}

	storage.get(key, function(obj){
		console.log(obj["pr_1"].orientation);
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
