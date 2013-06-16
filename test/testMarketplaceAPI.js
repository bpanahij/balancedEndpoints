var vows = require ('vows'),
  assert = require ('assert'),
  _ = require ('underscore')

var creditCardApi = require ('../api/balanced/creditCard/api.js'),
  bankAccountApi = require ('../api/balanced/bankAccount/api.js'),
  marketplaceApi = require ('../api/balanced/marketplace/api.js')

vows.describe ('Marketplace API').addBatch({
  '->list all Accounts': {
    topic: function() {
      marketplaceApi.request('get', {}, this.callback)
    },
    'should result in an object with items': function(response) {
      assert.isArray(response.items)
    }
  }
}).addBatch ({
  '->create a Credit Card': {
    topic: function () {
      var payload = {
        'expiration_month': 12,
        'expiration_year': 2020,
        'security_code': 123,
        'card_number': 5105105105105100
      }
      creditCardApi.request ('new', payload, this.callback)
    },
    'should have created Credit Card': function (err, result) {
      assert.include (result, 'uri')
    },
    '->create a Marketplace Account with Card': {
      topic: function (card) {
        var payload = {
          name: 'Brian P. Johnson',
          cardUri: card.uri,
          emailAddress: process.hrtime()[1] + '_rand@jeff.com'
        };
        marketplaceApi.request ('new', payload, this.callback)
      },
      'should have created Marketplace Account and Card Associated': function (err, got) {
        assert.include (got, 'bank_accounts_uri')
        assert.include (got, 'transactions_uri')
        assert.include (got, 'id')
        assert.include (got, 'credits_uri')
        assert.include (got, 'cards_uri')
        assert.include (got, 'holds_uri')
        assert.include (got, 'created_at')
        assert.include (got, 'uri')
        assert.include (got, 'refunds_uri')
        assert.include (got, 'debits_uri')
      },
      '->create a Bank Account': {
        topic: function (card) {
          var payload = {
            name: 'Brian Johnson',
            accountNumber: '9900000001',
            routingNumber: '121000358',
            type: 'checking'
          }
          bankAccountApi.request ('new', payload, this.callback)
        },
        'should have created Bank Account': function (err, bankAccount) {
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
        '->associate Bank Account with Marketplace Account': {
          topic: function (bankAccount, marketplaceAccount) {
            var payload = {
              bankAccountUri: bankAccount.uri,
              marketplaceUri: marketplaceAccount.uri
            }
            marketplaceApi.request ('addBankAccount', payload, this.callback)
          },
          'should have associated Bank Account with Marketplace Account': function (err, got) {
            assert.include (got, 'bank_accounts_uri')
            assert.include (got, 'transactions_uri')
            assert.include (got, 'id')
            assert.include (got, 'credits_uri')
            assert.include (got, 'cards_uri')
            assert.include (got, 'holds_uri')
            assert.include (got, 'created_at')
            assert.include (got, 'uri')
            assert.include (got, 'refunds_uri')
          },
          '->charge Credit Card': {
            topic: function(marketPlaceAccountUpdated) {
              var payload = {
                amount: 5000,
                debitsUri: marketPlaceAccountUpdated.debits_uri
              }
              marketplaceApi.request('debit', payload, this.callback)
            },
            'should have charged Credit Card $50.00': function(err, result) {
              assert.equal(result.amount, 5000)

            }
          },
          '->credit Bank Account': {
            topic: function (bankAccount, account) {
              var payload = {
                bankAccountUri: account.uri,
                bankCreditsUri: bankAccount.credits_uri,
                amount: 5000
              }
              marketplaceApi.request('credit', payload, this.callback)
            },
            'should have credited Bank Account $50.00': function (err, result) {
              assert.equal(result.amount, 5000)
            }
          }
        }
      }
    }
  }
}).export (module)
