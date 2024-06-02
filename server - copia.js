const { SocketAddress } = require('net');

const app = require('express')(); // Ó const express = require('express'), app = expres()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send("Running")
});

var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

http.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(addresses);
  io.on('connection', (socket) => {
    console.log("Alguien se ha conectado con Socket");
   socket.emit('messages', messages);
 
   socket.on('new-message', function(data){
    messages.push(data);
    io.sockets.emit('messages', messages);
   });
 });
});