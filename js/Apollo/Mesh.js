APOLLO.Mesh = function Mesh( vertexData ){
    
        this.transform = mat4.create();
    
        this.vertices = vertexData.vertices;
        this.indices = vertexData.indices;
            
        APOLLO.CreateGeometry.call( this );
        
        mat4.identity(this.transform);

}

