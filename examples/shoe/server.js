var http = require('http');
var ecstatic = require('ecstatic')(__dirname + '/static');
var shoe = require('shoe');

var server = http.createServer(ecstatic);
server.listen(3000, function () {
  console.log('listening on 3000')
});

var prefix = '/invert/(\\w+)'
var rx = new RegExp('^'+prefix)
var sock = shoe(function (stream) {
//    console.log(stream)
    console.log(stream._session.recv.ws.request)
    console.log(rx.exec(stream.pathname))

    var iv = setInterval(function () {
        stream.write(Math.floor(Math.random() * 2));
    }, 250);
    
    stream.on('end', function () {
        clearInterval(iv);
    });
    
    stream.pipe(process.stdout, { end : false });
});
sock.install(server, prefix);
