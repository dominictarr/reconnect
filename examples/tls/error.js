var reconnect = require('../../tls')
var tls       = require('tls')
var fs        = require('fs')

var port = 6789
var sOpts = {
  key               : fs.readFileSync('certs/agent1-key.pem'),
  cert              : fs.readFileSync('certs/agent1-cert.pem'),
  ca                : fs.readFileSync('certs/ca1-cert.pem'),
  requestCert       : true,
  rejectUnauthorized: false
}
var server = tls.createServer(sOpts, function (stream) {

  console.log('server connected', stream.authorized ? 'authorized' : 'unauthorized');
  console.log(stream.authorizationError);
  //console.log('request from: ' + stream.getPeerCertificate().subject.CN);
  console.dir(stream.getPeerCertificate());

  stream.write(new Date() + '\n')

    var i = 0
    stream
      .on('data', function (data) {
        console.log('ping', data.toString())
        stream.write(new Date() + '\n')
        if(i++ > 3) stream.destroy(), console.log('hang up on client')
      })

}).listen(port)
  .on('clientError', function (err) {
    console.log('clientError', err)
  })
var nodename = 'nodeX'
var cOpts = {
  host: 'localhost',
  port: '6789',
  path: '/test',
  method: 'GET',
/*
  key               : fs.readFileSync('certs/agent3-key.pem'),
  cert              : fs.readFileSync('certs/agent3-cert.pem'),
  ca                : fs.readFileSync('certs/ca1-cert.pem'),
*/
  key: fs.readFileSync('openssl/'+nodename+'.key'),
  cert: fs.readFileSync('openssl/'+nodename+'.crt'),
  ca: fs.readFileSync('openssl/ca.crt'),
  requestCert: true,
  rejectUnauthorized: false
};


reconnect(function (stream) {

  console.log('client connected',
              stream.authorized ? 'authorized' : 'unauthorized');
  console.log(stream.authorizationError);
  console.dir(stream.getPeerCertificate());

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
}).connect(cOpts)

  .on('disconnect', function (err) {
    console.log('client disconnect', err)
  })




