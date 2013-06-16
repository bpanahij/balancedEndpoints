var restful = require ('../../restful'),
  config = require ('../../../config')

module.exports = {
  request: function (name, data, callback) {
    restful.discover (name, internals, data, callback)
  }
}

/**
 * Defining any Regular Expressions for validating data before it can be sent
 */
var any = /.*/

var internals = {
  new: {
    fields: {
      required: {
        method: /POST/,
        expiration_month: any,
        expiration_year: any,
        security_code: any,
        card_number: any
      },
      optional: {}
    },
    postData: function (data) {
      return {
        expiration_month: data.expiration_month,
        expiration_year: data.expiration_year,
        security_code: data.security_code,
        card_number: data.card_number
      }
    },
    postOptions: function (data) {
      return {
        path: '/v1/marketplaces/' + config.current ().balanced.uriHash + '/cards',
        method: 'POST'
      }
    }
  },
  invalidate: {
    fields: {
      required: {
        method: /PUT/,
        uri: any,
        is_valid: any
      },
      optional: {}
    },
    postData: function (data) {
      return {
        is_valid: false
      }
    },
    postOptions: function (data) {
      return {
        path: data.uri,
        method: 'PUT'
      }
    }
  },
  get: {
    fields: {
      required: {
        method: /GET/,
        uri: any
      },
      optional: {}
    },
    postOptions: function (data) {
      return {
        path: data.uri,
        method: 'GET'
      }
    },
    postData: function (data) {
      return {}
    }
  },
  list: {
    fields: {
      required: {
        method: /GET/
      },
      optional: {}
    },
    postOptions: function (data) {
      return {
        path: '/v1/marketplaces/' + config.current ().balanced.uriHash + '/cards',
        method: 'GET'
      }
    },
    postData: function (data) {
      return {}
    }
  }
}