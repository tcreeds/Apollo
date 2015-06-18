function resolveCollision(obj1, obj2, data){
        
        if (data.point === 0){
                console.log("Nope.");
                return;
        }
        
        
        //calculate rAP rBP - center of mass to collision point
        var rAP = new THREE.Vector3();
        rAP.subVectors( data.point, obj1.position );
        var rBP = new THREE.Vector3();
        rBP.subVectors( data.point, obj2.position );
        
        var v1 = obj1.velocity.clone();
        var v2 = obj2.velocity.clone();
        v1.projectOnVector( rAP );
        v2.projectOnVector( rBP );
        
        //calculate vAB - velocities projected onto vec from center of mass to collision point
        var vAB = new THREE.Vector3();
        vAB.subVectors( v1, v2 );
        
        //get moments of inertia - simple formula for cubes
        var ha = obj1.collider.halfWidths;
        var hb = obj1.collider.halfWidths;
        var IA = new THREE.Matrix3();
        IA.set( ha.x * obj1.inverseMass, 0, 0,
                0, ha.y * obj1.inverseMass, 0, 
                0, 0, ha.z * obj1.inverseMass );
        var IB = new THREE.Matrix3();
        IB.set( hb.x * obj2.inverseMass, 0, 0,
                0, hb.y * obj2.inverseMass, 0,
                0, 0, hb.z * obj2.inverseMass );
        
        var impulse = (-(data.restitution+1) * dot3(vAB, data.normal));
        var mass = obj1.inverseMass + obj2.inverseMass;
        
        var cross1 = cross3( rAP, data.normal );
        cross1.multiply( cross1 );
        cross1.applyMatrix3( IA );
        
        var cross2 = cross3( rBP, data.normal );
        cross2.multiply( cross2 );
        cross2.applyMatrix3( IB );
        
        var comb = new THREE.Vector3();
        comb.addVectors( cross1, cross2 );
        
        impulse = impulse * mass / dot3( comb, data.normal );
        
        var vA = data.normal.clone();
        vA.multiplyScalar( -impulse * obj1.inverseMass );
        var vB = data.normal.clone();
        vB.multiplyScalar( impulse * obj2.inverseMass );
        
        //apply impulse as per hecker's equation
        
        //apply linear impulse
        obj1.velocity.add( vA );
        obj2.velocity.add( vB );
        
        //apply angular impulse
        cross1 = data.normal.clone();
        cross1.multiplyScalar( impulse );
        cross1.crossVectors( rAP, cross1 );
        cross1.applyMatrix3( IA );
        
        cross2 = data.normal.clone();
        cross2.multiplyScalar( impulse );
        cross2.crossVectors( rBP, cross2 );
        cross2.applyMatrix3( IB );
        
        obj1.rotationAxis.add( cross1 );
        obj2.rotationAxis.add( cross2 );
        
        if (data.penetration > 5)
                console.log('Ya fucked up');
        
        //resolve penetration
        data.normal.multiplyScalar( data.penetration/10 );
        
        obj1.position.sub(data.normal);
        obj2.position.add(data.normal);
        
        if (!(obj1.position.x && obj2.position.x))
                console.log('Ya dun goofed.');
        
        console.log("Collision");
        
        
        
        
        
}