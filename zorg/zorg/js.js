var STATES = {
  init: 0,
  leftWin: 1,
  rightWin: 2
};

var STATE_CLASSES = [];
STATE_CLASSES[STATES.leftWin] = 'left-win';
STATE_CLASSES[STATES.rightWin] = 'right-win';

var clearState = function() {
  $('body').removeClass(STATE_CLASSES.join(' '));
};

var setState = function(state) {
  clearState();
  $('body').addClass(STATE_CLASSES[state]);
};

$('body').delegate('.worry', 'click', function(e) {
  var state = this.id == 'left' ? STATES.leftWin : STATES.rightWin;
  setState(state);
});