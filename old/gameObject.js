function GameObject(mesh){
    this.mesh = mesh;
    this.mesh.position.set(Math.random() * 20 - 10, Math.random() * 20, Math.random() * 20 - 10);
    this.position = this.mesh.position;
    this.velocity = new THREE.Vector3(Math.random() * 0.2, Math.random() * 0.2, Math.random() * 0.2);
    this.rotationAxis = undefined;
    this.rotation = this.mesh.rotation;
    this.appliedForce = new THREE.Vector3();
    this.inverseMass = 1/5;
}

function update(){
    if (this.velocity){
            this.velocity.x += this.appliedForce.x * this.inverseMass;
            this.velocity.y += this.appliedForce.y * this.inverseMass;
            this.velocity.z += this.appliedForce.z * this.inverseMass;
            
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.position.z += this.velocity.z;
    }
    var axis = this.rotationAxis.clone();
    axis.normalize();
    this.mesh.rotateOnAxis(axis, this.rotationAxis.length());
    
    this.rotationAxis.multiplyScalar( 0.99 );
   
    
    this.appliedForce.x = this.appliedForce.y = this.appliedForce.z = 0;
    
}

function setCollider(){
    
    var params = this.mesh.geometry.parameters;
    this.collider = new Collider(this.position, 
                        [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)],
                        new THREE.Vector3(params.width/2, params.height/2, params.depth/2), 
                        this.mesh.geometry.vertices,
                        this.mesh.matrix        );   
}

function updateCollider(){
    http://nic-gamedev.blogspot.com/2011/11/quaternion-math-getting-local-axis.html
    //sets axes of collider from object quaternion
    var w = this.mesh.quaternion.w;
    var x = this.mesh.quaternion.x;
    var y = this.mesh.quaternion.y;
    var z = this.mesh.quaternion.z;

    this.collider.axes[0].set(1 - 2 * (y * y + z * z),
                2 * (x * y + w * z),
                2 * (x * z - w * y));
    
    this.collider.axes[1].set(2 * (x * y - w * z),
                1 - 2 * (x * x + z * z),
                2 * (y * z + w * x));
    
    this.collider.axes[2].set(2 * (x * z + w * y),
                2 * (y * x - w * x),
                1 - 2 * (x * x + y * y));

}

function applyForce( f ){
    
    this.appliedForce.x += f.x;
    this.appliedForce.y += f.y;
    this.appliedForce.z += f.z;
    
}

//get forward, left right, up in local space

//transform vector by rotation
function toWorldSpace( vec ){

    var dx = this.rotationAxis.x * this.rotation;
    var dy = this.rotationAxis.y * this.rotation;
    var dz = this.rotationAxis.z * this.rotation;
    
    var vector = new THREE.Vector3( vec.z, vec.y, vec.z );
    
    rotateY( vector, dy );
    rotateX( vector, dx );
    rotateZ( vector, dz );
    
    return vector;
    
}

function rotateX( vec, angle ){
    vec.y = Math.sin( angle );
    vec.z = Math.cos( angle );
}

function rotateY( vec, angle ){
    vec.x += Math.sin( angle )
    vec.z += Math.cos( angle );
}

function rotateZ( vec, angle ){
    vec.y = Math.sin( angle );
    vec.x = Math.cos( angle );
}

GameObject.prototype.update = update;
GameObject.prototype.toWorldSpace = toWorldSpace;
GameObject.prototype.setCollider = setCollider;
GameObject.prototype.updateCollider = updateCollider;