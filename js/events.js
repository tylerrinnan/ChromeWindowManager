chrome.windows.onFocusChanged.addListener(function(windowId){
	if(windowId == chrome.windows.WINDOW_ID_NONE){
		//do nothing, focus has lost all chrome windows
		return;
	};
  resize(windowId);
});
