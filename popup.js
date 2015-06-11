//bind DOM event handlers
function bindEventHandlers() {
  $('#orientation button').bind('click', function(event) {
    designateOrienation(event);
  });
  slideHandle();
};

//bind event listeners
document.addEventListener('DOMContentLoaded', function() {
  bindEventHandlers();
});

//designates the window orientation's orientation left or right
function designateOrienation(event) {
  chrome.windows.getCurrent(function(win) {
    if (event.toElement.dataset.orientation === 'left') {
      CWM2.leftId = win.id
      if (CWM2.leftId === CWM2.rightId)
        CWM2.rightId = null;
    } else if (event.toElement.dataset.orientation === 'right') {
      CWM2.rightId = win.id;
      if (CWM2.rightId === CWM2.leftId)
        CWM2.leftId = null;
    } else {
      return;
    }
    save();
  });
};

//slide handler for screenFocus setting
function slideHandle() {
  get(function(){
    $('#width-slider').slider({
      range: 'max',
      min: returnScreenMinSize(),
      max: returnScreenMaxSize(),
      value: CWM2.screenFocus,
      slide: function(event, ui) {
        $('#value').text(ui.value + '%');
      },
      stop: function(event, ui) {
        CWM2.screenFocus = ui.value;
        save();
      }
    });
    $('#value').text($('#width-slider').slider('value') + '%');
  });
};
