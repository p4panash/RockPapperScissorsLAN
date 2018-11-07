var express = require('express');
var app = express();
var serv = require('http').Server(app);
var path = require('path');
//including Player class from another file
const Player = require('./server/player.js');
//including BattleCOM class from Server
const BattleCOM = require('./server/battle.js');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
app.use(express.static(path.join(__dirname) + '/client'));

serv.listen(2000);
console.log('Server started');
var SOCKET_LIST = {}
var PLAYER_LIST = {};
var LOBBY = {};
var numberOfPlayers = 0;
var rounds;
var COM = new Player(0, "COMPUTER");

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
  socket.id = (numberOfPlayers + 1) * Math.floor(10 * Math.random());
  SOCKET_LIST[socket.id] = socket;

  //Allocate memory for the new players data
  socket.on('nameSet', function(name) {
    var player = new Player(socket.id, name);
    PLAYER_LIST[socket.id] = player;
    numberOfPlayers++;
    console.log(getServerTime() + '| New player has connected ! #' + player.id + ' ' + player.name);
    console.log(getServerTime() + '| Available players ' + numberOfPlayers);
  });

  //Handles the events for an instance which disconnected from the server
  socket.on('disconnect', function() {
    delete SOCKET_LIST[socket.id];
    if (PLAYER_LIST[socket.id]) {
      console.log(getServerTime() + '| Player #' + PLAYER_LIST[socket.id].id + ' ' + PLAYER_LIST[socket.id].name + ' has disconnected !');
      delete PLAYER_LIST[socket.id];
      numberOfPlayers--;
    } else {
      console.log(getServerTime() + '| Visitor #' + socket.id + ' has disconnected !');
    }
  });

  //Sends to client the number of players on server
  socket.on('numberOfPlayers', function() {
    console.log(getServerTime() + "| Number of players are requested ! #" +  PLAYER_LIST[socket.id].id);
    socket.emit('numberOfPlayers', numberOfPlayers);
  });

  //Sends to client the player data
  socket.on('player', function() {
    console.log(getServerTime() + "| Player data is requested ! #" +  PLAYER_LIST[socket.id].id);
    socket.emit('player', data = {
      name:PLAYER_LIST[socket.id].name,
      wins:PLAYER_LIST[socket.id].numberOfVictories,
      losses:PLAYER_LIST[socket.id].numberOfDefeats,
      ties:PLAYER_LIST[socket.id].numberOfTies
    });

    socket.on('COMinfo', function() {
      console.log(getServerTime() + "| COM data is requested by #" + PLAYER_LIST[socket.id].id);
      socket.emit('COMinfo', {
        name:COM.name, wins:COM.numberOfVictories, losses:COM.numberOfDefeats,
        ties:COM.numberOfTies
      })
    });
  });

  socket.on('BattleCOM', function() {
    Cooldown();
    rounds = 0;
  });

  socket.on('RoundCOM', function(playerChoice) {
    Cooldown();
    var battle = new BattleCOM(playerChoice, PLAYER_LIST[socket.id].id);
    rounds++;
    switch (battle.Battle()) {
      case "tie":
        socket.emit('comChoice', battle.choice);
        socket.emit('battleHistory', '<div><p class="battleResult">' + getServerTime() + '| Round #' + rounds + ' : It`s a tie !</p></div>');
        PLAYER_LIST[socket.id].numberOfTies = PLAYER_LIST[socket.id].numberOfTies + 1;
        COM.numberOfTies = COM.numberOfTies + 1;
        break;
      case "win":
        socket.emit('comChoice', battle.choice);
        socket.emit('battleHistory', '<div><p class="battleResult">' + getServerTime() + '| Round #' + rounds + ' : You win !</p></div>');
        PLAYER_LIST[socket.id].numberOfVictories = PLAYER_LIST[socket.id].numberOfVictories + 1;
        COM.numberOfDefeats = COM.numberOfDefeats + 1;
        break;
      case "lose":
        socket.emit('comChoice', battle.choice);
        socket.emit('battleHistory', '<div><p class="battleResult">' + getServerTime() + '| Round #' + rounds + ' : You lose !</p></div>');
        PLAYER_LIST[socket.id].numberOfDefeats = PLAYER_LIST[socket.id].numberOfDefeats + 1;
        COM.numberOfVictories = COM.numberOfVictories + 1;
        break;
    }
  });
});

function Cooldown() {
  var time = 3;
  io.sockets.emit('cooldown', time);
  var countdown = setInterval(function() {
    if (time > 0) {
      time--;
      io.sockets.emit('cooldown', time);
    } else {
      clearInterval(countdown);
    }
  }, 1000);
}

function getServerTime() {
  date = new Date();
  if (date.getSeconds() >= 10) {
    var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  } else {
    var time = date.getHours() + ':' + date.getMinutes() + ':0' + date.getSeconds();
  }
  return time;
}
