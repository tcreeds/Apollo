var Game = function(){
    this.running = false;
    this.users = {};
    this.players = {};
};

Game.prototype = {
    
    start: function(){
        this.running = true;   
    },
    
    onPlayerConnected: function(player){
        this.players[player.id] = player;   
    }
    
};

module.exports = Game;