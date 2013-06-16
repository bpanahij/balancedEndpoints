(function () {
  var request = require ('request'),
    queryString = require ('queryString'),
    http = require ('https'),
    _ = require ('underscore')

  var config = require ('../config'),
    username = config.current ().balanced.username,
    password = config.current ().balanced.password,
    auth = "Basic " + new Buffer (username + ":" + password).toString ("base64"),
    apiHost = config.current ().balanced.host

  var restful = {}
  /**
   * This module can be exported for require.js,
   * or in the root context of a browser
   */
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = restful;
    }
    exports = restful;
  } else {
    root.restful = restful;
  }
  /**
   * Setup standard options, and empty post data
   */
  var init = function () {
    restful.postOptions = {
      host: apiHost,
      port: '443',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 0,
        'Authorization': auth
      }
    }
    restful.postData = {}
  }
  /**
   *
   * @param endpoint
   * @param data
   */
  restful.extend = function (endpoint, data) {
    var post = {
      postOptions: {},
      postData: {}
    }
    _.extend (post.postOptions, restful.postOptions, endpoint.postOptions (data))
    _.extend (post.postData, restful.postData, endpoint.postData (data))
    return post
  }
  restful.postRequest = function (post, callback) {
    var postDataString = queryString.stringify (post.postData)
    restful.postOptions.headers['Content-Length'] = postDataString.length
    var req = http.request (post.postOptions, function (res) {
      var response = ''
      res.setEncoding ('utf8')
      res.on ('data', function (data) {
        response += data
      })
      res.on ('end', function () {
        if (response.length > 0) {
          callback (null, JSON.parse (response))
        } else {
          callback (null, {})
        }
      })
    })
    req.write (postDataString)
    req.end ()
  }
  restful.discover = function (name, internals, data, callback) {
    var apiEndpoint = internals[name];
    if (_.isUndefined (apiEndpoint)) {
      callback (new Error ('Endpoint Not Found'), {})
      return
    }
    var post = restful.extend (apiEndpoint, data)
    restful.postRequest (post, callback)
  }
  init ()
}).call (this)