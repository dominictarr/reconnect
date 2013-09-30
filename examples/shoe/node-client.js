var reconnect = require('../../shoe');
var es = require('event-stream');

//****************************************
//* copy pasted from ./client.js         *
//* but without anything DOM related!    *
//****************************************

var r = reconnect(function (stream) {
  var s = es.mapSync(function (msg) {
    console.log(msg)         
    return String(Number(msg)^1);
  });
  s.pipe(stream).pipe(s);

}).connect('http://localhost:3000/invert/foo')
