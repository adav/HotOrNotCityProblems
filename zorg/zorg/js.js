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

var createWorryNode = function(data) {
  var node = $('<a/>', {
    href: '#',
    class: 'worry-thumbnail thumbnail'
  }).append($('<img/>', {
    class: 'worry-image',
    style: 'backgroundImage: "url(' + data.url + ')"'
  }));
  return node;
};

var setWorry = function(node, data) {
  node.empty().append(createWorryNode(data));
};

var setRight = function(data) {
  setWorry($('#right'), data);
};
var setLeft = function(data) {
  setWorry($('#left'), data);
};

var receiveBattle = function(data) {
  setLeft(leftData);
  setRigth(rightData);
};