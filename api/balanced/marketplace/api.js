var config = require('../../../config'),
  restful = require ('../../restful')

module.exports = {
  request: function(name, data, callback) {
    restful.discover(name, internals, data, callback)
  }
}

/**
 * Defining any Regular Expressions for validating data before it can be sent
 */
var any = /.*/

var internals = {
  get: {
    fields: {
      required: {
        method: /GET/
      },
      optional: {}
    },
    postData: function (data) {
      return {}
    },
    postOptions: function (data) {
      return {
        method: 'GET',
        path: '/v1/marketplaces/' + config.current ().balanced.uriHash + '/accounts'
      }
    }
  },
  new: {
    fields: {
      required: {
        method: /POST/,
        cardUri: any
      },
      optional: {
        name: any,
        emailAddress: any
      }
    },
    postData: function (data) {
      return {
        card_uri: data.cardUri,
        name: data.name,
        email_address: data.emailAddress
      }
    },
    postOptions: function (data) {
      return {
        method: 'POST',
        path: '/v1/marketplaces/' + config.current ().balanced.uriHash + '/accounts'
      }
    }
  },
  addCard: {
    fields: {
      required: {
        method: /PUT/,
        cardUri: any,
        marketplaceUri: any
      }
    },
    postData: function (data) {
      return {
        card_uri: data.cardUri
      }
    },
    postOptions: function (data) {
      return {
        method: 'PUT',
        path: data.marketplaceUri
      }
    }
  },
  addBankAccount: {
    fields: {
      required: {
        method: /PUT/,
        bankAccountUri: any,
        marketplaceUri: any
      }
    },
    postData: function (data) {
      return {
        bank_account_uri: data.bankAccountUri
      }
    },
    postOptions: function (data) {
      return {
        method: 'PUT',
        path: data.marketplaceUri
      }
    }
  },
  credit: {
    fields: {
      required: {
        method: /POST/,
        amount: any,
        bankAccountUri: any,
        bankCreditsUri: any
      }
    },
    postData: function (data) {
      return {
        amount: data.amount,
        bank_account_uri: data.bankAccountUri
      }
    },
    postOptions: function (data) {
      return {
        method: 'POST',
        path: data.bankCreditsUri
      }
    }
  },
  debit: {
    fields: {
      required: {
        method: /POST/,
        amount: any,
        debitsUri: any
      }
    },
    postData: function (data) {
      return {
        appears_on_statement_as: 'Charge from Lynd.me',
        amount: data.amount,
        description: 'This is a charge from Lynd.me'
      }
    },
    postOptions: function (data) {
      return {
        path: data.debitsUri,
        method: 'POST'
      }
    }
  }
}