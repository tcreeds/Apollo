APOLLO.Mesh = function Mesh( vertexData ){
    
        this.vertices = vertexData.vertices;
        this.indices = vertexData.indices;
            
        this.CreateGeometry();

}

APOLLO.Mesh.prototype = {

        constructor: APOLLO.Mesh,
        
        CreateGeometry: function () {
    
                this.vertexBuffer = APOLLO.gl.createBuffer();
                this.indexBuffer = APOLLO.gl.createBuffer();


                APOLLO.gl.bindBuffer(APOLLO.gl.ARRAY_BUFFER, this.vertexBuffer);
                APOLLO.gl.bufferData(APOLLO.gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
                
                APOLLO.gl.bindBuffer(APOLLO.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
                APOLLO.gl.bufferData(APOLLO.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);
    
        }
    
}



