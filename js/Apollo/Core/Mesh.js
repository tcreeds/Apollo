APOLLO.Mesh = function Mesh( vertexData ){
    
    this.vertices = new Float32Array(vertexData.positions);
    this.normals = new Float32Array(vertexData.normals);
    this.vertexCount = vertexData.vertexCount;
    this.indices = vertexData.indices;
    
    this.uvs = new Float32Array(vertexData.uvs);

    this.CreateGeometry();

}

APOLLO.Mesh.prototype = {

    constructor: APOLLO.Mesh,

    CreateGeometry: function () {

        this.vertexBuffer = APOLLO.gl.createBuffer();
        this.normalBuffer = APOLLO.gl.createBuffer();
        this.uvBuffer = APOLLO.gl.createBuffer();

        var size = Float32Array.BYTES_PER_ELEMENT;
        
        APOLLO.gl.bindBuffer(APOLLO.gl.ARRAY_BUFFER, this.vertexBuffer);
        APOLLO.gl.bufferData(APOLLO.gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        APOLLO.gl.bindBuffer(APOLLO.gl.ARRAY_BUFFER, this.normalBuffer);
        APOLLO.gl.bufferData(APOLLO.gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW);
        
        APOLLO.gl.bindBuffer(APOLLO.gl.ARRAY_BUFFER, this.uvBuffer);
        APOLLO.gl.bufferData(APOLLO.gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);
        
        
        //APOLLO.gl.vertexAttribPointer(APOLLO.gl.vertexNormalAttribute, 3, APOLLO.gl.FLOAT, false, stride, 5 * size);
    },
    
    SetBuffers: function(){       
        
        APOLLO.gl.bindBuffer(APOLLO.gl.ARRAY_BUFFER, this.vertexBuffer);   
        APOLLO.gl.vertexAttribPointer(APOLLO.gl.vertexPositionAttribute, 3, APOLLO.gl.FLOAT, false, 0, 0);
        APOLLO.gl.bindBuffer(APOLLO.gl.ARRAY_BUFFER, this.normalBuffer); 
        APOLLO.gl.vertexAttribPointer(APOLLO.gl.vertexNormalAttribute, 3, APOLLO.gl.FLOAT, true, 0, 0);
        APOLLO.gl.bindBuffer(APOLLO.gl.ARRAY_BUFFER, this.uvBuffer); 
        APOLLO.gl.vertexAttribPointer(APOLLO.gl.vertexTextureAttribute, 2, APOLLO.gl.FLOAT, false, 0, 0)
        
    }
    
}



