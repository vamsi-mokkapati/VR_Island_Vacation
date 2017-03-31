var memeCube = (function() {
            var memes = []
            var memeTex = null;
            function constructor(position, height)
            {
            
            // Apply the foliage image texture
            if(!memeTex) {
            memeTex = new Texture.fromImageSrc('/img/friedman.jpg');
            }
            
            var memeMaterial = new Material(
                                               vec4(0.8, 1.0, 1.0, 1.0),
                                               vec4(0.3, 0.3, 0.3, 1.0)
                                               );
            this.position = position;
            this.height   = height;
            
            
            // The tree trunks are hexagonal prisms, while the tree leaves are spherical.
            //this.foliageRound  = new Sphere(foliageMaterial, foliageTex, false, null);
            this.memeSquare = new Cube(memeMaterial, memeTex, true, false, null);
            //this.foliageRound.radius = 2;
            
            memes.push(this);
            }
            
            constructor.getMemes = function() {
            return memes;
            }
            
            constructor.drawMemes = function(dt) {
            var identMat = mat4();
            
            glHelper.enableBumping(true);
            memes.forEach(function(e) {
                          e.draw(dt, mat4());
                          });
            glHelper.enableBumping(false);
            }
            
            return constructor;
            })();
/*
memeCube.prototype.checkCollision = function(pos, otherRadius) {
    //var treeRadius = 0.17 * this.radius;
    var memeHeight = 4 * this.height + heightOf(pos[0], pos[2]);
    
    if(pos[1] > memeHeight * 2) {
        return false;
    }
    
    var dist = subtract(pos, this.trunk.position);
    
    // Ignore y-component, and approximate using a cylinder shape
    var distSq = (dist[0] * dist[0]) + (dist[2] * dist[2]);
    var radiusSq = otherRadius + treeRadius;
    radiusSq *= radiusSq;
    
    return distSq <= radiusSq;
}
*/

memeCube.prototype.draw = function(dt, mat) {
    var pos = this.position;
    
    //var kX = this.radius;
    var kY = this.height;
    //var kZ = this.radius;
    
    //this.trunk.position = pos;
    //this.trunk.scale = vec3(kX * 0.1, 1.0 * kY, kZ * 0.1);

    this.memeSquare.position  = add(pos, vec3(0.0, 1.0 * kY, 0.0));
    this.memeSquare.scale		= vec3(8.7 * kY, 8.5 * kY, 8.7 * kY);
    
    //this.trunk.draw(dt, mat);
    this.memeSquare.draw(dt, mat);
}
