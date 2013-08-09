var reconnect = require('../../')
var net       = require('net')

var port = 6789
var server = net.createServer(function (stream) {

  console.log('server connected');

  stream.write(new Date() + '\n')

    var i = 0
    stream
      .on('data', function (data) {
        console.log('ping', data.toString())
        stream.write(new Date() + '\n')
        if(i++ > 3) stream.destroy(), console.log('hang up on client')
      })

}).listen(port)

server.on('clientError', function (err) {
  console.log(err)
})

var cOpts = {
  host: 'localhost',
  port: '6789'
};

reconnect(function (stream) {

  console.log('client connected');

  var int = setInterval(function () {
    stream.write(new Date() + '\n')
  }, 1000)

  stream
    .on('data', function (data) {
      console.log('pong', data.toString())
    })
    .on('close', function () {
      console.log('disconnect')
      clearInterval(int)
    })
}).connect(cOpts);


