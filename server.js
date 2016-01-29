var express = require("express"),
    app = express(),
    http = require("http").Server(app),
    io = require("socket.io")(http),
    User = require("./js/server/User.js"),
    Game = require("./js/server/Game.js"),
    nsp = io.of("/apollo/"), //server version
    //nsp = io,  //local version
    gameLoop;
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


nsp.on("connection", connection);
function connection(socket){    
    var user = new User(socket, ++idCounter);
    var playerData = game.playerConnected(user);
    var data = { 
        id: user.id, 
        users: [], 
        model: playerData.model
    };
    
    for (var i = 0; i < users.length; i++){
        data.users.push(game.getPlayerData(users[i].id));
    }
    
    socket.emit("connection info", data);
    socket.broadcast.emit("new user", { id: user.id, playerData: playerData });
    users.push(user);
    
    socket.on("disconnect", function(){
        userDisconnected(user);
    });
    socket.on("game update", gameUpdate); 
    startGame();
};

function userDisconnected(user){
    var id = user.id;
    game.playerDisconnected(user.id);
    
    for (var i = 0; i < users.length; i++){
        if (users[i] == user){
            users.splice(i, 1);
            i--;
            break;
        }
    }
    if (users.length === 0){
        stopGame();   
    }
    nsp.emit("user disconnected", { id: id });   
};

function startGame(){
    if (!game.running){
        console.log("game started");
        game.start();
        gameLoop = setInterval(updateClients, 30);
        nsp.emit("game started");
    }
};

function stopGame(){
    console.log("game stopped");
    game.running = false;
    clearInterval(gameLoop);
}

function updateClients(){
    
    var gameData = game.sendUpdate();
    
    nsp.emit("game update", gameData);
    
    
};

function gameUpdate(data){
    game.receiveUpdate(data);  
};


