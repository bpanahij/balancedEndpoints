module.exports = {
  "development": true,
  "dev": {
    "http": {
      "host": "0.0.0.0",
      "port": 8080
    },
    "socket": {
      "host": "0.0.0.0",
      "port": 8081,
      "log_level": 2
    },
    "balanced": {
      "host": 'api.balancedpayments.com',
      "username": "xxxxxxxxxxxxx",
      "password": "",
      "uriHash": "TEST-XXXXXXX"
    }
  },
  "prod": {
    "http": {
      "host": "http://www.exammple.me",
      "port": 80
    },
    "socket": {
      "host": "www.example.me",
      "port": 8081,
      "log_level": 0
    },
    "balanced": {
      "host": 'api.balancedpayments.com',
      "username": "xxxxxxxxxxxxx",
      "password": "",
      "uriHash": "TEST-XXXXXXX"
    }
  },
  "current": function () {
    return this.development ? this.dev : this.prod
  }
}