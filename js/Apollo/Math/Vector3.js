APOLLO.Vector3 = function(){

        this.x = arguments[0] || 0;
        this.y = arguments[1] || 0;
        this.z = arguments[2] || 0;
        this.magnitude = 0;
        this.flags = 1;
        
}

APOLLO.Vector3.prototype = {

        constructor: APOLLO.Vector3,
        
        updateMagnitude: 1,
        
        Set: function( x, y, z ){
        
                this.x = x || this.x;
                this.y = y || this.y;
                this.z = z || this.z;
                
        },
        
        SetX: function( x ){
        
                this.x = x;
                return this;
                
        },
        
        SetY: function( y ){
        
                this.y = y;
                return this;
        
        },
        
        SetZ: function( z ){
                
                this.z = z;
                return this;
                
        },
        
        Normalize: function(){
        
                var length = this.Magnitude();
                this.x  = this.x / length;
                this.y = this.y / length;
                this.z = this.z / length;
                
        },
        
        Magnitude: function(){
                
                if (this.flags & this.updateMagnitude){
                        this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                        this.flags &= ~this.updateMagnitude;
                }
                
                return this.magnitude;
                
        },
        
        Dot: function( vec ){
                
                return this.x * vec.x + this.y * vec.y + this.z * vec.z;
        
        },
        
        Cross: function( vec ){
                
                var x = this.x,
                    y = this.y,
                    z = this.z;
                
                this.x = y * vec.z - z * vec.y;
                this.y = z * vec.x - x * vec.z;
                this.z = x * vec.y - y * vec.x;
                
                return this;
        }
        
        

}
