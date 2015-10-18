function init(){
    
    var c = document.getElementById('canvas');
    var input = InputManager(c);
    var ZeroVector = new THREE.Vector3(0, 0, 0);
    var cameraTarget = new THREE.Vector3(0, 0, 0);
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
    
    //creates cubes
    var shapes = [];
    shapes.push(createGeometry(scene, "box"));
    shapes.push(createGeometry(scene, "box"));
    
    //sets rotationaxis to y
    shapes[0].rotationAxis = new THREE.Vector3(0, 1, 0);
    shapes[1].rotationAxis = new THREE.Vector3(0, 1, 0);
    
    //positions shapes
    shapes[0].position.set(3, 0, 0);
    shapes[1].position.set(-3, 0, 0);
    
    shapes[0].setCollider();
    shapes[1].setCollider();
    
    //adds debug lines to shape
    addDebugLines(shapes[0].mesh);
    
    camera.position.y = 15;
    camera.position.z = 30;
    
    var render = function () {
        requestAnimationFrame( render );
       
        var state = input.getInputState();
        
        if (state.space)
            camera.position.y += 0.3;
        if (state.a)
            shapes[0].position.x -= 0.1;
        if (state.d)
            shapes[0].position.x += 0.1;
        if (state.w)
            shapes[0].position.z -= 0.1;
        if (state.s)
            shapes[0].position.z += 0.1;
        if (state.leftArrow)
            shapes[0].rotation.y -= 0.1;
        if (state.rightArrow)
            shapes[0].rotation.y += 0.1;
        if (state.upArrow)
            shapes[0].rotation.x += 0.1;
        if (state.downArrow)
            shapes[0].rotation.x -= 0.1;
        
        camera.lookAt(cameraTarget);
        renderer.render(scene, camera);
    };
    
    setInterval(function(){
        
        for (var i = 0; i < shapes.length; i++){
            shapes[i].mesh.material.color = green;
            shapes[i].updateCollider();
        }
        
        if (testOBBs(shapes[0].collider, shapes[1].collider)){
            shapes[0].mesh.material.color = red;
            shapes[1].mesh.material.color = red;
        }       
        
    }, 15);
    render();
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
    var go = new GameObject( mesh );
    go.velocity = new Vector3(0, 0, 0);
    return go;
}

function addDebugLines(obj){
    
    var lineMaterial1 = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    var geometry1 = new THREE.Geometry();
    geometry1.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry1.vertices.push(new THREE.Vector3(8, 0, 0));
    var xAxis = new THREE.Line( geometry1, lineMaterial1 );
    
    var lineMaterial2 = new THREE.LineBasicMaterial({
        color: 0xff0000
    });
    var geometry2 = new THREE.Geometry();
    geometry2.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry2.vertices.push(new THREE.Vector3(0, 8, 0));
    var yAxis = new THREE.Line( geometry2, lineMaterial2 );
    
    var lineMaterial3 = new THREE.LineBasicMaterial({
        color: 0x00ff00
    });
    var geometry3 = new THREE.Geometry();
    geometry3.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry3.vertices.push(new THREE.Vector3(0, 0, 8));
    var zAxis = new THREE.Line( geometry3, lineMaterial3 );
    
    obj.add( xAxis );
    obj.add( yAxis );
    obj.add( zAxis );
}
