// Goal is to echo keypresses sent from the front end
// to the other client. Whenever a client experiences
// a button press, it will send that information
// to the server to be stored by the server.
// Periodically, both clients will
// call home to the server, looking for new updated 
// keypress information from the other client. The server
// basically just sends json data representing the current
// key presses of the other client. 

var express = require('express');
var path = require('path');

// Start the laptop state with the following values. 
// This gets sent to the headset periodically when the
// headset calls home.
var laptopState = {
	posX: null,
	posY: null,
	posZ: null,
	// wPressed: false,
	// aPressed: false,
	// sPressed: false,
	// dPressed: false // known bug: this should default to true
};

// Same as above, but reversed.
var headsetState = {
	yaw: null,
	pitch: null,
	roll: null
};

//app: Express application. 
module.exports = function(app) {

	// Receive information from a client.
	app.get('/apiGetInfo', function(req, res) {
		// Get which client's informaiton we are requesting
		var clientID = req.query.clientID;
		if (clientID == null) {
			return res.send({error: "Missing clientID!"});
		}

		// Send the appropriate information.
		var toSend = (clientID == "laptop") ? laptopState : headsetState;
		return res.send(toSend);
	});

	// Receive an update from a client and send the other client's info.
	app.post('/apiSendInfo', function(req, res) {
		var clientID = req.body.clientID;
		var state = req.body.state;
		if (clientID == null) {
			return res.send({error: "Missing clientID!"});
		}
		if (state == null) {
			return res.send({error: "Missing state!"});
		}

		console.log(req.body);

		// Update the appropriate state and return the other one.
		if (clientID == "laptop") {
			laptopState = state;
			res.send(headsetState);
		}
		else if (clientID == "headset") {
			headsetState = state;
			res.send(laptopState);
		}
		else res.send({error: "Invalid state!"});
	});

	return app;
};