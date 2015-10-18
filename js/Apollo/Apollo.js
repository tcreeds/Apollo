var gl;
var object;
var shaderProgram;

var APOLLO = {};
var socket;
var players = [];
APOLLO.gameObjects = [];
var player;

APOLLO.init = function(){

        gl = APOLLO.initGL();
        APOLLO.gl = gl;
        APOLLO.Resources = { 
            Meshes: {}, 
            Textures: {} 
        };
        APOLLO.input = InputManager(canvas);
        if (gl) {
            
                gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Set clear color to black, fully opaque
                
                gl.enable(gl.DEPTH_TEST);                               // Enable depth testing
                
                gl.depthFunc(gl.LEQUAL);                                // Near things obscure far things
                
                gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Clear the color as well as the depth buffer.
                
                gl.viewportWidth = canvas.width;
                gl.viewportHeight = canvas.height;
                
        }
        else{
                alert("you dun fucked up");
        }
    
        APOLLO.initShaders();
        
        APOLLO.loaded = start;
    
        APOLLO.load.obj("./Box.obj", "box");
        APOLLO.load.obj("./Plane.obj", "plane");
        APOLLO.load.texture("./crate.jpg", "box");
        APOLLO.load.texture("./grass.png", "grass");
    
        
            
}

function start(){
    
    socket = io.connect();
    socket.on("new user", function(data){
        console.log("new user id: " +  data.id);
        addPlayer(data);
    });
    socket.on("user disconnected", function(data){
        console.log("user disconnected: " + data.id);
        for (var i = 0; i < players.length; i++){
            if (players[i].id === data.id){
                players.splice(i, 1);
                break;
            }
        }
    });
    socket.on("connection info", function(data){
        console.log("connection confimed, id is " + data.id);
        
        player = addPlayer(data.id);

        for (var i = 0; i < data.users.length; i++)
            addPlayer(data.users[i].id);
    });
    socket.on("game update", function(data){
        
        for (var i = 0; i < data.players.length; i++){
            for (var j = 0; j < players.length; j++){
                if (players[j].id === data.players[i].id && players[j].id !== player.id){
                    players[j].transform.SetPosition(data.players[i].x, data.players[i].y, data.players[i].z);
                }
            }
        }
    });
    
    var ground = APOLLO.createGameObject("plane", "grass");
    ground.transform.Scale(20, 20, 20);

    APOLLO.mainCamera = new APOLLO.Camera(Math.PI/3.5, canvas.width/canvas.height, 1, 100);
    APOLLO.mainCamera.update();
    APOLLO.mainCamera.lookAt({ x: 0, y: 0, z: 0 });

    APOLLO.drawScene();
    setInterval(APOLLO.internalUpdate, 15);
}

function addPlayer(id){
    var newPlayer = APOLLO.createGameObject("box", "box");
    newPlayer.id = id;
    players.push(newPlayer);
    return newPlayer;
}

APOLLO.createGameObject = function createGameObject(mesh, texture){
    var mesh = new APOLLO.Mesh(APOLLO.Resources.Meshes[mesh]);
    mesh.texture = APOLLO.Resources.Textures[texture];
    var go =  new APOLLO.GameObject(mesh);
    APOLLO.gameObjects.push(go);
    return go;
}

APOLLO.drawScene = function drawScene(){

    requestAnimationFrame(drawScene);
    APOLLO.mainCamera.update();
    //object.transform.UpdateMatrix();
    //object2.transform.UpdateMatrix();
    if (APOLLO.draw)
        APOLLO.draw();
    else 
        console.warn("No draw function provided.");

    
        
}

APOLLO.internalUpdate = function internalUpdate(){
    
    if (APOLLO.update)
        APOLLO.update();
    if (player){
        socket.emit("game update", {
            id: player.id,
            x: player.transform.position.x,
            y: player.transform.position.y,
            z: player.transform.position.z
        });
    }
}

