"use strict";
var footstepSound = new Audio("/sounds/footstep.mp3");
footstepSound.volume = .9;

var waveSound = new Audio("/sounds/crisp_ocean_waves.mp3");
waveSound.loop = true;
waveSound.volume= .2;


function Player(glCanvas, pos, speed) {
	this.camera = new Camera(glCanvas);
	this.camera.moveBy(pos[0], pos[1], pos[2]);

	this.forwardVelocity = 0.0;
	this.leftVelocity = 0.0;
	this.backVelocity = 0.0;
	this.rightVelocity = 0.0;
	this.movementSpeed = speed;
	this.isRunning = false;
	
	this.physical = new Physical(	vec3(0.0, -0.01, 0.0),	//acceleration
									0.0,					//bounce
									1.0,					//friction
									0.0);					//radius
	this.position = function()
	{
		return this.camera.position();
	}

	this.testMove = function(testX, testY, testZ)
	{
		var curHeight = this.position()[1];
		this.camera.moveBy(testX, testY, testZ);
		var testHeight = heightOf(this.position()[0], this.position()[2]);
		this.camera.moveBy(-testX, -testY, -testZ);
		
		return (testHeight - curHeight <= 0.2 && testHeight > 0.05);
	}

	this.move = function()
	{
		var startPosition = this.position();

		// Movement based on keyboard keys
		var xV = this.rightVelocity - this.leftVelocity;
		var yV = this.physical.velocity()[1];
		var zV = this.forwardVelocity - this.backVelocity;

		var newPos = add(startPosition, vec3(xV, yV, zV));
		var trees = Tree.getTrees();

		var rad = radians(this.camera.yaw());
		var sin = Math.sin(rad);
		var cos = Math.cos(rad);

		var heading = vec3(
			(zV * sin) - (xV * cos),
			0,
			(zV * cos) + (xV * sin)
		);

		for(var i = 0; i < trees.length; i++) {
			if(trees[i].checkCollision(newPos, this.movementSpeed)) {
				var d = dot(subtract(trees[i].position, startPosition), heading);
				if(d > 0) {
					continue;
				}

				zV = 0;
				xV = 0;
				break;
			}
			if (trees[i].checkCollisionMemeSquare(newPos, this.movementSpeed)) {
				var d = dot(subtract(trees[i].memeSquare.position, startPosition), heading);
				if(d > 0) {
					continue;
				}
				trees[i].playAudio();
			}
		}
        
		// Adjust velocities based on player's state
		if (this.physical.isAirborne())
		{
			if (this.isRunning && zV > 0)
				zV *= 1.5;
		}
		else
		{
			if (this.isRunning && zV > 0)
			{
				zV *= 1.5;
			}
		}
		
		if (this.testMove(xV, 0.0, 0.0))
			this.camera.moveBy(xV, 0.0, 0.0);
		else if (this.testMove(xV * Math.sqrt(3) / 2, 0.0, xV / 2))
			this.camera.moveBy(xV * Math.sqrt(3) / 2, 0.0, xV / 2);
		else if (this.testMove(xV * Math.sqrt(3) / 2, 0.0, -xV / 2))
			this.camera.moveBy(xV * Math.sqrt(3) / 2, 0.0, -xV / 2);
		else if (this.testMove(xV / 2, 0.0, xV * Math.sqrt(3) / 2))
			this.camera.moveBy(xV / 2, 0.0, xV * Math.sqrt(3) / 2);
		else if (this.testMove(xV / 2, 0.0, -xV * Math.sqrt(3) / 2))
			this.camera.moveBy(xV / 2, 0.0, -xV * Math.sqrt(3) / 2);

		if (this.testMove(0.0, 0.0, zV))
			this.camera.moveBy(0.0, 0.0, zV);
		else if (this.testMove(zV / 2, 0.0, zV * Math.sqrt(3) / 2))
			this.camera.moveBy(zV / 2, 0.0, zV * Math.sqrt(3) / 2);
		else if (this.testMove(-zV / 2, 0.0, zV * Math.sqrt(3) / 2))
			this.camera.moveBy(-zV / 2, 0.0, zV * Math.sqrt(3) / 2);
		else if (this.testMove(zV * Math.sqrt(3) / 2, 0.0, zV / 2))
			this.camera.moveBy(zV * Math.sqrt(3) / 2, 0.0, zV / 2);
		else if (this.testMove(-zV * Math.sqrt(3) / 2, 0.0, zV / 2))
			this.camera.moveBy(-zV * Math.sqrt(3) / 2, 0.0, zV / 2);

		this.camera.moveBy( 0.0, yV, 0.0);

		var attemptPosition = this.position();
		
		//Movement adjustment according to physics
		var finalMove = this.physical.physics(startPosition, attemptPosition);
		this.camera.moveBy(finalMove[0], finalMove[1], finalMove[2]);

		if (this.isCharging)
			this.armPower = Math.min(this.maxArmPower, this.armPower + 0.001);

		//footsteps
		if(yV!=0) {
		    footstepSound.pause();
		}

		else if(xV!=0 || zV!=0) {
		    footstepSound.play();
		}
		else {
		    footstepSound.pause();
		}
        
        //waves
        if(this.position()[1]<1.5) {
            waveSound.volume=.2;
            waveSound.play();
        }
        else if(this.position()[1]<8.0) {
            waveSound.volume=.1;
            waveSound.play();
        }
        else {
            waveSound.volume=.01;
        }
	}

	

	var blackMaterial = new Material(
		vec4(0.0, 0.0, 0.0, 1.0),
		vec4(0.0, 0.0, 0.0, 1.0)
	);

	var top    = new Cube(blackMaterial, null, true, false);
	var bottom = new Cube(blackMaterial, null, true, false);
	var left   = new Cube(blackMaterial, null, true, false);
	var right  = new Cube(blackMaterial, null, true, false);

	top.position    = vec3(0,  0.75, 0);
	bottom.position = vec3(0, -0.75, 0);
	top.scale = bottom.scale = vec3(0.25, 1.0, 1.0);

	left.position  = vec3(-0.75, 0, 0);
	right.position = vec3( 0.75, 0, 0);
	left.scale = right.scale = vec3(1.0, 0.25, 1.0);

	this.crosshairs = [top, bottom, left, right];

	var orthoMat = ortho( -.5,  .5, -.5, .5, -.5, .5);
	var identMat = mat4();
}

