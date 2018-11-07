var playerNameButton = document.getElementById('playerNameButton');
var playerName = document.getElementById('playerName');
var socket = io();
var wins, losses, ties;
var availablePlayers;
var countdown;

function hideElements(elements) {
  for (var i = 0; i < elements.length; i++)
    elements[i].style.display = 'none';
}

function showElements(elements, type) {
  for (var i = 0; i < elements.length; i++)
    elements[i].style.display = type;
}

function requestPlayers() {
  socket.emit('numberOfPlayers', "");
  socket.on('numberOfPlayers', function(data) {
    availablePlayers = data;
  });
}

function requestPlayer() {
  socket.emit('player', "");
  socket.on('player', function(data) {
    //console.log(data);
    document.getElementById("nameP").innerHTML = data.name;
    updateScore(data);
  });
}

function initAdversary() {
  document.getElementById('rockE').src = "/img/rockE.png";
  document.getElementById('papperE').src = "/img/papperE.png";
  document.getElementById('scissorsE').src = "/img/scissorsE.png";
}

function adversaryChoice(data) {
  switch (data) {
    case "r" :
      document.getElementById('rockE').src = "/img/rockE_selected.png";
      break;
    case "p" :
      document.getElementById('papperE').src = "/img/papperE_selected.png";
      break;
    case "s" :
      document.getElementById('scissorsE').src = "/img/scissorsE_selected.png";
      break;
  }
}

function updateCOM() {
  socket.emit('COMinfo', '');
  socket.on('COMinfo', function(data) {
    document.getElementById('nameE').innerHTML = data.name;
    updateAdversaryScore(data);
  });
  socket.emit('comChoice', '');
  socket.on('comChoice', function(data) {
    console.log(data);
    adversaryChoice(data);
  });
}

function initPlayer() {
  requestPlayer();
  updateCOM();
  var r = document.getElementById('rock');
  var p = document.getElementById('papper');
  var s = document.getElementById('scissors');
  r.onclick = function() {
    if (!countdown) {
      socket.emit('RoundCOM', 'r');
      updateCOM();
      requestPlayer();
    }
  }
  p.onclick = function() {
    if (!countdown) {
      socket.emit('RoundCOM', 'p');
      updateCOM();
      requestPlayer();
    }
  }
  s.onclick = function() {
    if (!countdown) {
      socket.emit('RoundCOM', 's');
      updateCOM();
      requestPlayer();
    }
  }
}

function initBattleHistory() {
  socket.on('battleHistory', function(data) {
    document.getElementById('battleHistory').innerHTML = data + document.getElementById('battleHistory').innerHTML;
  });
}

function updateScore(data) {
  document.getElementById("winsP").innerHTML = data.wins;
  document.getElementById("lossesP").innerHTML = data.losses;
  document.getElementById("tiesP").innerHTML = data.ties;
}

function updateAdversaryScore(data) {
  document.getElementById("winsE").innerHTML = data.wins;
  document.getElementById("lossesE").innerHTML = data.losses;
  document.getElementById("tiesE").innerHTML = data.ties;
}

playerNameButton.onclick = function() {
  socket.emit('nameSet', playerName.value);
  hideElements(document.getElementsByClassName('nameSelection'));
  //showElements(document.getElementsByClassName('player'), "flex");
  //showElements(document.getElementsByClassName('history'), "inline-block");
  showElements(document.getElementsByClassName('announcer'), "flex");
  showElements(document.getElementsByClassName('gameType'), "flex");
  document.getElementById('announcer').innerHTML = "Select game mode !";
}

document.getElementById('playCOM').onclick = function() {
  showElements(document.getElementsByClassName('player'), "flex");
  showElements(document.getElementsByClassName('history'), "inline-block");
  //hideElements(document.getElementsByClassName('gameType'));
  document.getElementById('playCOM').style.display = 'none';
  initPlayer();
  initBattleHistory();
  document.getElementById('announcer').innerHTML = "Battle starts in !";
  socket.emit('BattleCOM', '');
}

document.getElementById('pVp').onclick = function() {
  requestPlayers();
  if (availablePlayers > 2) {
    showElements(document.getElementsByClassName('player'), "flex");
    showElements(document.getElementsByClassName('history'), "inline-block");
    hideElements(document.getElementsByClassName('gameType'));
    initPlayer();
    initBattleHistory();
    document.getElementById('announcer').innerHTML = "Battle starts in !";
    socket.emit('BattleCOM', '');
  } else {
    alert("There are no players available !");
  }
}

function cooldown() {
  socket.on('cooldown', function(data) {
    //console.log(data);
    if (data == 0) {
      countdown = false;
      document.getElementById('announcer').innerHTML = "Choose your element !";
    } else {
      countdown = true;
      initAdversary();
      document.getElementById('announcer').innerHTML = "Battle starts in " + data + " !";
    }
  });
}

cooldown();
