var Player = require('./Player.js');

var Game = function(){
    this.running = false;
    this.users = {};
    this.players = {};
    this.numPlayers = 0;
};

Game.prototype = {
    
    start: function(){
        this.running = true;   
    },
    
    playerConnected: function(player){
        this.players[player.id] = new Player(player); 
        this.numPlayers++;
    },
    
    playerDisconnected: function(id){
        if (this.players[id] !== null && this.players[id] !== undefined){
            this.numPlayers --;
            delete this.players[id];
        }
    },
    
    sendUpdate: function(){
        var data = {};
        data.timestamp = Date.now();
        data.players = [];

        for (var player in this.players){
            data.players.push({
                id: player.id,
                x: player.x,
                y: player.y,
                z: player.z

            });
        }

        return data;
    },
    
    userUpdate: function(data){
        var player = this.players[data.id];
        player.x = data.x;
        player.y = data.y;
        player.z = data.z;
    }
    
};

module.exports = Game;