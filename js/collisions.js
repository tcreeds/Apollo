var EPSILON = 0.0001;

function checkCollision( a, b ){
        var dimA = [a.mesh.geometry.parameters.width, a.mesh.geometry.parameters.height, a.mesh.geometry.parameters.depth];
        var dimB = [b.mesh.geometry.parameters.width, b.mesh.geometry.parameters.height, b.mesh.geometry.parameters.depth];
        var posA = [a.position.x, a.position.y, a.position.z];
        var posB = [b.position.x, b.position.y, b.position.z];
    
        var dist;
        for (var i = 0; i < 3; i++){
                dist = Math.abs(posA[i] - posB[i]);
        if (dist > dimA[i]/2 + dimB[i]/2)
                return false;
        }
    
        return true;

}

function testOBBs( a, b ){
        
        var ra, rb, k;                                                  //penetration values, reused for each axis
        var ae = [a.halfWidths.x, a.halfWidths.y, a.halfWidths.z];      //halfwidths for object A
        var be = [b.halfWidths.x, b.halfWidths.y, b.halfWidths.z];      //halfwidths for object B
        var R, absR = [];                                               //transform from one object space to the other
        var t = new THREE.Vector3();                                    //separation distance between COMs
        var penetrations = new Array(15);                               //penetration distances for each test
        
        t.subVectors( a.position, b.position );
        t.set( dot3(t, a.axes[0]), dot3(t, a.axes[1]), dot3(t, a.axes[2]) );
        t = [t.x, t.y, t.z];
        R = [  dot3(a.axes[0], b.axes[0]),     dot3(a.axes[0], b.axes[1]),     dot3(a.axes[0], b.axes[2]),
                dot3(a.axes[1], b.axes[0]),     dot3(a.axes[1], b.axes[1]),     dot3(a.axes[1], b.axes[2]),
                dot3(a.axes[2], b.axes[0]),     dot3(a.axes[2], b.axes[1]),     dot3(a.axes[2], b.axes[2])   ];
        
        absR = [ Math.abs(R[0]) + EPSILON, Math.abs(R[1]) + EPSILON, Math.abs(R[2]) + EPSILON,
                Math.abs(R[3]) + EPSILON, Math.abs(R[4]) + EPSILON, Math.abs(R[5]) + EPSILON,
                Math.abs(R[6]) + EPSILON, Math.abs(R[7]) + EPSILON, Math.abs(R[8]) + EPSILON];
                
        //test on 15 axes
        
        //test L = A0, L = A1, L = A2
        for (var i = 0; i < 3; i++){
                k = i * 3;
                ra = ae[i];
                rb = be[0] * absR[k] + be[1] * absR[k+1] + be[2] * absR[k+2];
                penetrations[i] = Math.abs(t[i]);
                if (penetrations[i] > ra + rb) return false;
        }
        //test L = B0, L = B1, L = B2
        for (var i = 0; i < 3; i++) {
                k = i * 3;
                ra = ae[0] * absR[k] + ae[1] * absR[k+1] + ae[2] * absR[k+2];
                rb = be[i];
                penetrations[i+3] = Math.abs(t[0] * R[k] + t[1] * R[2+k] + t[2] * R[5+k]);
                if (penetrations[i+3] > ra + rb) return false;
        }
        //test L = A0 x B0
        ra = ae[1] * absR[6] + ae[2] * absR[3];
        rb = be[1] * absR[2] + be[2] * absR[1];
        penetrations[6] = Math.abs(t[2] * R[3] - t[1] * R[6]);
        if (penetrations[6] > ra + rb) return false;
        //test L = A0 x B1
        ra = ae[1] * absR[7] + ae[2] * absR[4];
        rb = be[0] * absR[2] + be[2] * absR[0];
        penetrations[7] = Math.abs(t[2] * R[4] - t[1] * R[7]);
        if (penetrations[7] > ra + rb) return false;
        //test L = A0 x B2
        ra = ae[1] * absR[8] + ae[2] * absR[5];
        rb = be[0] * absR[1] + be[1] * absR[0];
        penetrations[8] = Math.abs(t[2] * R[5] - t[1] * R[8]);
        if (penetrations[8] > ra + rb) return false;
        //test L = A1 x B0
        ra = ae[0] * absR[6] + ae[2] * absR[0];
        rb = be[1] * absR[5] + be[2] * absR[4];
        penetrations[9] = Math.abs(t[0] * R[6] - t[2] * R[0]);
        if (penetrations[9] > ra + rb) return false;
        //test L = A1 x B1
        ra = ae[0] * absR[7] + ae[2] * absR[1];
        rb = be[0] * absR[5] + be[2] * absR[3];
        penetrations[10] = Math.abs(t[0] * R[7] - t[2] * R[1]);
        if (penetrations[10] > ra + rb) return false;
        //test L = A1 x B2
        ra = ae[0] * absR[8] + ae[2] * absR[2];
        rb = be[0] * absR[4] + be[1] * absR[3];
        penetrations[11] = Math.abs(t[0] * R[8] - t[2] * R[2]);
        if (penetrations[11] > ra + rb) return false;
        //test L = A2 x B0
        ra = ae[0] * absR[3] + ae[1] * absR[0];
        rb = be[1] * absR[8] + be[2] * absR[7];
        penetrations[12] = Math.abs(t[1] * R[0] - t[0] * R[3]);
        if (penetrations[12] > ra + rb) return false;
        //test L = A2 x B1
        ra = ae[0] * absR[4] + ae[1] * absR[1];
        rb = be[0] * absR[8] + be[2] * absR[6];
        penetrations[13] = Math.abs(t[1] * R[1] - t[0] * R[4]);
        if (penetrations[13] > ra + rb) return false;
        //test L = A2 x B2
        ra = ae[0] * absR[5] + ae[1] * absR[2];
        rb = ae[0] * absR[7] + ae[1] * absR[6];
        penetrations[14] = Math.abs(t[1] * R[2] - t[0] * R[5]);
        if (penetrations[14] > ra + rb) return false;
        
        //collision, lets do this
        
        var min = 1.0;
        var index = 0;
        var normal;
        var planePoint = new THREE.Vector3();
        var vertices;
        var contactPoints = [];
        
        //calculates least separation
        for (var i = 1; i < 6; i++){
                if (penetrations[i] < penetrations[index]){
                        index = i;
                        min = penetrations[i];
                }
        }
        
        //calculate normal and point of plane based on axis
        //get points below reference face (inside of other collider)
        if (index < 3){
                
                vertices = rotateVertices( b.vertices, b.transform );
                testVertices( vertices, contactPoints, a, index );                        
                
        }
        else{
    
                vertices = rotateVertices( a.vertices, a.transform );
                testVertices( vertices, contactPoints, b, index );
                
        }
        /*
        else{
                //var as = (Math.floor(i / 3) - 2) == 0 ? "x" : ((Math.floor(i / 3) - 2 == 1) ? "y" : "z");
                //var bs = i % 3 == 0 ? "x" : (i % 3 == 1 ? "y" : "z"); 
                normal = cross3( a.axes[Math.floor(i / 3) - 3], b.axes[i % 3] );
                
                //find point to represent reference plane
        }*/
        
        //store collision data, return it
        t = new THREE.Vector3();
        t.subVectors( b.position, a.position );
        var collisionData = new CollisionData();
        collisionData.normal = t;
        collisionData.transform = R;
        if (contactPoints.length > 0)
                collisionData.point = contactPoints[0];
        collisionData.penetration = min;
        
        return collisionData;
}

