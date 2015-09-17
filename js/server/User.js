var User = function(socket, id){
    this.socket = socket;
    this.id = id;
    socket.on("input", this.input.bind(this));
    
    this.x = 0;
    this.y = 0;
    this.z = 0;
};

User.prototype = {
    
    input: function(data){
        console.log("input received");
    }
                   
}

module.exports = User;