APOLLO.OBJLoader = function( filepath ) {
    
    
    
}

APOLLO.OBJLoader.prototype = {
    
    load: function(path, name){
        var that = this;
        
        $.ajax( {
            url: path,
            dataType: "text"
        }).success(function(data){
            that.processData(data, name);  
        }).fail(function(){
            console.log("Could not load OBJ file " + path);  
        });  
    },
    
    processData: function(data, name){
        //console.log(data);   
        
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
            normals: vPositions,
            uvs: vUvs
        };
        APOLLO.Resources.Meshes[name] = vertexData;
        APOLLO.loaded();
    }
    
    
}