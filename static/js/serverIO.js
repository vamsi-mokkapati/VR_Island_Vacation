/*

The goal of this file is to act as a module that the rest of the front
end code will use to update both camera data (i.e yaw, pitch, roll) and
positional data (x, y, z, speed, so on) such that depending on the mode
of the handler, such data is either pushed to the server or retrieved 
from it.

mode a string equal to either "laptop", in which case positional data
is sent to the server and camera angle data is received from it, or 
"headset", in which case the opposite occurs.

*/

var IOHandler = function(mode) {
	this.mode = mode;
	this.state = {
		posX: 0,
		posY: 0,
		posZ: 0,
		yaw: 0,
		pitch: 0,
		roll: 0,
	};

	var scope = this;

	// Poll information from the server and push information 
	// as relevant.
	this.updateInfo = function() {
		// Get information to be pushed
		var pushInfo = {};
		if (mode == "laptop") {
			pushInfo.clientID = "laptop";
			pushInfo.state = {
				posX: scope.state.posX,
				posY: scope.state.posY,
				posZ: scope.state.posZ
			};
		}
		else if (mode == "headset") {
			pushInfo.clientID = "headset";
			pushInfo.state = {
				yaw: scope.state.yaw,
				pitch: scope.state.pitch,
				roll: scope.state.roll
			};
		}

		$.ajax({
			method: "POST",
			url: "/apiSendInfo",
			// data: pushInfo,
			contentType: 'application/json',
			dataType: "json",
			data: JSON.stringify(pushInfo)
		}).done(function(data) {
			if (mode == "laptop") {
				scope.state.yaw = data.yaw;
				scope.state.pitch = data.pitch;
				scope.state.roll = data.roll;
			}
			else if (mode == "headset") {
				scope.state.posX = data.posX;
				scope.state.posY = data.posY;
				scope.state.posZ = data.posZ;
			}
		});
	};

	this.setPos = function(x, y, z) {
		scope.state.posX = posX;
		scope.state.posY = posY;
		scope.state.posZ = posZ;
	}

	this.setCamera = function(yaw, pitch, roll) {
		scope.state.yaw = yaw;
		scope.state.pitch = pitch;
		scope.state.roll = roll;
	}
}; 

// Assume mode is a global variable declared elsewhere.
var ioHandler = new IOHandler(mode);

var updateLoop = function() {
	// Call the ioHandler's update function
	ioHandler.updateInfo();
	setTimeout(updateLoop, 50);
}

updateLoop();