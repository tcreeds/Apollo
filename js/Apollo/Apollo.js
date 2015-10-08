var gl;
var object;
var shaderProgram;
var vertexBuffer;
var indexBuffer;
var worldMatrix = mat4.create();
var viewMatrix = mat4.create();
var perspectiveMatrix = mat4.create();

var APOLLO = {};
var socket;
var players = [];
var player;

function initGraphics(){
            
        
        
    
        var canvas = document.getElementById('canvas');

        gl = initGL();
        APOLLO.gl = gl;
        APOLLO.Resources = { Meshes: {} };
        input = InputManager(canvas);
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
    
        initShaders();
    
        APOLLO.loaded = start;
        var objLoader = new APOLLO.OBJLoader();
        objLoader.load("./Box.obj", "box");
    
        
            
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
        player = new APOLLO.GameObject(new APOLLO.Mesh( APOLLO.Resources.Meshes["box"] ));
        player.id = data.id;
        players.push(player);
        for (var i = 0; i < data.users.length; i++)
            addPlayer(data.users[i]);
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
    
    


    APOLLO.mainCamera = new APOLLO.Camera(Math.PI/3.5, canvas.width/canvas.height, 1, 100);
    APOLLO.mainCamera.update();
    APOLLO.mainCamera.lookAt({ x: 0, y: 0, z: 0 });

    drawScene();
    setInterval(update, 15);
}

function addPlayer(data){
    var newPlayer = new APOLLO.GameObject(new APOLLO.Mesh( APOLLO.Resources.Meshes["box"] ));
    newPlayer.id = data.id;
    players.push(newPlayer);
}

function drawScene(){

    requestAnimationFrame(drawScene);
    APOLLO.mainCamera.update();
    //object.transform.UpdateMatrix();
    //object2.transform.UpdateMatrix();
    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    /*object.mesh.SetBuffers();
    setUniformMatrices(object, APOLLO.mainCamera);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    object2.mesh.SetBuffers();
    setUniformMatrices(object2, APOLLO.mainCamera);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);*/
    
    for (var i = 0; l = players.length, i < l; i++){
        players[i].transform.UpdateMatrix();
        players[i].mesh.SetBuffers();
        setUniformMatrices(players[i], APOLLO.mainCamera);
        gl.drawArrays(gl.TRIANGLES, 0, players[i].mesh.vertexCount); 
    }
        
}

function update(){
    
    var state = input.getInputState();

    if (state.f){
        APOLLO.mainCamera.follow(player);   
    }
    if (state.r){
        APOLLO.mainCamera.freeRoam();   
    }
    if (state.space){
        socket.emit("start game");   
    }
    if (state.leftArrow){
        player.transform.RotateY(0.1);
    }
    if (state.rightArrow){
        player.transform.RotateY(-0.1);
    }
    if (state.upArrow){
        APOLLO.mainCamera.Move(0, 0, -1);
    }
    if (state.downArrow){
        APOLLO.mainCamera.Move(0, 0, 1);
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

function initGL(){ 

    gl = canvas.getContext('webgl');

    if (!gl){
            alert('Your browser may not support WebGL.');
            gl = null;
    }

    return gl;
            
}

function initShaders(){
            
    //create shaders
    var vertex = getShader(gl, 'vertex-shader');
    var fragment = getShader(gl, 'fragment-shader');

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
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "position");
    shaderProgram.vertexTextureAttribute = gl.getAttribLocation(shaderProgram, "uv");
    shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "normal");
    
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    //gl.enableVertexAttribArray(shaderProgram.vertexTextureAttribute);
    //gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

    shaderProgram.wmLocation = gl.getUniformLocation(shaderProgram, "world");
    shaderProgram.vmLocation = gl.getUniformLocation(shaderProgram, "view");
    shaderProgram.pmLocation = gl.getUniformLocation(shaderProgram, "perspective");
}


function getShader(gl, shaderID){
            
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