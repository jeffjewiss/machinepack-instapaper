module.exports = {
  friendlyName: 'Get user\'s folders',
  description: 'Get a list of all the user\'s folders.',
  extendedDescription: '',
  inputs: {
    consumerKey: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The `consumerKey` associated with one of your Instapaper developer apps.',
      required: true,
      whereToGet: {
        url: 'https://www.instapaper.com/main/request_oauth_consumer_token',
        description: 'Copy and paste an API key, or create one if you haven\'t already.',
        extendedDescription: 'If you don\'t have any Instapaper apps created yet, you\'ll need to make one first.'
      }
    },
    consumerSecret: {
      example: 'xAmBxAmBxAmBkjbyKkjbyKkjbyK',
      description: 'The `consumerSecret` associated with one of your Instapaper developer apps.',
      required: true,
      whereToGet: {
        url: 'https://www.instapaper.com/main/request_oauth_consumer_token',
        description: 'Copy and paste an API key, or create one if you haven\'t already.',
        extendedDescription: 'If you don\'t have any Instapaper apps created yet, you\'ll need to make one first.'
      }
    },
    accessToken: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i_PJFObCvACVRP-V7sfemiMPBh3TWypvagfZ6aoqfwKCNcBxg8XR_skdYUe5tsY9UzX9Z_8q4mR',
      description: 'The access token for a given user (granted by Instapaper)',
      extendedDescription: 'This "permanent OAuth token" is how Instapaper knows the end user has granted access to your app.',
      whereToGet: {
        description: 'Run the `getAccessToken` machine in this pack and use the returned `accessToken`.'
      },
      required: true
    },
    accessSecret: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i_PJFObCvACVRP-V7sfemiMPBh3TWypvagfZ6aoqfwKCNcBxg8XR_skdYUe5tsY9UzX9Z_8q4mR',
      description: 'The access secret for a given user (granted by Instapaper)',
      extendedDescription: 'This "permanent OAuth secret" is how Instapaper knows the end user has granted access to your app.',
      whereToGet: {
        description: 'Run the `getAccessToken` machine in this pack and use the returned `accessSecret`.'
      },
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      description: 'Returns the user\'s folders.',
      example: []
    }
  },
  fn: function (inputs, exits) {
    var request = require('request')

    request.post({
      url: 'https://www.instapaper.com/api/1.1/folders/list',
      oauth: {
        consumer_key: inputs.consumerKey,
        consumer_secret: inputs.consumerSecret,
        token: inputs.accessToken,
        token_secret: inputs.accessSecret
      }
    }, function (err, response, body) {
      if (err) {
        return exits.error(err)
      }
      if (response.statusCode > 299 || response.statusCode < 200) {
        return exits.error(response.statusCode)
      }

      var parsedBody = JSON.parse(body)

      return exits.success(parsedBody)
    })
  }
}
