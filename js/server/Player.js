var Player = function(data){
    
    this.id = data.id;
    
    this.position = {
        x: 0,
        y: 0,
        z: 0
    };
    this.rotation = 0;
    
    
};

Player.prototype.destroy = function(){
    
    
    
};

module.exports = Player;