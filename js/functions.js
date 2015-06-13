function resize(windowId) {
  get(function() {
    if(CWM2.active){
        if (CWM2.leftId && CWM2.rightId) {
          if (windowId === CWM2.leftId || windowId === CWM2.rightId) {

            // screen parms
            var large = Math.round(screen.width * getFocusScreenSize());
            var small = Math.round(screen.width * getFadeScreenSize());
            var height = getScreenHeight();

            // scaling and offset for focus and fade windows
            var scaleDown;
            var focusOffset;
            var fadeOffset;

            if (windowId === CWM2.leftId) {
              scaleDown = CWM2.rightId;
              focusOffset = 0;
              fadeOffset = large;
            } else {
              scaleDown = CWM2.leftId;
              focusOffset = small;
              fadeOffset = 0;
            }

            chrome.windows.update(windowId, {
              left: focusOffset,
              top: 0,
              width: large,
              height: height
            });

            chrome.windows.update(scaleDown, {
              left: fadeOffset,
              top: 0,
              width: small,
              height: height
            });
          } else {
            return;
          }
        } else {
          // do something to show that left and right haven't been designated
        }
    }
  });
};


///////////////////////////////
//---SCREEN FUNCTIONS------///
//////////////////////////////

//gets the max size the chrome window can be while on screen with paired window;
function getMaxScreenSize() {
  return 100 - getMinScreenSize();
};

//assumes the max allowed chrome window size is 400px;
//gets the minimum allowable size in pixels the chrome window can be;
function getMinScreenSize() {
  return Math.floor(400/screen.width * 100);
}

//return value in decimal format e.g. screen focus value of 87 will be .87;
function getFocusScreenSize() {
  return CWM2.screenFocus / 100;
}

//return value in decimal format of remainder of screen real-estate after;
//subtracting from 100 percent;
function getFadeScreenSize() {
  return (100 - CWM2.screenFocus) / 100;
}

//gets the screen height and factors in window frame size;
function getScreenHeight() {
  return screen.availHeight + 6;
}


///////////////////////////////
//--------UTILITIES--------///
//////////////////////////////

//determines if an object is empty, e.g. {}
function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }

  return true;
}
