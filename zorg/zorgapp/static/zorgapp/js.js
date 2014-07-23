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
var LATLONG;




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

$('body').delegate('.worry-battle', 'click', function(e) {
  var state = $(this).hasClass('left') ? STATES.leftWin : STATES.rightWin;
  $(this).addClass('win');
  setState(state);
  sendResults();
  showNextCard();
});

var createWorryNode = function(side, data) {
  return createHalfNode(side, 'worry-battle', data);
};

var createHalfNode = function(side, className, data) {
  var style = '';
  if (data.img_url) {
    style = 'background-image: url(' + data.img_url + ')'; 
  }
  return $('<div/>', {
    class: className + ' worry ' + side,
    style: style
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
    var value = $(this.elements[0]).val();
    if (value) {
      $.post(getUrl('topic/'), {
        text: value
      });
    }
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
  window.setTimeout(function() {cards.remove()}, 1000);
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
  
  var data = {
    winning_topic: winningTopic.id,
    losing_topic: losingTopic.id,
    city: USER_CITY,
    user: USER_ID
  };
  
  if (LATLONG) {
    data['location_lat'] = LATLONG.latitude.toFixed(6);
    data['location_long'] = LATLONG.longitude.toFixed(6);
  }
  
  $.post(getUrl('battle/'), data);
};

var getUrl = function(path) {
  return '/' + path;
};

var addBattles = function(topics) {
  var len = topics.length;
  for (var i = 0; i < len; i++) {
    var j = Math.floor(Math.random() * 10);
    if (i != j) {
      var battle = [topics[i], topics[j]];      
      if (isUniqueBattle(battle)) {
        addBattle(battle);
      }
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
  LATLONG = position.coords;
  var latlng = position.coords.latitude + ',' + position.coords.longitude;
  $.getJSON(GEO_URL, {
    key: GEO_KEY,
    result_type: 'administrative_area_level_3',
    latlng: latlng
  }, function(data) {
    if (data.results.length) {
      var city = data.results[0].address_components[0].long_name;
      USER_CITY = city;
    }
  });
};

var showAnalytics = function() {
  var node = createCard();
  var left = createHalfNode('left', 'analize-city', {
    name: 'City'
  });
  node.append(left);
  var right = createHalfNode('right', 'analize-topic', {
    name: 'Topic'
  });
  node.append(right);
  showCard(node);
};

var createRank = function(topic, i) {
  var div = $('<div/>', {
    class: "worry-text"
  });
  
  div.append($('<div/>', {
    class: 'rank-number'
  }).html((i + 1) + '.'));
  
  div.append($('<h1/>').html(topic.name));
  
  return $('<li/>', {
    class: 'rank',
    style: 'background-image: url(' + topic.img_url + ')'
  }).append(div);
};

var showRanking = function(data) {
  var node = createCard();
  node.append($('<h1/>', {
    class: 'ranking-title'
  }).html(data.title));
  
  var ol = $('<ol/>', {
    class: 'rankings'
  });
  for (var i = 0; i < data.topics.length; i++) {
    var rank = createRank(data.topics[i], i);
    ol.append(rank);
  }
  node.append(ol);
  showCard(node);
};

var createLeftCompare = function(canvas, data) {
  createCompare(canvas, data, data.topic1, 'topic1_percent', true);
};

var createRightCompare = function(canvas, data) {
  createCompare(canvas, data, data.topic2, 'topic2_percent', false);
};

var createCompare = function(canvas, data, topic, key, left) {
  var c = canvas.getContext('2d');
  
  var img = new Image();
  img.onload = function() {
    var num = data.comparisons.length;
    var stepHeight = canvas.height / num;
    c.save();
    c.beginPath();
    var startX = left ? 0 : canvas.width;
    c.moveTo(startX, 0);
    data.comparisons.forEach(function(comparison, i) {
      var percent = comparison[key];
      percent = left ? percent : 1 - percent;
      var clipWidth = canvas.width * percent;
      c.lineTo(clipWidth, i * stepHeight);
      c.lineTo(clipWidth, (i + 1) * stepHeight);
    });
    c.lineTo(startX, num * stepHeight);
    c.closePath();
    c.stroke();
    c.clip();
    c.drawImage(img, 0, 0, canvas.width, canvas.height);
    c.restore();
  }
  img.src = topic.img_url;
};

var showCompare = function(data) {
  var canvas = document.createElement('canvas');
  canvas.className = 'compare-canvas';
  canvas.height = $(window).height();
  canvas.width = $(window).width();
 
  var left = createLeftCompare(canvas, data);
  var right = createRightCompare(canvas, data);
  
  var node = createCard();
  node.append(canvas);
  
  var left = createHalfNode('left', 'compare-block', {
    name: data.topic1.name
  });
  node.append(left);
  var right = createHalfNode('right', 'compare-block', {
    name: data.topic2.name
  });
  node.append(right);
  
  
  var num = data.comparisons.length;
  var stepHeight = canvas.height / num;
  data.comparisons.forEach(function(comparison, i) {
    var div = document.createElement('div');
    div.className = 'compare-city';
    div.innerHTML = comparison.city;
    
    div.style.top = (i * stepHeight) + 'px';
    div.style.lineHeight = stepHeight + 'px';
    div.style.height = stepHeight + 'px';
    
    node.append(div);
  });
  
  showCard(node);
};

(function init() {
  showInitCard();
  navigator.geolocation.getCurrentPosition(getUserLocation);
  
  $.Topic('addBattles').subscribe(hasMoreBattles);
})();

var sampleCompare = {
  topic1: {
    "id": 10, 
    "name": "Corrupt Police", 
    "img_url": "http://d1pvsnudg6kebv.cloudfront.net/wp-content/uploads/2012/05/Uttarakhand-Police.jpg"
  },
  topic2: {
    "id": 6, 
    "name": "Taxes", 
    "img_url": "http://2.bp.blogspot.com/-E4WtTDSHh_w/TjdwWK-SifI/AAAAAAAAFlM/N56N6UuGFdA/s1600/smoking+uncle_sam_taxes.jpg"
  },
  comparisons: [
    {
      city: 'Tel Aviv',
      topic1_percent: '.25',
      topic2_percent: '.75'
    },
    {
      city: 'Chicago',
      topic1_percent: '.75',
      topic2_percent: '.25'
    },
    {
      city: 'London',
      topic1_percent: '.65',
      topic2_percent: '.35'
    }
  ]  
};

var sampleData = {
  title: 'Problems for the Emerald City',
  topics: [
    {
        "id": 10, 
        "name": "Corrupt Police", 
        "img_url": "http://d1pvsnudg6kebv.cloudfront.net/wp-content/uploads/2012/05/Uttarakhand-Police.jpg"
    }, 
    {
        "id": 6, 
        "name": "Taxes", 
        "img_url": "http://2.bp.blogspot.com/-E4WtTDSHh_w/TjdwWK-SifI/AAAAAAAAFlM/N56N6UuGFdA/s1600/smoking+uncle_sam_taxes.jpg"
    }, 
    {
        "id": 13, 
        "name": "Bureaucracy", 
        "img_url": "http://englishmaninmarseille.files.wordpress.com/2011/12/mp9003993501-1024x1024.jpg"
    }, 
    {
        "id": 5, 
        "name": "Traffic jams", 
        "img_url": "http://s1.cdn.autoevolution.com/images/news/how-to-avoid-traffic-jams-35319_2.jpg"
    }, 
    {
        "id": 1, 
        "name": "Air pollution", 
        "img_url": "http://www.drsoram.com/wp-content/uploads/air%20pollution%202.jpg"
    }, 
    {
        "id": 17, 
        "name": "Stolen Bike", 
        "img_url": ""
    }, 
    {
        "id": 14, 
        "name": "Drugs", 
        "img_url": "http://www.m-n-d.co.za/wp-content/uploads/2014/05/nodrugs.png"
    }, 
    {
        "id": 2, 
        "name": "Dog's poop", 
        "img_url": "http://www.the3dstudio.com/download_image.ashx?size=large&mode=product&file_guid=1dfac141-2649-4100-a1fb-d770be85a358"
    }, 
    {
        "id": 3, 
        "name": "Parking", 
        "img_url": "http://i.dailymail.co.uk/i/pix/2013/04/11/article-2307768-193E7FA1000005DC-662_634x601.jpg"
    }, 
    {
        "id": 7, 
        "name": "Noise", 
        "img_url": "http://www.alpinehearingprotection.com/files/2413/7483/4485/earplugs-noise-large.jpg"
    }, 
    {
        "id": 16, 
        "name": "example", 
        "img_url": ""
    }, 
    {
        "id": 15, 
        "name": "Smoking in public places", 
        "img_url": "http://maneleen.files.wordpress.com/2010/12/no_smoking_law.jpg"
    }, 
    {
        "id": 11, 
        "name": "Garbage", 
        "img_url": "http://img.timeinc.net/time/photoessays/2008/naples_garbage/garbage_naples_01.jpg"
    }, 
    {
        "id": 8, 
        "name": "Beer's Prices", 
        "img_url": "http://beerbeer.org/wp-content/uploads/2010/10/try-beer-price-01.jpg"
    }, 
    {
        "id": 4, 
        "name": "Mugging", 
        "img_url": "https://c2.staticflickr.com/8/7014/6795642413_2849a7df9c_z.jpg"
    }, 
    {
        "id": 9, 
        "name": "Drunks punks", 
        "img_url": "http://images.mirror.co.uk/upl/m4/oct2011/6/0/image-10-for-editorial-pics-11-10-2011-gallery-609101548.jpg"
    }, 
    {
        "id": 12, 
        "name": "Aids", 
        "img_url": "http://medimoon.com/wp-content/uploads/2012/07/aids-1.jpg"
    }
]
};