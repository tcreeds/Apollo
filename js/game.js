function initWebGL(){
    
    var c = document.getElementById('canvas');
    var input = InputManager(c);
    var ZeroVector = new THREE.Vector3(0, 0, 0);
    var cameraTarget = new THREE.Vector3(0, 10, 0);
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    var red = new THREE.Color( 0xff0000 );
    var green = new THREE.Color( 0x00ff00 );
    
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 45, width/height, 0.1, 1000 );
    var renderer = new THREE.WebGLRenderer({ canvas: c });
    renderer.setSize( width, height );
    
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
    directionalLight.position.set( 0, 1, -0.2 );
    scene.add( directionalLight );
    
    var light2 = new THREE.AmbientLight( 0x202020 );
    scene.add(light2);
    
    //adds box wireframe to show square boundaries    
    var cube = new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), new THREE.MeshBasicMaterial({
        wireframe: true,
        color: 'blue'
      }));
      cube.position.y = 10;
      scene.add(cube);
    
    var shapes = [];
    shapes.push(createGeometry(scene, "box"));
    shapes.push(createGeometry(scene, "box"));
    shapes.push(createGeometry(scene, "box"));
    shapes[0].rotationAxis = new THREE.Vector3(0.05, 0, 0);
    shapes[1].rotationAxis = new THREE.Vector3(0, 0.05, 0);
    shapes[2].rotationAxis = new THREE.Vector3(0, 0, 0.05);
    shapes[0].setCollider();
    shapes[1].setCollider();
    shapes[2].setCollider();
    
    camera.position.y = 25;
    camera.position.z = -40;
    
    var render = function () {
        requestAnimationFrame( render );
       
        var state = input.getInputState();
        
        if (state.space)
            camera.position.y += 0.3;
        if (state.a)
            camera.position.x -= 0.3;
        if (state.d)
            camera.position.x += 0.3;
        if (state.w)
            camera.position.z -= 0.3;
        if (state.s)
            camera.position.z += 0.3;
        if (state.leftArrow)
            camera.rotation.y -= 0.08;
        if (state.rightArrow)
            camera.rotation.y += 0.08;
        if (state.upArrow)
            camera.rotation.x += 0.08;
        if (state.downArrow)
            camera.rotation.x -= 0.08;
        
        camera.lookAt(cameraTarget);
        renderer.render(scene, camera);
    };
    setInterval(function(){
        
       for (var i = 0; i < shapes.length; i++){
            shapes[i].mesh.material.color = green;
            shapes[i].updateCollider();
        }
        
        for (var i = 0; i < shapes.length; i++){
            shapes[i].update();
            if (shapes[i].position.x > 10){
                shapes[i].position.setX(10);
                shapes[i].velocity.x *= -1;
            }
            else if (shapes[i].position.x < -10){
                shapes[i].position.setX(-10);
                shapes[i].velocity.x *= -1;
            }
            else if (shapes[i].position.y > 20){
                shapes[i].position.setY(20);
                shapes[i].velocity.y *= -1;
            }
            if (shapes[i].position.y < 0){
                shapes[i].position.setY(0);
                shapes[i].velocity.y *= -1;
            }
            if (shapes[i].position.z > 10){
                shapes[i].position.setZ(10);
                shapes[i].velocity.z *= -1;
            }
            else if (shapes[i].position.z < -10){
                shapes[i].position.setZ(-10);
                shapes[i].velocity.z *= -1;
            }
            for (var j = i + 1; j < shapes.length; j++){
                if (j != i){
                    var data = testOBBs(shapes[i].collider, shapes[j].collider);
                    if (data){
                        resolveCollision(shapes[i], shapes[j], data);
                        shapes[i].mesh.material.color = red;
                        shapes[j].mesh.material.color = red;
                    }
                }
            }
        }
        
        
    }, 15);
    render();
}

function move(speed, player, rotation){
    player.position.x += speed * Math.sin(rotation);
    player.position.z += speed * Math.cos(rotation);
}

function strafe(speed, player, currentRotation){
    var rotation = currentRotation + Math.PI / 2;
    player.position.x += speed * Math.sin(rotation);
    player.position.z += speed * Math.cos(rotation);
}

function alignCameraToPlayer( camera, player, rotation, distance ){
    camera.position.y = player.position.y + distance/2;
    camera.position.x = player.position.x + distance * Math.sin(rotation);
    camera.position.z = player.position.z + distance * Math.cos(rotation);
}

function createGeometry(scene, type){
    var geometry;
    if (type == 'sphere')
        geometry = new THREE.SphereGeometry( 0.5, 10, 10 );
    else if (type == 'box')
        geometry = new THREE.BoxGeometry( 5, 5, 5 );
    var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    var mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    return new GameObject( mesh );
}

