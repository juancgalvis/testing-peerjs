var express = require('express');
var ExpressPeerServer = require('peer').ExpressPeerServer;
var peerOptions = {
    debug: true,
    allow_discovery: true
};

var app = express();
var port = 3000;
var server = app.listen(port);

var peerServer = ExpressPeerServer(server, peerOptions);

peerServer.on('connection', function (id) {
    console.log('connected: ' + id);
});
peerServer.on('disconnect', function (id) {
    console.log('disconnected: ' + id);
});

app.use('/peerjs', peerServer);