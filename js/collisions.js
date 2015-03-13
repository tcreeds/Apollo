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
        
        var ra, rb, k;
        var ae = [a.halfWidths.x, a.halfWidths.y, a.halfWidths.z];
        var be = [b.halfWidths.x, b.halfWidths.y, b.halfWidths.z];
        var R, absR = [];
        var t = new THREE.Vector3();
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
                if (Math.abs(t[i]) > ra + rb) return false;
        }
        //test L = B0, L = B1, L = B2
        for (var i = 0; i < 3; i++) {
                k = i * 3;
                ra = ae[0] * absR[k] + ae[1] * absR[k+1] + ae[2] * absR[k+2];
                rb = be[i];
                if (Math.abs(t[0] * R[k] + t[1] * R[2+k] + t[2] * R[5+k]) > ra + rb) return false;
        }
        //test L = A0 x B0
        ra = ae[1] * absR[6] + ae[2] * absR[3];
        rb = be[1] * absR[2] + be[2] * absR[1];
        if (Math.abs(t[2] * R[3] - t[1] * R[6]) > ra + rb) return false;
        //test L = A0 x B1
        ra = ae[1] * absR[7] + ae[2] * absR[4];
        rb = be[0] * absR[2] + be[2] * absR[0];
        if (Math.abs(t[2] * R[4] - t[1] * R[7]) > ra + rb) return false;
        //test L = A0 x B2
        ra = ae[1] * absR[8] + ae[2] * absR[5];
        rb = be[0] * absR[1] + be[1] * absR[0];
        if (Math.abs(t[2] * R[5] - t[1] * R[8]) > ra + rb) return false;
        //test L = A1 x B0
        ra = ae[0] * absR[6] + ae[2] * absR[0];
        rb = be[1] * absR[5] + be[2] * absR[4];
        if (Math.abs(t[0] * R[6] - t[2] * R[0]) > ra + rb) return false;
        //test L = A1 x B1
        ra = ae[0] * absR[7] + ae[2] * absR[1];
        rb = be[0] * absR[5] + be[2] * absR[3];
        if (Math.abs(t[0] * R[7] - t[2] * R[1]) > ra + rb) return false;
        //test L = A1 x B2
        ra = ae[0] * absR[8] + ae[2] * absR[2];
        rb = be[0] * absR[4] + be[1] * absR[3];
        if (Math.abs(t[0] * R[8] - t[2] * R[2]) > ra + rb) return false;
        //test L = A2 x B0
        ra = ae[0] * absR[3] + ae[1] * absR[0];
        rb = be[1] * absR[8] + be[2] * absR[7];
        if (Math.abs(t[1] * R[0] - t[0] * R[3]) > ra + rb) return false;
        //test L = A2 x B1
        ra = ae[0] * absR[4] + ae[1] * absR[1];
        rb = be[0] * absR[8] + be[2] * absR[6];
        if (Math.abs(t[1] * R[1] - t[0] * R[4]) > ra + rb) return false;
        //test L = A2 x B2
        ra = ae[0] * absR[5] + ae[1] * absR[2];
        rb = ae[0] * absR[7] + ae[1] * absR[6];
        if (Math.abs(t[1] * R[2] - t[0] * R[5]) > ra + rb) return false;
        
        return true;
}

function dot3( v1, v2 ){
        return  v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}