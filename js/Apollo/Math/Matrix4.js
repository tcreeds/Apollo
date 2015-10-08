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
                        
                        e[ 0 ] = m11; e[ 1 ] = m12; e[ 2 ] = m13; e[ 3 ] = m14;
                        e[ 4 ] = m21; e[ 5 ] = m22; e[ 6 ] = m23; e[ 7 ] = m24;
                        e[ 8 ] = m31; e[ 9 ] = m32; e[ 10 ] = m33; e[ 11 ] = m34;
                        e[ 12 ] = m41; e[ 13 ] = m42; e[ 14 ] = m43; e[ 15 ] = m44;
                        
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
    
        Clone: function(out){
            out = out || new APOLLO.Matrix4();
            var t = this.elements, o = out.elements;
            o[0] = t[0];
            o[1] = t[1];
            o[2] = t[2];
            o[3] = t[3];
            o[4] = t[4];
            o[5] = t[5];
            o[6] = t[6];
            o[7] = t[7];
            o[8] = t[8];
            o[9] = t[9];
            o[10] = t[10];
            o[11] = t[11];
            o[12] = t[12];
            o[13] = t[13];
            o[14] = t[14];
            o[15] = t[15];
            return out;
            
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
    
        Rotate: function(x, y, z){
            
            if (x)
                this.RotateX(x);
            if (y)
                this.RotateY(y)
            if (z)
                this.RotateZ(z);
                
            return this;
        },
    
        RotateX: function(x){
            if (!x)
                return this;
            var c = Math.cos(x);
            var s = Math.sin(x);
            var m = new Float32Array( [ 
                1,  0,  0,  0,
                0,  c,  s,  0,
                0,  -s,  c,  0,
                0,  0,  0,  1
            ]);
            this.MultiplyMatrix4(m);
            return this;
        },
    
        RotateY: function(y){
            if (!y)
                return this;
            var c = Math.cos(y);
            var s = Math.sin(y);
            var m = new Float32Array( [ 
                c,  0,  -s,  0,
                0,  1,  0,  0,
                s,  0,  c,  0,
                0,  0,  0,  1
            ]);
            this.MultiplyMatrix4(m);
            return this;
        },
    
        RotateZ: function(z){
            if (!z)
                return this;
            var c = Math.cos(z);
            var s = Math.sin(z);
            var m = new Float32Array( [ 
                c,  s,  0,  0,
                -s, c,  0,  0,
                0,  0,  1,  0,
                0,  0,  0,  1
            ]);
            this.MultiplyMatrix4(m);
            return this;
        },
        
        RotateAxisAngle: function( axis, angle ){
                
                var s = Math.sin( angle );
                var c = Math.cos( angle );
                var t = 1 - c;
                var mag = Math.abs(axis.x * axis.x + axis.y * axis.y + axis.z * axis.z), 
                mag = 1 / mag;
                var x = axis.x * mag;
                var y = axis.y * mag;
                var z = axis.z * mag;
                var tx = t * x;
                var ty = t * y;
                
                
                //set 3x3 matrix with values
                var rm = [
                        tx * x + c,         tx * y + s * z,     tx * z - s * y,    0,
                        tx * y - s * z,     ty * y + c,         ty * z + s * x,    0,
                        tx * z + s * y,     ty * z - s * x,     t * z * z + c,     0,
                        0/*this.elements[12]*/,  0/*this.elements[13]*/,  0/*this.elements[14]*/, 1
                ];
                
                this.MultiplyMatrix4(rm);
        
        },
    
        Scale: function(x, y, z){
            var s = new APOLLO.Matrix4();
            x = x !== null && x !== undefined ? x : 1;
            y = y !== null && y !== undefined ? y : 1;
            z = z !== null && z !== undefined ? z : 1;
            s.Set(
                x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1
            );
            this.MultiplyMatrix4(s);
            return this;
                
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
                
                /*rot[0] = 
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
                rot[15] = */

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
    
        MakeTranslation: function( out, x, y, z ){
            if (!out) out = new APOLLO.Matrix4();
            out.SetTranslation( x, y, z );
            return out;
        },
    
        MakeScale: function(){
            
        }
        
        
        
        

}

Object.defineProperties(APOLLO.Matrix4,
    {
        "0 ": { get: function(){ return this.elements[0]; } },  
        "1 ": { get: function(){ return this.elements[1]; } },  
        "2 ": { get: function(){ return this.elements[2]; } },  
        "3 ": { get: function(){ return this.elements[3]; } },  
        "4 ": { get: function(){ return this.elements[4]; } },  
        "5 ": { get: function(){ return this.elements[5]; } },  
        "6 ": { get: function(){ return this.elements[6]; } },  
        "7 ": { get: function(){ return this.elements[7]; } },  
        "8 ": { get: function(){ return this.elements[8]; } },  
        "9 ": { get: function(){ return this.elements[9]; } },  
        "10": { get: function(){ return this.elements[10]; } },  
        "11": { get: function(){ return this.elements[11]; } },  
        "12": { get: function(){ return this.elements[12]; } },  
        "13": { get: function(){ return this.elements[13]; } },  
        "14": { get: function(){ return this.elements[14]; } },  
        "15": { get: function(){ return this.elements[15]; } },  
    }
);