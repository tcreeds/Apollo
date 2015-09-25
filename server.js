var express = require("express"),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io")(http),
    User = require("./js/server/User.js"),
    Game = require("./js/server/Game.js")
;

var idCounter = 0;
var users = [];
var game = new Game();

app.use(express.static(__dirname + "/"));

app.get('/', function(request, response){
    response.sendFile(__dirname + "/graphics.html");
});

http.listen("3000", function(){
    console.log("server started on port 3000");
});

io.on("connection", function(socket){
    
    var user = new User(socket, ++idCounter);
    
    users.push(user);
    console.log("new user");
    
    game.userConnected(user);
    
    socket.on("start game", startGame);
    socket.on("disconnect", userDisconnected);
    socket.on("game update", gameUpdate); 
    
    io.emit("new user", { id: user.id });
});

function userDisconnected(user){
    console.log("user disconnected");
    var id = user.id;
    game.userDisconnected(user.id);
    
    for (var i = 0; i < users.length; i++){
        if (users[i] == user)
            delete users[i];
        else {
            users[i].socket.emit("user disconnected", { id: id });   
        }
    }
};

function startGame(){
    if (!game.running){
        game.start();
        
        setInterval(updateClients, 30);
    }
};

function updateClients(){
    
    var gameData = game.sendUpdate();
    
    io.emit("game update", gameData);
    
    
};

function gameUpdate(data){
    game.receiveUpdate(data);  
};

function compileGameData(){
    
   
};

