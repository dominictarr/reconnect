
var net = require('net')

module.exports = require('./reconnect')(function (){ 
  var args = [].slice.call(arguments)
  return net.connect.apply(null, args)
})
