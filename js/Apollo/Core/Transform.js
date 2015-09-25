APOLLO.Transform = function(){

        this.position = new APOLLO.Vector3();
        this.rotation = new APOLLO.Vector3();
        this.scale = new APOLLO.Vector3(1, 1, 1);
        
        this.forward = new APOLLO.Vector3(0, 0, 1);
        this.right = new APOLLO.Vector3(1, 0, 0);
        this.up = new APOLLO.Vector3(0, 1, 0);
    
        this.angle = 0;
        
        this.rotationMatrix = new APOLLO.Matrix4();
        this.matrix = new APOLLO.Matrix4();
        //this.quaternion = new APOLLO.Quaternion();

}

APOLLO.Transform.prototype = {

        constructor: APOLLO.transform,
        
        Update: function(){
                
        },
        
        Translate: function( x, y, z ){
                
                if ( arguments.length == 3)
                        this.position.Add( x, y, z );
                else if (arguments.length == 1)
                        this.position.Add( x ); 
                
        },
        
        SetPosition: function( x, y, z ){
                
                if (arguments.length == 3)
                        this.position.Set( x, y, z );
                else if (arguments.length == 1)
                        this.position.Set( x.x, x.y, x.z );
                
        },
        
        Scale: function(x, y, z){
            x = x !== null && x !== undefined ? x : 1;
            y = y !== null && y !== undefined ? y : 1;
            z = z !== null && z !== undefined ? z : 1;  
            this.scale.x = this.scale.x * x;
            this.scale.y = this.scale.y * y;
            this.scale.z = this.scale.z * z;
        },
    
        RotateAxisAngle: function( axis, angle ){
                this.rotationMatrix.RotateAxisAngle( axis, angle );
        },
        
        RotateY: function( angle ){
                this.rotationMatrix.RotateY( angle );
        },
        
        UpdateMatrix: function(){
            this.matrix.Identity();
            this.matrix.MakeTranslation( this.matrix, this.position.x, this.position.y, this.position.z );
            this.matrix.MultiplyMatrix4( this.rotationMatrix );       
            this.matrix.Scale(this.scale.x, this.scale.y, this.scale.z);
            //console.log(this.matrix);
            
            var e = this.matrix.elements;
            this.right.Set(e[0], e[1], e[2]);
            this.up.Set(e[4], e[5], e[6]);
            this.forward = APOLLO.Vector3.Cross(this.right, this.up);
        }
}