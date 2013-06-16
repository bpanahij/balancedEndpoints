var config = require('./config')
var io = require('socket.io').listen(config.current().socket.port)
if (!config.development) {
  io.enable('browser client minification');  // send minified client
  io.enable('browser client etag');          // apply etag caching logic based on version number
  io.enable('browser client gzip');          // gzip the file
  io.set('transports', [
    'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
  ]);
}
var _ = require('underscore')
io.set('log level', config.current().socket.log_level)
module.exports = function (routeModules) {
  this.routeModules = routeModules;
  this.initialize = function (callback) {
    io.sockets.on('connection', function (socket) {
      _.each(this.routeModules, function (routeModule) {
        routeModule.setupSocket(socket)
      })
      callback();
    }.bind(this))
  }
  return this
}