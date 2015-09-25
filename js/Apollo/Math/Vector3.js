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
            if (arguments.length === 3){
                this.SetX(arguments[0]);
                this.SetY(arguments[1]);
                this.SetZ(arguments[2]);
            }
            else if (arguments.length === 1){
                this.SetX(arguments[0].x);
                this.SetY(arguments[0].y);
                this.SetZ(arguments[0].z);
            }
                
        },
        
        SetX: function( x ){
                
                this.x = x === undefined || x === null ? this.x : x;
                return this;
                
        },
        
        SetY: function( y ){
        
                this.y = y === undefined || y === null ? this.y : y;
                return this;
        
        },
        
        SetZ: function( z ){
                
                this.z = z === undefined || z === null ? this.z : z;
                return this;
                
        },
        
        Normalize: function(){
        
                var length = this.Magnitude();
                this.x  = this.x / length;
                this.y = this.y / length;
                this.z = this.z / length;
                return this;
        },
        
        Magnitude: function(){
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                if (this.flags & this.updateMagnitude){
                        this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
                        this.flags &= ~this.updateMagnitude;
                }
                
                return this.magnitude;
                
        },
    
        Multiply: function( val ){
            this.x *= val;
            this.y *= val;
            this.z *= val;
        },
        
        Add: function( x, y, z ){
            this.x += x;
            this.y += y;
            this.z += z;
        },
    
        Sub: function( x, y, z ){
            this.x -= x;
            this.y -= y;
            this.z -= z;
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

APOLLO.Vector3.Add = function(v1, v2, out){
    out = out || new APOLLO.Vector3();
    out.x = v1.x + v2.x;
    out.y = v1.y + v2.y;
    out.z = v1.z + v2.z;
    return out;
}

APOLLO.Vector3.Subtract = function(v1, v2, out){
    out = out || new APOLLO.Vector3();
    out.x = v1.x - v2.x;
    out.y = v1.y - v2.y;
    out.z = v1.z - v2.z;
    return out;
}

APOLLO.Vector3.Cross = function(v1, v2, out){
    out = out || new APOLLO.Vector3();
    out.x = v1.y * v2.z - v1.z * v2.y;
    out.y = v1.z * v2.x - v1.x * v2.z;
    out.z = v1.x * v2.y - v1.y * v2.x;
    return out;
}

Object.defineProperties(APOLLO.Vector3, {
    Up: {
        value: new APOLLO.Vector3(0, 1, 0),
        writable: false
    },
    Zero: {
        value: new APOLLO.Vector3(0, 0, 0),
        writable: false
    }
});