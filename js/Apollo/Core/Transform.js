APOLLO.Transform = function(){

        this.position = new APOLLO.Vector3();
        this.rotation = new APOLLO.Vector3();
        this.scale = new APOLLO.Vector3();
    
        this.angle = 0;
        
        this.rotationMatrix = new APOLLO.Matrix4();
        this.matrix = new APOLLO.Matrix4();
        //this.quaternion = new APOLLO.Quaternion();

}

APOLLO.Transform.prototype = {

        constructor: APOLLO.transform,
        
        up: new APOLLO.Vector3(0, 1, 0),
        
        Update: function(){
                
        },
        
        Translate: function( x, y, z ){
                
                if ( arguments.length == 3)
                        this.position.AddVector( x, y, z );
                else if (arguments.length == 1)
                        this.position.AddVector( x ); 
                
        },
        
        SetPosition: function( x, y, z ){
                
                if (arguments.length == 3)
                        this.position.Set( x, y, z );
                else if (arguments.length == 1)
                        this.position.Set( x.x, x.y, x.z );
                
        },
        
        RotateAxisAngle: function( axis, angle ){
                this.rotationMatrix.RotateAxisAngle( axis, angle );
        },
        
        RotateY: function( angle ){
                this.rotationMatrix.RotateAxisAngle( this.up, angle );
        },
        
        UpdateMatrix: function(){
            this.matrix = this.matrix.MakeTranslation( this.position.x, this.position.y, this.position.z );
            this.matrix.MultiplyMatrix4( this.rotationMatrix );       
            
        }
}