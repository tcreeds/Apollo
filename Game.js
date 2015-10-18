window.onload = function(){
    var canvas = document.getElementById('canvas');
    APOLLO.init(canvas);   
    APOLLO.draw = draw;
    APOLLO.update = update;
}

function draw(){
    APOLLO.gl.viewport(0, 0, APOLLO.gl.viewportWidth, APOLLO.gl.viewportHeight);
    APOLLO.gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    APOLLO.gl.activeTexture(APOLLO.gl.TEXTURE0);
    APOLLO.gl.uniform1i(APOLLO.gl.getUniformLocation(shaderProgram, "sampler"), 0);
    //APOLLO.setUniform("sampler", 0);
    /*object.mesh.SetBuffers();
    setUniformMatrices(object, APOLLO.mainCamera);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);

    object2.mesh.SetBuffers();
    setUniformMatrices(object2, APOLLO.mainCamera);
    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);*/
    
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
    
}