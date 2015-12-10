
APOLLO.load = {
    
    loadCounter: 0,
    
    loadInitialized: function(){
        this.loadCounter++;   
    },
    
    loadComplete: function(){
        this.loadCounter --;
        if (this.loadCounter == 0)
            APOLLO.onload();
    },
    
    textureLoadComplete: function(texture, image, name){
        APOLLO.gl.bindTexture(APOLLO.gl.TEXTURE_2D, texture);
        APOLLO.gl.texImage2D(APOLLO.gl.TEXTURE_2D, 0, APOLLO.gl.RGBA, APOLLO.gl.RGBA, APOLLO.gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        gl.generateMipmap(gl.TEXTURE_2D);
        APOLLO.gl.bindTexture(gl.TEXTURE_2D, null);
        
        APOLLO.Resources.Textures[name] = texture;
        APOLLO.load.loadComplete();
    },
    
    texture: function(path, name){
        APOLLO.load.loadInitialized();
        var tex = APOLLO.gl.createTexture();
        var image = new Image();
        image.onload = function(){ APOLLO.load.textureLoadComplete(tex, image, name); };
        image.src = path;
    },
    
    obj: function(path, name){
         APOLLO.load.loadInitialized();

        $.ajax( {
            url: path,
            dataType: "text"
        }).success(function(data){
            APOLLO.load.objLoadComplete(data, name);  
        }).fail(function(){
            console.log("Could not load OBJ file " + path);  
        });  
    },
    
    objLoadComplete: function(data, name){
        var str = data.split("\n");
        var positions = [];
        var normals = [];
        var uvs = [];
        var vPositions = [];
        var vNormals = [];
        var vUvs = [];
        var vertexCount = 0;
        
        for (var i = 0; i < str.length; i++){
            var line = str[i].split(" ");
            
            if (line[0] === "v"){
                positions.push([
                    parseFloat(line[1]),
                    parseFloat(line[2]),
                    parseFloat(line[3])
                ]);
            }
            
            else if (line[0] === "vt"){
                uvs.push([   
                    parseFloat(line[1]),
                    parseFloat(line[2])
                ]);
            }
            
            else if (line[0] === "vn"){
                normals.push([
                    parseFloat(line[1]),
                    parseFloat(line[2]),
                    parseFloat(line[3])
                ]);
            }
            
            else if (line[0] === "f"){
                var f1 = line[1].split("/");
                var f2 = line[2].split("/");
                var f3 = line[3].split("/");
                
                Array.prototype.push.apply(vPositions, positions[f1[0] - 1]);   
                Array.prototype.push.apply(vUvs, uvs[f1[1] - 1]);
                Array.prototype.push.apply(vNormals, normals[f1[2] - 1]);
                 
                Array.prototype.push.apply(vPositions, positions[f2[0] - 1]);   
                Array.prototype.push.apply(vUvs, uvs[f2[1] - 1]);
                Array.prototype.push.apply(vNormals, normals[f2[2] - 1]);
                 
                Array.prototype.push.apply(vPositions, positions[f3[0] - 1]); 
                Array.prototype.push.apply(vUvs, uvs[f3[1] - 1]); 
                Array.prototype.push.apply(vNormals, normals[f3[2] - 1]);       
                
                vertexCount += 3;
                
            }
        }
        
        console.log("number of vertices " + (vertexCount));
        console.log(vPositions);
        console.log(vNormals);
        console.log(vUvs);
        var vertexData = {
            positions: vPositions,
            vertexCount: vertexCount,
            normals: vNormals,
            uvs: vUvs
        };
        APOLLO.Resources.Meshes[name] = vertexData;
        APOLLO.load.loadComplete();   
    }
    
    
    
}