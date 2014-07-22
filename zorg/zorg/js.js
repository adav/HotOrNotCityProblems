var STATES = {
  init: 0,
  leftWin: 1,
  rightWin: 2,
  loading: 3
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

var createWorryNode = function(id, data) {
  return $('<div/>', {
    id: id,
    class: 'worry col-xs-6',
    style: 'background-image: url(' + data.url + ')'
  }).append($('<h1/>', { class: "v-center" }).html(data.title));
};

var receiveBattle = function(data) {
  showBattleCard(data);
};

var createCard = function(content, className) {
  return $('<div/>', {
    class: 'card ' + className
  }).append(content);
};

var createBattleCard = function(data) {
  var node = createCard();
  var left = createWorryNode('left', data.left);
  node.append(left);
  var right = createWorryNode('right', data.right);
  node.append(right);
  return node;
};

var showInitCard = function() {
  var node = createCard(
    $('<h1/>', { class: "v-center" }).html('Zorg'),
    'init-card');
  showCard(node);
};

var showLoadingCard = function() {
  var node = createCard(
    $('<h1/>', { class: "v-center" }).html('Loading'),
    'loading-card');
  showCard(node);
};

var showBattleCard = function(data) {
  var card = createBattleCard(data);
  showCard(card);
};

var showCard = function(card) {
  var cards = $('.card');
  cards.addClass('leaving');
  $('body').append(card);
  cards.addClass('leave');
};

var sendResults = function(data) {
};

var fetchBattle = function() {
};

var sampleData = {
  left: {
    title: 'Botfly',
    url: "http://www.wired.com/images_blogs/wiredscience/2013/10/human-bot-fly-3rd-instar-Buss.jpg"
  },
  right: {
    title: 'Tornado',
    url: "http://tornado-facts.com/wp-content/uploads/2009/07/lighting-and-tornado-storm.jpg"
  }
};