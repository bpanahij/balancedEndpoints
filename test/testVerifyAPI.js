var vows = require ('vows'),
  assert = require ('assert'),
  _ = require ('underscore'),
  async = require ('async')

var bankAccountAPI = require ('../api/balanced/bankAccount/api.js'),
  verifyAPI = require ('../api/balanced/bankAccount/verify/api.js')

vows.describe ('Verify API')
  .addBatch ({
  '->Create a Bank Account': {
    topic: function () {
      var payload = {
        name: 'Brian Johnson',
        accountNumber: '9900000001',
        routingNumber: '121000358',
        type: 'checking'
      }
      bankAccountAPI.request ('new', payload, this.callback)
    },
    'should create a Bank Account': function (err, bankAccount) {
      var expect = {
        account_number: 'xxxxxx0001',
        bank_name: 'BANK OF AMERICA, N.A.',
        can_debit: false,
        meta: {},
        name: 'Brian Johnson',
        routing_number: '121000358',
        type: 'checking',
        verification_uri: null
      }
      var expected = {}
      _.extend (expected, bankAccount, expect)
      assert.deepEqual (bankAccount, expected)
    },
    '->Create Verification': {
      topic: function (bankAccount) {
        var payload = {
          verificationsUri: bankAccount.verifications_uri
        }
        verifyAPI.request ('new', payload, this.callback)
      },
      'should respond with Success': function (err, data) {
        assert.equal (data.attempts, 0)
        assert.equal (data.remaining_attempts, 3)
        assert.equal (data.state, 'pending')
      },
      '->Verify Bank Acount': {
        topic: function (verification, bankAccount) {
          var payload = {
            amountOne: 1,
            amountTwo: 1,
            verificationsUri: verification.uri
          }
          verifyAPI.request('verify', payload, this.callback)
        },
        'should respond': function (err, data) {
          assert.equal (data.attempts, 1)
          assert.equal (data.remaining_attempts, 2)
          assert.equal (data.state, 'verified')
          var payload = {
            method: 'GET',
            limit: 50
          }
          bankAccountAPI.request ('list', payload, function(err, response) {
            var countSent = 0;
            var q = async.queue (function (account, callback) {
              var payload = {
                method: 'DELETE',
                uri: account.uri
              }
              bankAccountAPI.request ('delete', payload, callback)
            }, 1)
            q.drain = function () {
              console.log ('Deleted ' + countSent + ' bank accounts')
            }.bind (this)
            _.each (response.items, function (account) {
              countSent ++;
              q.push (account)
            })
          })
        }
      }
    }
  }
}).export (module)
