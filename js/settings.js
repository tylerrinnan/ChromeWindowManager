//setup CWM2 model, if first time then initialize
var CWM2 = {
  leftId: null,
  rightId: null,
  screenFocus: 83
};

//get CWM object from storage and set to model
function get(callback) {
  getFromStorage('CWM2', function(response) {
    if (response && !isEmpty(response) && response['CWM2']) {
      var deets = response['CWM2'];
      CWM2.leftId = deets.leftId;
      CWM2.rightId = deets.rightId;
      CWM2.screenFocus = deets.screenFocus;
      if(callback)
      callback();
    }
  });
};

//saves the current state of the CWM2 model
function save() {
  saveToStorage({'CWM2': CWM2}, function() {
    //do something to show it saved
  })
};
