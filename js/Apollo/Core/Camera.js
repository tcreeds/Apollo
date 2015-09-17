APOLLO.Camera = function(fov, aspectRatio, near, far){
    
    this.fov = fov || 45;
    this.aspectRatio = aspectRatio || 3/2;
    this.near = near || 10;
    this.far = far || 1000;
    
    this.viewMatrix = new APOLLO.Matrix4();
    this.projectionMatrix = new APOLLO.Matrix4();
    this.position = new APOLLO.Matrix4();
    this.los = new APOLLO.Vector3(0, 0, 1);
    
    this.VPMatrix = undefined;
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
            0,              0,  (far + near) / dist,                    2 * far * near * dist,
            0,              0,  -1,                                     0
        );
        return this.projectionMatrix;
            
    },
    
    makeLookAt: function(){
        
    },
    
    makeLookTo: function(los, position){
        if (!los) los = this.los;
        if (!position) position = this.position;
        
        this.viewMatrix.Identity();
        
        var len = los.Magnitude();
        var x = Math.sin(los.x / len),
            y = Math.sin(los.y / len),
            z = Math.sin(los.z / len);
        this.viewMatrix.Translate(-position.x, -position.y, -position.z).Rotate(x, y, z);
        return this.viewMatrix;
    },
    
    update: function(){
        this.VPMatrix = this.makeLookTo().MultiplyMatrix4(this.makePerspective());
    }
    
}