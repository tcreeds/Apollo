APOLLO.Vector3 = function(){
        this.x = arguments[0] || 0;
        this.y = arguments[1] || 0;
        this.z = arguments[2] || 0;
}

APOLLO.Vector3.normalize = function(){
        var length = this.magnitude();
        this.x  = this.x / length;
        this.y = this.y / length;
        this.z = this.z / length;
}

APOLLO.Vector3.magnitude = function(){
        return this.x * this.x + this.y * this.y + this.z * this.z;
}