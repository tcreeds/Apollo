APOLLO.Transform = function(){

        this.position = new APOLLO.Vector3();
        this.rotation = new APOLLO.Vector3();
        this.scale = new APOLLO.Vector3();
        
        this.matrix = new APOLLO.Matrix4();

}

APOLLO.Transform.prototype = {

        constructor: APOLLO.transform,
        
        Update: function(){
        
                
                
        },
        
        Translate: function( x, y, z ){
                
                if ( arguments.length == 3)
                        this.matrix.Translate( x, y, z );
                else if (arguments.length == 1)
                        this.matrix.Translate( x ); 
                
        },
        
        SetPosition: function( vec ){
                
                if (arguments.length == 3)
                        this.matrix.SetTranslation( x, y, z );
                else if (arguments.length == 1)
                        this.matrix.SetTranslation( x );
                
        }
        
}