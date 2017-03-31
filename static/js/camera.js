"use strict";

/**
 * Camera will rotate about three axes: yaw, pitch, and roll.
 * Although this implementation is more complicated than repeatedly
 * multiplying into an orientation matrix, it allows us to ask the
 * camera questions like "where are you?" and "which direction are you
 * looking at?", which will be useful for moving the plaer over hills,
 * as well as implementing clipping of objects that are not visible.
 *
 * This also makes it that all movements are NOT relative to the camera's
 * current position, e.g. if the camera has rolled to the side, pitching
 * is done relative to the xz-plane, and not the camera's orientation.
 * This makes the camera behave in a way that is expected of first person
 * games that navigate with a mouse.
 *
 * This implementation IS vulnerable to gimbal lock.
 */
function Camera(glCanvas) {
	var fovx = 90;
	var canvas = glCanvas;
	var position = vec3(0.0, 0.0, 0.0);
	var yaw = 0;
	var pitch = 0;
	var roll = 0;
	var lean = 0;


	this.updatePosition = function(x, y, z) {
		position = vec3(x, y, z);
	}
	
	// Positve right strafes camera right
	// Positve up lifts camera up
	// Positive forward strafes camera forward
	// If mode = "laptop", change the camera position based on input 
	// and save that information in the IO handler.
	// Otherwise, update position based on information 
	// from serverIO.
	this.moveBy = function(right, up, forward) {
		if (mode == "laptop") {
			var rad = radians(yaw);
			var sin = Math.sin(rad);
			var cos = Math.cos(rad);

			var translation = vec3(
				(forward * sin) + (right * cos),
				up,
				(forward * cos) - (right * sin)
			);

			position = add(position, translation);
			ioHandler.state.posX = position[0];
			ioHandler.state.posY = position[1];
			ioHandler.state.posZ = position[2];
		}
		else if (mode == "headset") {
			position = vec3(
				ioHandler.state.posX, 
				ioHandler.state.posY, 
				ioHandler.state.posZ
			);
		}
	};

	this.yaw = function() {
		return -yaw;
	}

	this.pitch = function() {
		return pitch;
	}

	this.getRoll = function() {
        return roll;
    }

	this.position = function() {
		return vec3(position[0], position[1], -position[2]);
	}

	// Positive angle corresponds to yawing left
	// If the mode is "laptop", set the camera yaw to the 
	// information from the serverIO.
	// Otherwise, preform yaw calculations (?) and push them
 	// to the server.
	this.yawBy = function(angle) {
		if (mode == "laptop")
			yaw = ioHandler.state.yaw;
		else if (mode == "headset") {
			yaw = (yaw - angle) % 360;
			ioHandler.state.yaw = yaw;
		}
	}

	// Positive angle corresponds to pitching up
	// Same logic as above.
	this.pitchBy = function(angle) {
		if (mode == "laptop")
			pitch = ioHandler.state.pitch;
		else if (mode == "headset") {
			pitch = Math.max(-90, Math.min(90, (pitch - angle)));
			ioHandler.state.pitch = pitch;
		}
	}

	// Positive angle corresponds to rolling camera left
	// (world rotates to the right)
	// Same logic as above.
	this.rollBy = function(angle) {
		if (mode == "laptop")
			roll = ioHandler.state.roll;
		else if (mode == "headset") {
			roll = (roll - angle) % 360;
			ioHandler.state.roll = roll;
		}
	}

	// Positive angle corresponds to yawing left
	// If the mode is "laptop", set the camera yaw to the 
	// information from the serverIO.
	// Otherwise, preform yaw calculations (?) and push them
 	// to the server.
	this.setYaw = function(angle) {
		if (mode == "laptop")
			yaw = ioHandler.state.yaw;
		else if (mode == "headset") {
			yaw = angle;
			ioHandler.state.yaw = yaw;
		}
	}

	// Positive angle corresponds to pitching up
	// Same logic as above.
	this.setPitch = function(angle) {
		if (mode == "laptop")
			pitch = ioHandler.state.pitch;
		else if (mode == "headset") {
			pitch = angle;
			ioHandler.state.pitch = pitch;
		}
	}

	// Positive angle corresponds to rolling camera left
	// (world rotates to the right)
	// Same logic as above.
	this.setRoll = function(angle) {
		if (mode == "laptop")
			roll = ioHandler.state.roll;
		else if (mode == "headset") {
			roll = angle;
			ioHandler.state.roll = roll;
		}
	}

	this.getProjViewMatrix = function(focalLength, eye) {
		var scissorBox = gl.getParameter(gl.SCISSOR_BOX);
		// height is box param 3, width is box param 2
		var hwRatio = scissorBox[3] / scissorBox[2];
		var fovy;
		if (mode == "headset")
			fovy = 1 * Math.atan(hwRatio * Math.tan(radians(fovx) / 2));
		else 
			fovy = 2 * Math.atan(hwRatio * Math.tan(radians(fovx) / 2));
		var fovyDegree = fovy * 180 / Math.PI;
		var proj = perspective(fovyDegree, canvas.width / canvas.height, .05, 500);
		var leanRad = radians(lean);

		// Set pitch
		var orientation = rotate(pitch, vec3(1, 0, 0));

		// Set lean
		orientation = mult(orientation, translate(-Math.sin(leanRad), -Math.cos(leanRad), 0));

		// Set heading
		orientation = mult(orientation, rotate(roll,  vec3(0, 0, 1)));
		orientation = mult(orientation, rotate(yaw,   vec3(0, 1, 0)));

		// Set position
		orientation = mult(orientation, translate(-position[0], -position[1], position[2]));
		// Set a slight eye translation in the event this goes to the headset
		if (mode == "headset") {
			var offset = (eye == 0) ? (focalLength / 2) : (-focalLength / 2);
			orientation = mult(translate(offset, 0, 0), orientation);
		}
		return mult(proj, orientation);
	};

	this.setFovx = function(f) {
		fovx = Math.max(30, Math.min(150, f));
	};

	// A positive angle zooms in
	this.zoomBy = function(angle) {
		this.setFovx(fovx - angle);
	};

	// Lean's camera left/right, e.g. when walking
	this.setLean = function(angle) {
		lean = Math.min(45, Math.max(-45, -angle));
	}

	this.leanBy = function(angle) {
		this.setLean(-lean + angle);
	}
}
