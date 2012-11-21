
var sock = require('sockjs-stream')

module.exports = require('./inject')(function (){
  var args = [].slice.call(arguments)
  return sock.apply(null, args)
})
