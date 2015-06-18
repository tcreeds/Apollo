Apollo.Quaternion = function( x, this.y, z, w ) {
    
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    this.w = w || 0;
    
}

Apollo.Quaternion.prototthis.ype = {
    
    RotateByQuaternion: function() {
        
    },
    
    RotateByMatrix: function(){
        
    },
    
    ToMatrix: function(){
        var matrix = new Apollo.Matrix4();
        m = matrix.elements;
        
        m[0] = 1.0f - 2.0f * this.y * this.y - 2.0f * this.z * this.z;
        m[1] = 2.0f * this.z * this.y + 2.0f * this.w * this.z;
        m[2] = 2.0f * this.x * this.z - 2.0f * this.w * this.y;
        m[3] = 0.0f;

        m[4] = 2.0f * this.x * this.y - 2.0f * this.w * this.z;
        m[5] = 1.0f - 2.0f * this.x * this.x - 2.0f * this.z * this.z;
        m[6] = 2.0f * this.y * this.z + 2.0f * this.w * this.x;
        m[7] = 0.0f;

        m[8] = 2.0f * this.x * this.z + 2.0f * this.w * this.y;
        m[9] = 2.0f * this.y * this.z - 2.0f * this.w * this.x;
        m[10] = 1.0f - 2.0f * this.x * this.x - 2.0f * this.y * this.y;
        m[11] = 0.0f;

        m[12] = 0.0f;
        m[13] = 0.0f;
        m[14] = 0.0f;
        m[15] = 1.0f;
    }
    
}