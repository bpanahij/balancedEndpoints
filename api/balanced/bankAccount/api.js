var restful = require ('../../restful')

module.exports = {
  request: function (name, data, callback) {
    restful.discover (name, internals, data, callback)
  }
}
var any = /.+/
var internals = {
  new: {
    fields: {
      required: {
        method: /POST/,
        name: any,
        accountNumber: any,
        routingNumber: any,
        type: any
      },
      optional: {}
    },
    postData: function (data) {
      return {
        name: data.name,
        account_number: data.accountNumber,
        routing_number: data.routingNumber,
        type: data.type
      }
    },
    postOptions: function (data) {
      return {
        path: '/v1/bank_accounts',
        method: 'POST'
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
  delete: {
    fields: {
      required: {
        method: /DELETE/,
        uri: any
      },
      optional: {}
    },
    postOptions: function (data) {
      return {
        path: data.uri,
        method: 'DELETE'
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
        path: '/v1/bank_accounts',
        method: 'GET'
      }
    },
    postData: function (data) {
      return {}
    }
  }
}