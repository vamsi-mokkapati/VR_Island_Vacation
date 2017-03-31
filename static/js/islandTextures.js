"use strict"

var Island = (function() {
    // Vertex, normals, textures, and tangents for grass
    var vbo = null;
    var nbo = null;
    var tbo = null;
	var tanbo = null;
              
              
    // Vertex, normals, textures, and tangents for sand
    var sandvbo = null;
    var sandnbo = null;
    var sandtbo = null;
    var sandtanbo = null;

    var groundTexture;
    var groundMaterial = new Material(
        vec4(0.8, 0.9, 0.5, 1.0),
        vec4(0.8, 0.7, 0.7, 1.0)
    );
    
    var sandTexture;
    
    var vertices = [];
    var normals = [];
    var texCoordinates = [];
	var tangents = [];
    
    var sandVertices = [];
    var sandNormals = [];
    var sandTexCoordinates = [];
    var sandTangents = [];
              
    for (var x = 0; x < islandSize; x++) {
        for (var z = 0; z < islandSize; z++) {
              var ll = [x, heights[x][z], z];
              var ul = [x, heights[x][z+1], z+1];
              var lr = [x+1, heights[x+1][z], z];
              var ur = [x+1, heights[x+1][z+1], z+1];
              
              if (ul[1] <= 0.75) {
                    sandVertices.push(ll);
                    sandVertices.push(ul);
                    sandVertices.push(ur);
                    sandVertices.push(ur);
                    sandVertices.push(lr);
                    sandVertices.push(ll);
              
                    var n1=plane(ul,ur,ll);
                    var n2=plane(lr,ll,ur);
              
                    sandNormals.push(n1);
                    sandNormals.push(n1);
                    sandNormals.push(n1);
                    sandNormals.push(n2);
                    sandNormals.push(n2);
                    sandNormals.push(n2);
              
                    sandTexCoordinates.push(0.0, 1.0);
                    sandTexCoordinates.push(1.0, 1.0);
                    sandTexCoordinates.push(1.0, 0.0);
                    sandTexCoordinates.push(1.0, 0.0);
                    sandTexCoordinates.push(0.0, 0.0);
                    sandTexCoordinates.push(0.0, 1.0);
              
                    sandTangents.push(0.0, 0.0, 0.0);
                    sandTangents.push(0.0, 0.0, 0.0);
                    sandTangents.push(0.0, 0.0, 0.0);
                    sandTangents.push(0.0, 0.0, 0.0);
                    sandTangents.push(0.0, 0.0, 0.0);
                    sandTangents.push(0.0, 0.0, 0.0);
              }
              else {
                    vertices.push(ll);
                    vertices.push(ul);
                    vertices.push(ur);
                    vertices.push(ur);
                    vertices.push(lr);
                    vertices.push(ll);
              
                    var n1=plane(ul,ur,ll);
                    var n2=plane(lr,ll,ur);
              
                    normals.push(n1);
                    normals.push(n1);
                    normals.push(n1);
                    normals.push(n2);
                    normals.push(n2);
                    normals.push(n2);
              
                    texCoordinates.push(0.0, 1.0);
                    texCoordinates.push(1.0, 1.0);
                    texCoordinates.push(1.0, 0.0);
                    texCoordinates.push(1.0, 0.0);
                    texCoordinates.push(0.0, 0.0);
                    texCoordinates.push(0.0, 1.0);
              
                    tangents.push(0.0, 0.0, 0.0);
                    tangents.push(0.0, 0.0, 0.0);
                    tangents.push(0.0, 0.0, 0.0);
                    tangents.push(0.0, 0.0, 0.0);
                    tangents.push(0.0, 0.0, 0.0);
                    tangents.push(0.0, 0.0, 0.0);
              }
        }
    }
    
    // Send all vertex data to GPU
	var initVertexData = function() {
		if(!gl) {
			throw "Unable to init Island data, gl not defined";
		}

        groundTexture = new Texture.fromImageSrc('/img/grass.jpg');
        sandTexture = new Texture.fromImageSrc('/img/sand.jpg');

		vbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

		nbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, nbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

		tbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoordinates), gl.STATIC_DRAW);

		tanbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, tanbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(tangents), gl.STATIC_DRAW);
        
        sandvbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sandvbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(sandVertices), gl.STATIC_DRAW);

		sandnbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sandnbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(sandNormals), gl.STATIC_DRAW);

		sandtbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sandtbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(sandTexCoordinates), gl.STATIC_DRAW);
        
        sandtanbo = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, sandtanbo);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(sandTangents), gl.STATIC_DRAW);

	};
              
              // Set up grass and sand textures with the image files and shapes.
              
              var islandConstructor = function() {
              
              if(!vbo || !nbo || !tbo) {
              initVertexData();
              }
              
              this.grass=new Shape(vbo, nbo, tanbo, tbo, null, vertices.length, groundMaterial, groundTexture, null);
              this.sand=new Shape(sandvbo, sandnbo, sandtanbo, sandtbo, null, sandVertices.length, null, sandTexture, null);
              
              };
    
    return islandConstructor;

})();

inheritPrototype(Island, Shape);

Island.prototype.draw = function(dt, mat) {
    // Draw the grass and the sand
    this.grass.draw(dt, mat);
    this.sand.draw(dt, mat);
}

