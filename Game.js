

window.onload = function(){
    var canvas = document.getElementById('canvas');
    APOLLO.onload = start;
    APOLLO.init(canvas);   
    APOLLO.draw = draw;
    APOLLO.update = update;
}

function draw(){
    APOLLO.gl.viewport(0, 0, APOLLO.gl.viewportWidth, APOLLO.gl.viewportHeight);
    APOLLO.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    APOLLO.gl.activeTexture(APOLLO.gl.TEXTURE0);
    APOLLO.gl.uniform1i(APOLLO.gl.getUniformLocation(shaderProgram, "sampler"), 0);
    
    for (var i = 0; l = APOLLO.gameObjects.length, i < l; i++){
        APOLLO.gameObjects[i].transform.UpdateMatrix();
        APOLLO.gameObjects[i].mesh.SetBuffers();
        APOLLO.gl.bindTexture(APOLLO.gl.TEXTURE_2D, APOLLO.gameObjects[i].mesh.texture);
        setUniformMatrices(APOLLO.gameObjects[i], APOLLO.mainCamera);
        APOLLO.gl.drawArrays(APOLLO.gl.TRIANGLES, 0, APOLLO.gameObjects[i].mesh.vertexCount); 
    }
}

function update(){
    
    var state = APOLLO.input.getInputState();

    //following a target
    if (APOLLO.mainCamera.target != null){
        if (state.r){
            APOLLO.mainCamera.freeRoam();   
        }
        if (state.leftArrow){
            player.transform.RotateY(0.1);
        }
        if (state.rightArrow){
            player.transform.RotateY(-0.1);
        }
        if (state.a){
            player.transform.Translate(player.transform.right.x/10, player.transform.right.y/10, player.transform.right.z/10);
        }
        if (state.d){
            player.transform.Translate(player.transform.right.x/-10, player.transform.right.y/-10, player.transform.right.z/-10);
        }
        if (state.w)
            player.transform.Translate(player.transform.forward.x/10, player.transform.forward.y/10, player.transform.forward.z/10);
        if (state.s)
            player.transform.Translate(player.transform.forward.x/-10, player.transform.forward.y/-10, player.transform.forward.z/-10);
    }
    //freeroam
    else{
        if (state.f){
            APOLLO.mainCamera.follow(player);   
        }
         if (state.w){
            APOLLO.mainCamera.Move(0, 0, -1);
        }
        if (state.s){
            APOLLO.mainCamera.Move(0, 0, 1);
        }
        if (state.d){
            APOLLO.mainCamera.Move(1, 0, 0);
        }
        if (state.a){
            APOLLO.mainCamera.Move(-1, 0, 0);
        }
        if (state.upArrow){
            APOLLO.mainCamera.RotateAxisAngle(APOLLO.mainCamera.right, 0.01);   
        }
        if (state.downArrow){
            APOLLO.mainCamera.RotateAxisAngle(APOLLO.mainCamera.right, -0.01);   
        }
        if (state.leftArrow){
            APOLLO.mainCamera.RotateAxisAngle(APOLLO.Vector3.Up, 0.01);//viewMatrix.RotateY(0.01);    
        }
        if (state.rightArrow){
            APOLLO.mainCamera.RotateAxisAngle(APOLLO.Vector3.Up, -0.01);//viewMatrix.RotateY(-0.01);   
        }
    }
}

function addPlayer(id, mesh, texture){
    mesh = mesh || "box";
    texture = texture || "box";
    var newPlayer = APOLLO.createGameObject(mesh, texture);
    newPlayer.id = id;
    players.push(newPlayer);
    return newPlayer;
}

function start(){
    var serverLocation = window.location.href;
    var wsServer = serverLocation.replace("http", "ws");

    if (wsServer.indexOf("443") === -1){
        wsServer = wsServer.replace(".com", ".com:443");
    }

    socket = io.connect(wsServer);

    socket.on("new user", newUser);
    socket.on("user disconnected", userDisconnected);
    socket.on("connection info", connectionInfo);
    socket.on("game update", gameUpdate);
    socket.on("chat message", handleChat);
    
    socket.on("connect_error", connectError);
    
    
    //APOLLO.input.subscribe("mousemove", moveCamera);
    
    var ground = APOLLO.createGameObject("plane", "grass");
    ground.transform.Scale(20, 20, 20);
    ground.transform.position.z = -5;

    APOLLO.mainCamera = new APOLLO.Camera(Math.PI/3.5, canvas.width/canvas.height, 1, 100);
    APOLLO.mainCamera.update();
    APOLLO.mainCamera.lookAt({ x: 0, y: 0, z: 0 });

    APOLLO.drawScene();
    setInterval(APOLLO.internalUpdate, 15);
}

function handleChat(data){
    var el = $("<p></p>");
    el.text("User " + data.name + ": " + data.text);
    el.addClass("chatMessage");
    el.attr("timestamp", data.timestamp);
    $.each($(".chatMessage"), function( index, value ){
        var obj = $(value);
        if (obj.attr("timestamp") > data.timestamp){
            obj.before(el);
            return false;
        }
    });
    $("#output").append(el);
}

function sendMessage(){
    if (player.id === undefined)
        return;
    var text = $("#chatInput").val();
    $("#chatInput").val("");
    if (text != "")
        socket.emit("chat message", { text: text, id: player.id });
}

function connectError(){
    if (player === undefined || player === null){
        player = addPlayer(1);
        document.getElementById("output").innerHTML = "Game server is not running, you are offline.";
    }
}

function newUser(data){
    console.log("new user id: " +  data.id);
    addPlayer(data.id, data.playerData.model, data.playerData.texture);
}


function userDisconnected(data){
    
    console.log("user disconnected: " + data.id);
    for (var i = 0; i < players.length; i++){
        if (players[i].id === data.id){
            players[i].Destroy();
            players.splice(i, 1);
            break;
        }
    }
}


function connectionInfo(data){
    
    console.log("connection confimed, id is " + data.id);
    $("#output").append($("<p class='chatMessage'>Connected to game server.</p>"));
    
    player = addPlayer(data.id, data.model || "box");
    APOLLO.mainCamera.follow(player);

    for (var i = 0; i < data.users.length; i++)
        addPlayer(data.users[i].id, data.users[i].model);
}


function gameUpdate(data){
    
    for (var i = 0; i < data.players.length; i++){
        for (var j = 0; j < players.length; j++){
            if (players[j].id === data.players[i].id && players[j].id !== player.id){
                players[j].transform.SetPosition(data.players[i].position);
                players[j].transform.rotationMatrix = players[j].transform.rotationMatrix.Identity().RotateY(data.players[i].rotation);
            }
        }
    }
}

function moveCamera(event, x, y){
    if (!APOLLO.mainCamera.target)
        APOLLO.mainCamera.rotate(y/100, 0, 0);
}