var BASE = 'http://zorg-itc.herokuapp.com/';

var STATES = {
  init: 0,
  leftWin: 1,
  rightWin: 2,
  loading: 3
};

var battleQueue = [];
var battleHash = {};

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
  $(this).addClass('win');
  setState(state);
  sendResults();
  showNextBattle();
});

var createWorryNode = function(id, data) {
  return $('<div/>', {
    id: id,
    class: 'worry',
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
  setState(STATES.init);
  var node = createCard(
    $('<h1/>', { class: "v-center" }).html('Zorg'),
    'init-card');
  showCard(node);
  fetchBattles();
};

var showLoadingCard = function() {
  setState(STATES.loading);
  var node = createCard(
    $('<img/>', {
      class: 'v-center',
      src: 'ajax-loader.gif'
    }),
    'loading-card');
  showCard(node);
};

var showCreateWorryCard = function() {
  var node = $('<form/>', {
    class: 'v-center create-card-inner'
  });
  node.append($('<h1/>').html('Tell me your problems'));
  node.append($('<input/>', {
    type: 'text',
    class: 'form-control',
    placeholder: 'example: poop on the sidewalk'
  }));
  node.append($('<button/>', {
    type: 'submit',
    class: 'btn btn-primary'
  }).html('Go'));
  
  var card = createCard(node, 'create-card');
  showCard(card);
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

var getUrl = function(path) {
  return BASE + path;
};

var addBattles = function(battles) {
  battles.forEach(function(battle) {
    if (isUniqueBattle(battle)) {
      addBattle(battle);
    }
  });
};

var addBattle = function(battle) {
  var key = getKey(battle);
  battleHash[key] = true;
  queue.push(battle);
};

var getKey = function(battle) {
  if (battle[0].name > battle[1].name) {
    return battle[0].id + battle[1].id;
  } else {
   return battle[1].id + battle[0].id;
  }
};

var isUniqueBattle = function(battle) {
  var key = getKey(battle);
  return !battleHash[key];
};

var fetchBattles = function() {
  $.getJSON(getUrl('topic'), function(data) {
    addBattles(data);
  });
};

var showNextBattle = function() {
  if (!queue.length) {
    showLoadingCard();
  } else {
    showBattleCard(queue.shift());
  }
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

showInitCard();