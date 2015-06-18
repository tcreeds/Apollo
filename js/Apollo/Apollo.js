var gl;
var object;
var shaderProgram;
var vertexBuffer;
var indexBuffer;
var worldMatrix = mat4.create();
var viewMatrix = mat4.create();
var perspectiveMatrix = mat4.create();

var APOLLO = {};

function initGraphics(){
            
        var canvas = document.getElementById('canvas');

        gl = initGL();
        APOLLO.gl = gl;
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
         
        object = makeObject();
        //initBuffers();
         
         
        drawScene();
        setInterval(update, 15);
            
}

function drawScene(){

        requestAnimationFrame(drawScene);
        
        object.transform.UpdateMatrix();
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.identity(object.transform);
        mat4.identity(viewMatrix);
        mat4.translate(viewMatrix, viewMatrix, [0.0, 0.0, -5.0]);
        mat4.perspective(perspectiveMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.mesh.indexBuffer);
        
        gl.vertexAttribPointer(gl.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        
        setUniformMatrices();
        
        gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
        
}

function update(){
    object.Update();
        var state = input.getInputState();
        
        if (state.leftArrow)
                object.transform.RotateY(0.1);
        if (state.rightArrow)
                object.transform.RotateY(-0.1);
        if (state.a){
                object.transform.Translate(-0.1, 0, 0);
        }
        if (state.d){
                object.transform.Translate(0.1, 0, 0);
        }
        if (state.w)
                object.transform.Translate(0, 0.1, 0);
        if (state.s)
                object.transform.Translate(0, -0.1, 0);
}

function setUniformMatrices(){
        gl.uniformMatrix4fv(shaderProgram.wmLocation, false, object.transform.matrix.elements);           //give gameobject a transform, hook up matrix and write translate
        gl.uniformMatrix4fv(shaderProgram.vmLocation, false, viewMatrix);
        gl.uniformMatrix4fv(shaderProgram.pmLocation, false, perspectiveMatrix);
        
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
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
            
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