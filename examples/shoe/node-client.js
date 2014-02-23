var reconnect = require('../../inject')(require('sockjs-stream'))
var es = require('event-stream');

var r = reconnect(function (stream) {
  var s = es.mapSync(function (msg) {
    return String(Number(msg)^1);
  });
  s.pipe(stream).pipe(s);
  stream.pipe(process.stdout)

}).connect('ws://localhost:3000/invert/foo')
