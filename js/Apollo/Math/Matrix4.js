APOLLO.Matrix4 = function(){

        this.elements = new Float32Array( [ 
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
        ]);
}

APOLLO.Matrix4.prototype = {
        
        constructor: APOLLO.Matrix4,
        
        Set: function ( m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44 ){
                
                if ( arguments.length == 16 ){
                        var e = this.elements;
                        
                        e[ 0 ] = m11; e[ 4 ] = m21; e[ 8 ] = m31; e[ 12 ] = m41;
                        e[ 1 ] = m21; e[ 5 ] = m22; e[ 9 ] = m32; e[ 13 ] = m42;
                        e[ 2 ] = m31; e[ 6 ] = m23; e[ 10 ] = m33; e[ 14 ] = m43;
                        e[ 3 ] = m14; e[ 7 ] = m24; e[ 11 ] = m34; e[ 15 ] = m44;
                        
                }
                else{
                        console.error('Matrix4 does not currently support setting from vectors.');
                }
                
                return this;
        },
        
        Identity: function(){
                
                this.Set(
                        1, 0, 0, 0,
                        0, 1, 0, 0,
                        0, 0, 1, 0,
                        0, 0, 0, 1
                );
                
                return this;
        },
        
        Translate: function( x, y, z ){
        
                if ( y !== null && z !== null ){
                        
                        this.elements[12] += x;
                        this.elements[13] += y;
                        this.elements[14] += z;
                        
                }
                
                else if ( arguments.length == 1 ){
                        
                        var vec = x;
                        this.elements[12] += vec.x;
                        this.elements[13] += vec.y;
                        this.elements[14] += vec.z;
                        
                }
                
                return this;                      
        
        },
        
        RotateAxisAngle: function( axis, angle ){
                
                var s = Math.sin( angle );
                var c = Math.cos( angle );
                var t = 1 - c;
                var x = axis.x;
                var y = axis.y;
                var z = axis.z;
                var tx = t * x;
                var ty = t * y;
                
                
                //set 3x3 matrix with values
                var rm = [
                        tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			this.elements[12], this.elements[13], this.elements[14], 1
                ];
                
                this.MultiplyMatrix4(rm);
        
        },
        
        SetTranslation: function( x, y, z ){
        
                if ( y !== undefined && z !== undefined ){
                        
                        this.elements[12] = x;
                        this.elements[13] = y;
                        this.elements[14] = z;
                        
                }
                
                else if ( arguments.length == 1 ){
                        
                        var vec = x;
                        this.elements[12] = vec.x;
                        this.elements[13] = vec.y;
                        this.elements[14] = vec.z;
                        
                }
                
                return this;
        
        },
        
        ApplyRotationMatrix: function( mat ){
                
                var a = this.elements;
                var b = (mat.elements) ? mat.elements : mat;
                
                var rot = new Float32Array(16);
                
                rot[0] = 
                rot[1] = 
                rot[2] = 
                
                rot[4] = 
                rot[5] = 
                rot[6] = 
                
                rot[8] = 
                rot[9] = 
                rot[10] = 
                
                rot[12] = 
                rot[13] = 
                rot[14] = 
                
                
                rot[3] = 
                rot[7] = 
                rot[11] = 
                rot[15] = 

                this.Set.apply(this, rot);
        },
    
        MultiplyMatrix4: function( mat ){
                var a = this.elements;
                var b = (mat.elements) ? mat.elements : mat;
                
                var rot = new Float32Array(16);
                
                for (var i = 0; i < 4; i++){
                    for (var j = 0; j < 4; j++){
                        rot[i + j*4] = 0;
                        for (var k = 0; k < 4; k++)
                            rot[i + j*4] += a[i + k * 4] * b[k + j*4];
                    }
                }

                this.Set.apply(this, rot);
            
            
        },
    
    
        MakeRotation: function(){
            
        },
    
        MakeTranslation: function( x, y, z ){
           
            var mat = new APOLLO.Matrix4();
            mat.SetTranslation( x, y, z );
            return mat;
        },
    
        MakeScale: function(){
            
        }
        
        
        
        

}