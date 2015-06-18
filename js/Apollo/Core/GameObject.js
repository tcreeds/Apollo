APOLLO.GameObject = function GameObject( mesh ){
    this.mesh = mesh;
    //this.mesh.position.set(Math.random() * 20 - 10, Math.random() * 20, Math.random() * 20 - 10);
    this.transform = new APOLLO.Transform();
    this.collider = undefined;
    this.appliedForce = new APOLLO.Vector3();
    this.inverseMass = 1;
}

APOLLO.GameObject.prototype = {

        constructor: APOLLO.GameObject,

        Update: function(){
        
                this.transform.Update();
            
                /*this.velocity.x += this.appliedForce.x * this.inverseMass;
                this.velocity.y += this.appliedForce.y * this.inverseMass;
                this.velocity.z += this.appliedForce.z * this.inverseMass;

                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                this.position.z += this.velocity.z;*/

                //this.mesh.rotateOnAxis(this.rotationAxis, this.rotationAxis.lengthManhattan() / 100);


                this.appliedForce.x = this.appliedForce.y = this.appliedForce.z = 0;
                
        }
        
        
    
}


