//bind DOM event handlers
function bindEventHandlers() {
  $('#orientation a').bind('click', function(event) {
    designateOrienation(event);
  });
  slideHandle();
  activeHandle();
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
      CWM2.leftId = CWM2.leftId === win.id ? null : win.id;
      if (CWM2.leftId === CWM2.rightId)
        CWM2.rightId = null;
    } else if (event.toElement.dataset.orientation === 'right') {
      CWM2.rightId = CWM2.rightId === win.id ? null : win.id;
      if (CWM2.rightId === CWM2.leftId)
        CWM2.leftId = null;
    } else {
      return;
    }
    save();
    style();
  });
};

//styles the buttons
function style(win){
  var notSelected = 'button';
  var selected = 'buttonSelected';
  get(function(){
    chrome.windows.getCurrent(function(win){
      $left = $('#left');
      $right = $('#right');
      if(CWM2.leftId === win.id){
        $left.removeClass(notSelected);
        $left.addClass(selected);
        $right.removeClass(selected);
        $right.addClass(notSelected);
      }else if(CWM2.rightId === win.id){
        $right.removeClass(notSelected);
        $right.addClass(selected);
        $left.removeClass(selected);
        $left.addClass(notSelected);
      }else if(CWM2.leftId === null){
        $left.removeClass(selected);
        $left.addClass(notSelected);
      }else if(CWM2.rightId === null){
        $right.removeClass(selected);
        $right.addClass(notSelected);
      }
    });
  });
}

//pause or play button for resizing
function activeHandle(){
  get(function(){
    var $toggle = $('#config button');
    var on = 'active-toggle-active';
    var off = 'active-toggle-inactive';
    $toggle.click(function(){
      if($(this).hasClass(on)){
        $(this).removeClass(on);
        $(this).addClass(off);
        CWM2.active = false;
      }else{
        CWM2.active = true;
        $(this).removeClass(off);
        $(this).addClass(on);
      }
      save();
    });
    if(!CWM2.active){
      $toggle.removeClass(on);
      $toggle.addClass(off);
    }
  });
}

//slide handler
function slideHandle() {
  get(function(){
    var overload = 3;
    $('#width-slider').slider({
      range: 'max',
      min: getMinScreenSize(),
      max: getMaxScreenSize() + overload,
      value: CWM2.screenFocus,
      slide: function(event, ui) {
        var $value = $('#value');
        $value.text(ui.value + '%');
        if(ui.value > getMaxScreenSize()){
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

    var percentage = $('#width-slider').slider('value');
    var $value = $('#value');
    if(percentage > getMaxScreenSize()){
      $value.css('color', 'red');
    }else{
      $value.css('color', 'black');
    }

    $value.text(percentage + '%');
  });
};
