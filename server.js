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

http.listen("443", function(){
    console.log("server started on port 443");
});


io.on("connection", connection);
function connection(socket){    
    var user = new User(socket, ++idCounter);
    var playerData = game.playerConnected(user);
    var data = { 
        id: user.id, 
        users: [], 
        model: playerData.model
    };
    
    for (var i = 0; i < users.length; i++){
        data.users.push({ 
            id: users[i].id, 
            model: users[i].model 
        });
    }
    console.log(data);
    
    socket.emit("connection info", data);
    socket.broadcast.emit("new user", { id: user.id, playerData: playerData });
    users.push(user);
    
    socket.on("start game", startGame);
    socket.on("disconnect", function(){
        userDisconnected(user);
    });
    socket.on("game update", gameUpdate); 
    
    
    console.log("new user");
    
};

function userDisconnected(user){
    console.log("user disconnected");
    var id = user.id;
    game.playerDisconnected(user.id);
    
    for (var i = 0; i < users.length; i++){
        if (users[i] == user){
            users.splice(i, 1);
            i--;
            break;
        }
    }
    io.emit("user disconnected", { id: id });   
};

function startGame(){
    if (!game.running){
        console.log("game started");
        game.start();
        setInterval(updateClients, 30);
        io.emit("game started");
    }
};

function updateClients(){
    
    var gameData = game.sendUpdate();
    
    io.emit("game update", gameData);
    
    
};

function gameUpdate(data){
    game.receiveUpdate(data);  
};