Player.prototype.draw = function(dt) {
	// Using a 32x32x32 box seems to make the crosshairs appropriately small
	var ratio = canvas.width / canvas.height;
	var orthoMat = ortho( -32 * ratio,  32 * ratio, -32, 32, -32, 32);
	var identMat = mat4();

	glHelper.setProjViewMatrix(orthoMat);
	this.crosshairs.forEach(function(e) {
		e.draw(0, identMat);
	});
}



// Key handler which will update our camera position
Player.prototype.handleKeyDown = function(e) {
	switch(e.keyCode) {
        case 87: // W - forward
			this.forwardVelocity = this.movementSpeed;
			break;
		case 65: // A - left
			this.leftVelocity = this.movementSpeed;
			break;
		case 83: // S - back
			this.backVelocity = this.movementSpeed;
			break;
		case 68: // D - right
			this.rightVelocity = this.movementSpeed;
			break;
		case 16: // SHIFT - run
			this.isRunning = true;
            footstepSound.playbackRate=2.0;
			break;
		case 32: // SPACE - jump
			var pos = this.position();
			if (pos[1] <= heightOf(pos[0], pos[2]) + 0.3)
			{
				this.physical.setFlight(true);
				this.physical.setVelocity(vec3(0.0, 0.10, 0.0));
			}
			break;
    }
    
}

Player.prototype.handleKeyUp = function(e) {
	switch(e.keyCode) {
        case 87: // W - forward
			this.forwardVelocity = 0.0;
			break;
		case 65: // A - left
			this.leftVelocity = 0.0;
			break;
		case 83: // S - back
			this.backVelocity = 0.0;
			break;
		case 68: // D - right
			this.rightVelocity = 0.0;
			break;
		case 16: // SHIFT - run
			this.isRunning = false;
            footstepSound.playbackRate=1.0;
			break;
        case 32: // SPACE - jump
			break;
    }
}

Player.prototype.handleMouseDown = function() {
	this.isCharging = true;
}
