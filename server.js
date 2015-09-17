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
    console.log("server started");
});

io.on("connection", function(socket){
    
    var user = new User(socket, ++idCounter);
    
    users.push(user);
    console.log("new user");
    game.onPlayerConnected(user);
    socket.on("start game", startGame);
    socket.on("disconnect", userDisconnected);
    
    io.emit("new user", { id: user.id });
});

function userDisconnected(user){
    console.log("user disconnected");
    var id = user.id;
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
    
    var gameData = compileGameData();
    
    io.emit("game update", gameData);
    
    
};

function compileGameData(){
    
    var data = {};
    data.timestamp = Date.now();
    data.players = [];
    
    for (var i = 0; i < users.length; i++){
        data.players.push({
            id: users[i].id,
            x: users[i].x,
            y: users[i].y,
            z: users[i].z
            
        });
    }
    
    return data;
};

