module.exports = {
  friendlyName: 'Get user profile',
  description: 'Get a user\'s bookmarks.',
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
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i',
      description: 'The access token for a given user (granted by Instapaper)',
      extendedDescription: 'This "permanent OAuth token" is how Instapaper knows the end user has granted access to your app.',
      whereToGet: {
        description: 'Run the `getAccessToken` machine in this pack and use the returned `accessToken`.'
      },
      required: true
    },
    accessSecret: {
      example: 'QDvCav5zRSafS795TckAerUV53xzgqRyrcfYX2i',
      description: 'The access secret for a given user (granted by Instapaper)',
      extendedDescription: 'This "permanent OAuth secret" is how Instapaper knows the end user has granted access to your app.',
      whereToGet: {
        description: 'Run the `getAccessToken` machine in this pack and use the returned `accessSecret`.'
      },
      required: true
    },
    limit: {
      example: '25',
      description: 'A number between 1 and 500, default 25.',
      required: false
    },
    folderId: {
      example: 'starred',
      description: 'Possible values are unread (default), starred, archive, or a folder_id value from /api/1.1/folders/list.',
      required: false
    },
    have: {
      example: '12345,12346,12347',
      description: 'A concatenation of bookmark_id values that the client already has from the specified folder. See below.',
      required: false
    },
    highlights: {
      example: '12345-12346-12347',
      description: 'A "-" delimited list of highlight IDs that the client already has from the specified bookmarks.',
      required: false
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      description: 'Returns the user\'s bookmarks.',
      example: {
        user: {},
        bookmarks: [],
        highlights: [],
        delete_ids: []
      }
    }
  },
  fn: function (inputs, exits) {
    var request = require('request')

    request.post({
      url: 'https://www.instapaper.com/api/1.1/bookmarks/list',
      oauth: {
        consumer_key: inputs.consumerKey,
        consumer_secret: inputs.consumerSecret,
        token: inputs.accessToken,
        token_secret: inputs.accessSecret
      },
      form: {
        limit: inputs.limit,
        folder_id: inputs.folderId,
        have: inputs.have,
        highlights: inputs.highlights
      }
    }, function (err, response, body) {
      if (err) {
        return exits.error(err)
      }
      if (response.statusCode > 299 || response.statusCode < 200) {
        return exits.error(response.statusCode)
      }

      var parsedBody

      try {
        parsedBody = JSON.parse(body)
      } catch (parseError) {
        return exits.error(parseError)
      }

      if (parsedBody.user.subscription_is_active === '0' && parsedBody.bookmarks.length === 0) {
        return exits.error('User does not have an active subscription, only a list of bookmarks with no parameters can be fetched.')
      }

      return exits.success({
        user: parsedBody.user,
        bookmarks: parsedBody.bookmarks,
        highlights: parsedBody.highlights,
        deleteIds: parsedBody.delete_ids
      })
    })
  }
}
