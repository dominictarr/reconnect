
var shoe = require('shoe')

module.exports = require('./reconnect')(function (){ 
  var args = [].slice.call(arguments)
  return shoe.apply(null, args)
})