function testVertices( verts, contactPoints, collider, index ){

        var testPoint = new THREE.Vector3();
        var normals = [];
        var points = [];
       
        generatePlane(index % 3, collider, normals, points);
        generatePlane((index + 1) % 3, collider, normals, points);
        generatePlane((index + 2) % 3, collider, normals, points);
        generatePlane((index + 1) % 3, collider, normals, points, true);
        generatePlane((index + 2) % 3, collider, normals, points, true);        
        
        //check each vertex against planes
        for (var i = 0; i < verts.length; i++){
                
                var flag = true;
                
                //test vertex against each plane, break if outside
                for (var j = 0; j < normals.length; j++){
                        testPoint.subVectors( verts[i], points[j] );
                        if (!(dot3( testPoint, normals[j] ) < 1)){
                                flag = false;
                                break;
                        }
                }
        
                //if vertex passes all plane checks, add to contact points
                if (flag)
                        contactPoints.push( verts[i] );
        }
}

//creates plane from collider's axis
function generatePlane( index, collider, normals, points, negate ){

        var normal = collider.axes[index].clone();
        if (index == 0)
                normal.multiplyScalar( collider.halfWidths.x );
        else if (index == 1)
                normal.multiplyScalar( collider.halfWidths.y );
        else if (index == 2)
                normal.multiplyScalar( collider.halfWidths.z );
        
        if (negate)
                normal.negate();
        var point = new THREE.Vector3();
        point.addVectors( collider.position, normal );
        normal.normalize();
        normals.push( normal );
        points.push( point );
}

function rotateVertices( verts, matrix ){
        var arr = new Array( verts.length );
        
        for (var i = 0; i < arr.length; i++){
                arr[i] = verts[i].clone();
                arr[i].applyMatrix4( matrix );
        }
        return arr;
}

function dot3( v1, v2 ){
        return  v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function cross3( v1, v2 ){
      
	var x = v1.y * v2.z - v1.z * v2.y;
	var y = v1.z * v2.x - v1.x * v2.z;
	var z = v1.x * v2.y - v1.y * v2.x;
        var vec = new THREE.Vector3;
        vec.set( x, y, z );
        return vec;
}