function setUniformMatrices(obj, camera){
        
    gl.uniformMatrix4fv(shaderProgram.wmLocation, false, obj.transform.matrix.elements);           
    gl.uniformMatrix4fv(shaderProgram.vmLocation, false, camera.viewMatrix.elements);
    gl.uniformMatrix4fv(shaderProgram.pmLocation, false, camera.projectionMatrix.elements);
        
}

APOLLO.initGL = function initGL(){ 

    gl = canvas.getContext('webgl');

    if (!gl){
            alert('Your browser may not support WebGL.');
            gl = null;
    }

    return gl;
            
}

APOLLO.initShaders = function initShaders(){
            
    //create shaders
    var vertex = APOLLO.getShader(gl, 'vertex-shader');
    var fragment = APOLLO.getShader(gl, 'fragment-shader');

    //create program and link shaders
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertex);
    gl.attachShader(shaderProgram, fragment);
    gl.linkProgram(shaderProgram);

    //check for errors
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
            alert('Unable to initalize shaders.');

    //set GL program
    gl.useProgram(shaderProgram);

    //enable vertex array
    gl.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
    gl.vertexTextureAttribute = gl.getAttribLocation(shaderProgram, "uv");
    gl.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "normal");
    
    gl.enableVertexAttribArray(gl.vertexPositionAttribute);
    gl.enableVertexAttribArray(gl.vertexTextureAttribute);
    gl.enableVertexAttribArray(gl.vertexNormalAttribute);

    shaderProgram.wmLocation = gl.getUniformLocation(shaderProgram, "world");
    shaderProgram.vmLocation = gl.getUniformLocation(shaderProgram, "view");
    shaderProgram.pmLocation = gl.getUniformLocation(shaderProgram, "perspective");
}


APOLLO.getShader = function getShader(gl, shaderID){
            
    var shaderScript, currentChild, source = "", shader;

    shaderScript = document.getElementById(shaderID);

    if (!shaderScript)
            return null;

    currentChild = shaderScript.firstChild;

    //gather all text from script
    while (currentChild){
            if (currentChild.nodeType == currentChild.TEXT_NODE){
                    source += currentChild.textContent;
                    currentChild = currentChild.nextSibling;
            }
    }

    //create shader from script
    if (shaderScript.type == "x-shader/x-fragment")
            shader = gl.createShader(gl.FRAGMENT_SHADER);
    else if (shaderScript.type == "x-shader/x-vertex")
            shader = gl.createShader(gl.VERTEX_SHADER);
    else
            return null;

    //get and compile shader
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    //check that compilation succeeded
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            alert("An error occurred while compiling shaders: " + gl.getShaderInfoLog(shader));
            return null;
    }

    //everything went smoothly, return shader
    return shader;
    
}


//   old   -----------------------------------------------------------------

function initBuffers(){
        //create buffer
        vertexBuffer = gl.createBuffer();
        indexBuffer = gl.createBuffer();
        
        //bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        
        var vertices = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ];
        
        var indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23    // left
        ];
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(indices), gl.STATIC_DRAW);
}

function makeObject(){
        var vertices = [
            // Front face
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,
             1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            
            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0, -1.0, -1.0,
            
            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
             1.0,  1.0,  1.0,
             1.0,  1.0, -1.0,
            
            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
            
            // Right face
             1.0, -1.0, -1.0,
             1.0,  1.0, -1.0,
             1.0,  1.0,  1.0,
             1.0, -1.0,  1.0,
            
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0
        ];
        
        var indices = [
            0,  1,  2,      0,  2,  3,    // front
            4,  5,  6,      4,  6,  7,    // back
            8,  9,  10,     8,  10, 11,   // top
            12, 13, 14,     12, 14, 15,   // bottom
            16, 17, 18,     16, 18, 19,   // right
            20, 21, 22,     20, 22, 23    // left
        ];
        var mesh = new APOLLO.Mesh( { vertices: vertices, indices: indices } );
        return new APOLLO.GameObject( mesh );
        
}