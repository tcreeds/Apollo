APOLLO.Camera = function(fov, aspectRatio, near, far){
    
    this.fov = fov || Math.PI/4;
    this.aspectRatio = aspectRatio || 3/2;
    this.near = near || 10;
    this.far = far || 1000;
    
    this.viewMatrix = new APOLLO.Matrix4();
    this.projectionMatrix = new APOLLO.Matrix4();
    this.position = new APOLLO.Vector3();
    this.position.z = 5;
    this.position.y = 2;
    this.los = new APOLLO.Vector3(0, 0, -1);
    
    this.right = new APOLLO.Vector3(1, 0, 0);
    this.forward = new APOLLO.Vector3(0, 0, 1);
    this.up = new APOLLO.Vector3(0, 1, 0);
    
    this.VPMatrix = undefined;
    this.target = undefined;
}

APOLLO.Camera.prototype = {
    
    makeOrthographic: function( left, right, top, bottom, near, far ){
        
        this.projectionMatrix.Set(
            2 / ( right - left ), 0, 0, ( right + left ) / ( right - left ),
            0, 2 / ( top - bottom ), 0, ( top + bottom ) / ( top   - bottom ),
            0, 0, -2 / ( far - near ),  ( far + near )   / ( far   - near ),
            0, 0, 0, 1 
        );
        
    },
    
    makePerspective: function( fov, aspectRatio, near, far ){
        if (!fov) fov = this.fov;
        if (!aspectRatio) aspectRatio = this.aspectRatio;
        if (!near) near = this.near;
        if (!far) far = this.far;
        
        var f = 1.0 / Math.tan(fov / 2);
        var dist = 1.0 / (near - far);
        this.projectionMatrix.Set(
            f/aspectRatio,  0,  0,                                      0,
            0,              f,  0,                                      0,
            0,              0,  (far + near) * dist,                    -1,
            0,              0,  2 * far * near * dist,                  0
        );
        return this.projectionMatrix;
            
    },
    
    makeLookAt: function(target, position){
        position = position || this.position;
        target = target || this.target || APOLLO.Vector3.Zero;
        target = target.position || target;
        var zaxis = APOLLO.Vector3.Subtract(position, target).Normalize();
        var xaxis = APOLLO.Vector3.Cross(APOLLO.Vector3.Up, zaxis).Normalize();
        var yaxis = APOLLO.Vector3.Cross(zaxis, xaxis);
        
        var e = this.viewMatrix.elements;
        
        e[0] =  xaxis.x;
        e[1] =  yaxis.x;
        e[2] =  zaxis.x;
        e[3] =  0;
        e[4] =  xaxis.y;
        e[5] =  yaxis.y;
        e[6] =  zaxis.y;
        e[7] =  0;
        e[8] =  xaxis.z;
        e[9] =  yaxis.z;
        e[10] = zaxis.z;
        e[11] = 0;
        e[12] = -xaxis.Dot(position);
        e[13] = -yaxis.Dot(position);
        e[14] = -zaxis.Dot(position);
        e[15] = 1;
        return this.viewMatrix.elements;
        
    },
    
    makeLookTo: function(los, position){
        los = los || this.los;
        position = position || this.position;
        this.makeLookAt(APOLLO.Vector3.Add(los, position));
        //this.viewMatrix.Translate(-position.x, -position.y, -position.z).RotateY(y).RotateX(x);
        return this.viewMatrix;
    },
    
    update: function(){
        if (this.target){
            this.position.Set(this.target.position);
            this.position.Sub(this.target.forward.x * 5, -4, this.target.forward.z * 5);
            this.makeLookAt();
        }
        else{
            this.makeLookTo();   
        }
        
        this.makePerspective();
        //this.VPMatrix = this.makeLookTo().Clone().MultiplyMatrix4(this.makePerspective());
    },
    
    translate: function(x, y, z){
        this.position.Add(x, y, z);
    },
    
    Move: function(x, y, z){
        var e = this.viewMatrix.elements;
        
        this.right.Set(e[0], e[1], e[2]);
        this.up.Set(e[4], e[5], e[6]);
        APOLLO.Vector3.Cross(this.right, this.up, this.forward);
        this.translate(
            (this.right.x + this.up.x + this.forward.x) * x,
            (this.right.y + this.up.y + this.forward.y) * y,
            (this.right.z + this.up.z + this.forward.z) * z    );
    },
    
    rotate: function(x, y, z){
        this.viewMatrix.Rotate(x, y, z);
    },
    
    lookAt: function(target, position){
        if (!target)
            console.warn("Camera.lookAt must take a Vector3 target.");
        position = position || this.position;
        this.makeLookAt(target, position);
    },
    
    follow: function(target){
        if (!target)
            return;
        if (target.position)
            this.target = target;
        else if (target.transform)
            this.target = target.transform;
    },
    
    freeRoam: function(){
        this.target = undefined;   
    }
    
}