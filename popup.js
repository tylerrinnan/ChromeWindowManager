var bindEventHandlers = function () {
	$('#orientation button').bind('click', function (event) {
		designateOrienation(event);
	});
	bindSliderHandler();
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

var bindSliderHandler = function(){
	$('#width-slider').slider({
		range: 'max',
		min: 17,
		max: 83,
		value: 17,
		slide: function( event, ui ) {
			$('#value').text(ui.value + '%');
			var foo = getFromStorage("WMMMMMM", function(){

			});
		}
	});
	$("#value").text($("#width-slider").slider("value"));
}

//bind event listeners:
document.addEventListener('DOMContentLoaded', function () {
	bindEventHandlers();
});
