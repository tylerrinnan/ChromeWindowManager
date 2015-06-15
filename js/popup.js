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
  style();
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
    style();
  });
};

function style(){
  var selected = 'selected';
  get(function(){
    chrome.windows.getCurrent(function(win){
      if(CWM2.leftId === win.id){
        $('#left').addClass(selected);
        $('#right').removeClass(selected);
      }else if(CWM2.rightId === win.id){
        $('#right').addClass(selected);
        $('#left').removeClass(selected);
      }
    });
  });
}

function slideHandle() {
  get(function(){
    var overload = 3; //perecentage to overload width
    $('#width-slider').slider({
      range: 'max',
      min: returnScreenMinSize(),
      max: returnScreenMaxSize() + overload,
      value: CWM2.screenFocus,
      slide: function(event, ui) {
        var $value = $('#value');
        $value.text(ui.value + '%');
        if(ui.value > returnScreenMaxSize()){
          $value.css('color', 'red');
        }else{
          $value.css('color', 'black');
        }
      },
      stop: function(event, ui) {
        CWM2.screenFocus = ui.value;
        save();
        chrome.windows.getCurrent(function(win){
          resize(win.id);
        });
      }
    });
    var $value = $('#value');
    $value.text($('#width-slider').slider('value') + '%');
    if($('#width-slider').slider('value') > returnScreenMaxSize()){
      $value.css('color', 'red');
    }else{
      $value.css('color', 'black');
    }
  });
};
