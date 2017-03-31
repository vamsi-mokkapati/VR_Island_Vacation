/*
var http = require("http");

http.createServer(function(request, response) {

	response.writeHead(200, {'Content-Type': 'text/plain'});
	response.end("Hello, world\n");

}).listen(8080);
*/
var express = require('express');
var app = express();

var path = require('path');

var expressSession = require('express-session');
app.use(require('body-parser').json({ extended: true }));

require('./echo.js')(app);

app.use('/', express.static('static'));

var tcpPortUsed = require('tcp-port-used');
tcpPortUsed.check(process.env.PORT || 9000, "127.0.0.1").then(
	function(inuse) {
		var port = process.env.PORT || 9000;
		if (inuse) {
			port = 9999;
		}
		app.listen(port);
		console.log("Server up on port " + port);
	}
	, 
	function(err) {
		console.log('Error: ' + err.message);
	}
);

