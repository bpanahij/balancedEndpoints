var async = require('async')

var SocketServer = require('./socketServer'),
  balancedBankAccountRoute = require('./api/balanced/bankAccount'),
  balancedCreditCardRoute = require('./api/balanced/creditCard'),
  balancedMarketplaceRoute = require('./api/balanced/creditCard'),
  balancedVerifyRoute = require('./api/balanced/creditCard')

async.series([
  // Other server setups can go here i.e. HTTP Server
  function (callback) {
    var socketServer = SocketServer([balancedBankAccountRoute, balancedCreditCardRoute, balancedMarketplaceRoute, balancedVerifyRoute])
    socketServer.initialize(function() {
      console.log('socket...initialized')
      callback();
    })
  }
], function(err) {
  console.log('Finished setting up servers.', err)
})