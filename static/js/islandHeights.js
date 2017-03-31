"use strict"

var islandSize = 60;
var quarterSize = Math.trunc(islandSize*.5);
var heights = [];
var steepness = .3;

// Averaging functions to ensure smooth textures. The following averages
// are for the upper left, upper right, lower left, and lower right portions
// of the island.

function findAvg(x, z) {
    var avg = (heights[x-1][z-1] + heights[x  ][z-1] + heights[x+1][z-1] +
               heights[x-1][z  ] + heights[x  ][z  ] + heights[x+1][z  ] +
               heights[x-1][z+1] + heights[x  ][z+1] + heights[x+1][z+1]) / 9;
    return avg;
}

function ulAvg(x, z) {
    var avg = (heights[x-1][z-1] + heights[x][z-1] + heights[x-1][z]) / 3;
    return avg;
}

function urAvg(x, z) {
    var avg = (heights[x][z-1] + heights[x+1][z-1] + heights[x+1][z]) / 3;
    return avg;
}

function llAvg(x, z) {
    var avg = (heights[x-1][z] + heights[x-1][z+1] + heights[x][z+1]) / 3;
    return avg;
}

function lrAvg(x, z) {
    var avg = (heights[x][z+1] + heights[x+1][z+1] + heights[x+1][z]) / 3;
    return avg;
}

for(var x=0; x<islandSize+1; x++) {
    heights[x]=[];
    for(var z=0; z<islandSize+1; z++) {
        heights[x][z]=-0.15;
    }
}


// Upper Left
for(var x = 1; x < quarterSize; x++) {
    for(var z = 1; z < quarterSize; z++) {
        heights[x][z] = (x % 4 != 0) ? ulAvg(x,z)+(steepness*Math.random()) : ulAvg(x,z)-(steepness*Math.random());
    }
}

// Lower Right
for(var x = islandSize - 1; x > quarterSize; x--) {
    for(var z = islandSize - 1; z >= quarterSize; z--) {
        heights[x][z] = (x % 4 != 0) ? lrAvg(x,z)+(steepness*Math.random()) : lrAvg(x,z)-(steepness*Math.random());
    }
}

// Upper Right
for(var x = islandSize - 21; x > quarterSize; x--) {
    for(var z = islandSize - 21; z >= quarterSize; z--) {
        heights[x][z] = (x % 4 != 0) ? lrAvg(x,z)+(1*Math.random()) : findAvg(x,z)-(0*Math.random());
    }
}

// Lower Left
for(var x = quarterSize; x < islandSize; x++) {
    for(var z = quarterSize; z > 0; z--) {
        heights[x][z] = (x % 2 == 0) ? llAvg(x,z)+(steepness*Math.random()) : llAvg(x,z)-(steepness*Math.random());
    }
}

// Use the average function to smoothen all textures
for(var x = 1; x < islandSize; x++) {
    for(var z = 1; z < islandSize; z++) {
        heights[x][z]=findAvg(x,z);
    }
}
