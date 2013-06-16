var vows = require ('vows'),
  assert = require ('assert'),
  _ = require ('underscore')

var creditCardApi = require ('../api/balanced/creditCard/api.js')

vows.describe ('Credit Card API').addBatch ({
  '->Create a Credit Card': {
    topic: function () {
      var payload = {
        method: 'POST',
        expiration_month: 12,
        expiration_year: 2020,
        security_code: 123,
        card_number: 5105105105105100
      }
      creditCardApi.request ('new', payload, this.callback)
    },
    'Card Created': function (err, got) {
      var expect = {
        "account": null,
        "brand": "MasterCard",
        "card_type": "mastercard",
        "expiration_month": 12,
        "expiration_year": 2020,
        "is_valid": true,
        "last_four": "5100",
        "meta": {},
        "name": null
      }
      var expected = {}
      _.extend (expected, got, expect)
      assert.deepEqual (got, expected)
    },
    '->Retrieve a Card': {
      topic: function (card) {
        var payload = {
          method: 'GET',
          uri: card.uri
        }
        creditCardApi.request ('get', payload, function (err, got) {
          this.callback (err, got, card)
        }.bind (this))
      },
      'Card Retrieved': function (err, got, expected) {
        assert.deepEqual (got, expected)
      },
      '->Invalidate Credit Card': {
        topic: function (got, expected, card) {
          var payload = {
            method: 'PUT',
            uri: card.uri,
            is_valid: false
          }
          creditCardApi.request ('invalidate', payload, this.callback)
        },
        'Card Invalidated': function (err, card) {
          assert.equal (card.is_valid, false)
        }
      }
    }
  }
}).export (module)