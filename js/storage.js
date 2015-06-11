//takes an object in the following format {'key': 'value'}
//validates input and calls chrome storage set
function saveToStorage(obj, callback) {
  var storage = getChromeStorage();
  if (obj) {
    storage.set(obj, callback);
  } else {
    console.log('saveToStorage, falsy parm passed: ' + obj);
  }
}

//validates key and calls chrome storage get
function getFromStorage(key, callback) {
  var storage = getChromeStorage();
  if (!key || key.length <= 0) {
    console.log('getFromStorage, invalid key: ' + key);
    return;
  }

  storage.get(key, callback);
};

//validates and returns google chrome storage
function getChromeStorage() {
  if (chrome && chrome.storage && chrome.storage.sync) {
    return chrome.storage.sync;
  } else {
    console.log('getChromeStorage, chrome storage not available. Check manifest.json');
  }
};

// TESTING PURPOSES, uncomment this code block to view changes to chrome storage.
chrome.storage.onChanged.addListener(function(changes, namespace) {
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
