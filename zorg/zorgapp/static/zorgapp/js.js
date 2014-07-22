var topics = {};

jQuery.Topic = function( id ) {
    var callbacks,
        topic = id && topics[ id ];
    if ( !topic ) {
        callbacks = jQuery.Callbacks();
        topic = {
            publish: callbacks.fire,
            subscribe: callbacks.add,
            unsubscribe: callbacks.remove
        };
        if ( id ) {
            topics[ id ] = topic;
        }
    }
    return topic;
};


var GEO_KEY = 'AIzaSyDv7-R-BYh7D8PksYznVHf7hugSMaXOZlY';
var GEO_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
var USER_CITY;




var STATES = {
  init: 0,
  leftWin: 1,
  rightWin: 2,
  loading: 3
};
var STATE = STATES.init;
var currentBattle;

var battleQueue = [];
var battleHash = {};

var STATE_CLASSES = [];
STATE_CLASSES[STATES.leftWin] = 'left-win';
STATE_CLASSES[STATES.rightWin] = 'right-win';

var clearState = function() {
  $('body').removeClass(STATE_CLASSES.join(' '));
};

var setState = function(state) {
  STATE = state;
  clearState();
  $('body').addClass(STATE_CLASSES[state]);
};

$('body').delegate('.worry', 'click', function(e) {
  var state = this.id == 'left' ? STATES.leftWin : STATES.rightWin;
  $(this).addClass('win');
  setState(state);
  sendResults();
  showNextCard();
});

var createWorryNode = function(id, data) {
  return $('<div/>', {
    id: id,
    class: 'worry',
    style: 'background-image: url(' + data.img_url + ')'
  }).append($('<div/>', {
    class: "worry-text"
  })).append($('<h1/>', {
    class: "v-center"
  }).html(data.name));
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
  var left = createWorryNode('left', data[0]);
  node.append(left);
  var right = createWorryNode('right', data[1]);
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
  if (STATE == STATES.loading) {
    return;
  }
  
  setState(STATES.loading);
  var node = createCard(
    $('<img/>', {
      class: 'v-center',
      src: LOADER_URL
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
  
  node.submit(function(e) {
    e.preventDefault();
    showNextCard();
  });
  
  var card = createCard(node, 'create-card');
  showCard(card);
};

var showBattleCard = function(data) {
  currentBattle = data;
  var card = createBattleCard(data);
  showCard(card);
};

var showCard = function(card) {
  var cards = $('.card');
  cards.addClass('leaving');
  $('body').append(card);
  cards.addClass('leave');
};

var sendResults = function() {
  var winningId;
  var losingId;
  if (STATE == STATES.leftWin) {
    winningTopic = currentBattle[0];
    losingTopic = currentBattle[1];
  } else {
    winningTopic = currentBattle[1];
    losingTopic = currentBattle[0];
  }
  
  $.post(getUrl('battle/'), {
    winning_topic: winningTopic.id,
    losing_topic: losingTopic.id,
    city: USER_CITY,
    user: USER_ID
  });
};

var getUrl = function(path) {
  return '/' + path;
};

var addBattles = function(topics) {
  var len = topics.length;
  for (var i = 0; i < len / 2; i++) {
    var battle = [topics[i], topics[len - 1 - i]];
    if (isUniqueBattle(battle)) {
      addBattle(battle);
    }
  }
  $.Topic('addBattles').publish();
};

var addBattle = function(battle) {
  var key = getKey(battle);
  battleHash[key] = true;
  battleQueue.push(battle);
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

var showNextCard = function() {
  if (Math.random() > .1) {
    showNextBattle();
  } else {
    showCreateWorryCard();
  }
};

var showNextBattle = function() {
  if (!battleQueue.length) {
    showLoadingCard();
  } else {
    var battle = battleQueue.shift();
    showBattleCard(battle);
  }
  
  if (battleQueue.length < 3) {
    fetchBattles();
  }
};

var isWaitingState = function(state) {
  return state == STATES.loading || state == STATES.init;
}

var hasMoreBattles = function() {
  if (isWaitingState(STATE)) {
    showNextBattle();
  }
};

var getUserLocation = function(position) {
  var latlng = position.coords.latitude + ',' + position.coords.longitude;
  $.getJSON(GEO_URL, {
    key: GEO_KEY,
    result_type: 'administrative_area_level_3',
    latlng: latlng
  }, function(data) {
    if (data.results.length) {
      var city = data.results[0].address_components[0];
      USER_CITY = city;
    }
  });
};

(function init() {
  showInitCard();
  navigator.geolocation.getCurrentPosition(getUserLocation)
  
  $.Topic('addBattles').subscribe(hasMoreBattles);
})();