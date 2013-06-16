var vows = require ('vows'),
  assert = require ('assert'),
  _ = require ('underscore'),
  async = require ('async')

var bankAccountApi = require ('../api/balanced/bankAccount/api.js')

vows.describe ('Bank Account API').addBatch ({
  'Create a Bank Account': {
    topic: function () {
      var payload = {
        method: 'POST',
        name: 'Brian Johnson',
        accountNumber: '9900000001',
        routingNumber: '121000358',
        type: 'checking'
      }
      bankAccountApi.request ('new', payload, this.callback)
    },
    'Account Created': function (err, got) {
      var expected = {
        account_number: 'xxxxxx0001',
        bank_name: 'BANK OF AMERICA, N.A.',
        can_debit: false,
        meta: {},
        name: 'Brian Johnson',
        routing_number: '121000358',
        type: 'checking',
        verification_uri: null
      }
      var gotTrimmed = _.pick (got, _.keys (expected));
      assert.deepEqual (gotTrimmed, expected);
    },
    ', List all Bank Accounts': {
      topic: function () {
        var payload = {
          method: 'GET',
          limit: 50
        }
        bankAccountApi.request ('list', payload, this.callback)
      },
      'Accounts Listed': function (err, got) {
        assert.isArray (got.items)
      },
      ', Delete All Bank Accounts': {
        topic: function (bankAccounts) {
          var countSent = 0;
          var q = async.queue (function (account, callback) {
            var payload = {
              method: 'DELETE',
              uri: account.uri
            }
            bankAccountApi.request ('delete', payload, callback)
          }, 1)
          q.drain = function () {
            this.callback (null, countSent, bankAccounts.items.length)
          }.bind (this)
          _.each (bankAccounts.items, function (account) {
            countSent ++;
            q.push (account)
          })
        },
        'Accounts Deleted': function (err, deleted, listed) {
          assert.equal (deleted, listed)
        },
        ', All Bank Accounts Should Be Deleted': {
          topic: function () {
            var payload = {
              method: 'GET'
            }
            bankAccountApi.request ('list', payload, this.callback)
          },
          'No Accounts Listed': function (err, got) {
            assert.isArray (got.items)
            assert.lengthOf (got.items, 0)
          },
          ', Create a Bank Account': {
            topic: function () {
              var payload = {
                method: 'POST',
                name: 'Brian Johnson',
                accountNumber: '9900000001',
                routingNumber: '121000358',
                type: 'checking'
              }
              bankAccountApi.request ('new', payload, this.callback)
            },
            'Account Created': function (err, got) {
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
              _.extend (expected, got, expect)
              assert.deepEqual (got, expected)
            },
            ', Retrieve Bank Account': {
              topic: function (bankAccount) {
                var payload = {
                  method: 'GET',
                  uri: bankAccount.uri
                }
                bankAccountApi.request ('get', payload, this.callback)
              },
              'Account Retrieved': function (err, got) {
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
                _.extend (expected, got, expect)
                assert.deepEqual (got, expected)
              }
            }
          }
        }
      }
    }
  }
}).export (module)