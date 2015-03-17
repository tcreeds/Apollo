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
                        
                        e[ 0 ] = m11; e[ 4 ] = m12; e[ 8 ] = m13; e[ 12 ] = m14;
                        e[ 1 ] = m21; e[ 5 ] = m22; e[ 9 ] = m23; e[ 13 ] = m24;
                        e[ 2 ] = m31; e[ 6 ] = m32; e[ 10 ] = m33; e[ 14 ] = m34;
                        e[ 3 ] = m41; e[ 7 ] = m42; e[ 11 ] = m43; e[ 15 ] = m44;
                        
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
        
                if ( arguments.length == 3){
                        
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
        
        SetTranslation: function( x, y, z ){
        
                if ( arguments.length == 3){
                        
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
        
        }
        
        

}