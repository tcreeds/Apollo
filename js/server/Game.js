var Player = require('./Player.js');

var Game = function(){
    this.running = false;
    this.users = {};
    this.players = [];
    this.numPlayers = 0;
    this.models = ["A", "E", "I", "O", "U"];
    this.modelCounter = 0;
};

Game.prototype = {
    
    start: function(){
        this.running = true;   
    },
    
    playerConnected: function(user){
        var player = new Player(user);
        player.model = this.models[this.modelCounter++ % this.models.length];
        this.players.push(player); 
        this.numPlayers++;
        var playerData = {
            model: player.model
        };
        return playerData;
    },
    
    playerDisconnected: function(id){
        for (var i = 0; i < this.players.length; i++){
            if (this.players[i].id === id){
                this.players.splice(i, 1);
                this.numPlayers--;
                break;
            }
        }
    },
    
    sendUpdate: function(){
        var data = {};
        data.timestamp = Date.now();
        data.players = [];

        for (var i = 0; i < this.players.length; i++){
            var obj = {
                id: this.players[i].id,
                x: this.players[i].x,
                y: this.players[i].y,
                z: this.players[i].z

            }
            data.players.push(obj);
            
        }
        return data;
    },
    
    receiveUpdate: function(data){
       for (var i = 0; i < this.players.length; i++){
            if (this.players[i].id === data.id){
                this.players[i].x = data.x;
                this.players[i].y = data.y;
                this.players[i].z = data.z;
                break;
            }
        }
        
    },
    
    getPlayerData: function(id){
        for (var i = 0; i < this.players.length; i++){
            if (this.players[i].id == id)
                return {
                    id: id,
                    model: this.players[i].model
                };
        }
    }
    
};

module.exports = Game;