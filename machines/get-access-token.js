module.exports = {
  friendlyName: 'Get access token',
  description: 'Generate a new access token for acting on behalf of a particular Instapaper user.',
  extendedDescription: '',
  moreInfoUrl: '',
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
    username: {
      example: 'hemingway',
      description: 'The username used to request the access token.',
      required: true
    },
    password: {
      example: 'secret',
      description: 'The password used to request the access token.',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    success: {
      description: 'Returns the user\'s tokens',
      example: {
        accessToken: '847489329-998DSdafaasdDSF08asdfda08agf6ad6fsdaa08dasdaf76sa5',
        accessSecret: 'SDFSssdfsdf9&SDfSDFSDFSfd9877ssdf'
      }
    }

  },

  fn: function (inputs, exits) {
    var request = require('request')
    var qs = require('querystring')

    request.post({
      url: 'https://www.instapaper.com/api/1/oauth/access_token',
      oauth: {
        consumer_key: inputs.consumerKey,
        consumer_secret: inputs.consumerSecret
      },
      form: {
        x_auth_username: inputs.username,
        x_auth_password: inputs.password,
        x_auth_mode: 'client_auth'
      }
    }, function (err, response, body) {
      if (err) {
        return exits.error(err.statusCode)
      }
      if (response.statusCode > 299 || response.statusCode < 200) {
        return exits.error(response.statusCode)
      }

      var parsedResponse
      try {
        parsedResponse = qs.parse(body)
      } catch (e) {
        return exits.error(e)
      }

      return exits.success({
        accessToken: parsedResponse.oauth_token,
        accessSecret: parsedResponse.oauth_token_secret
      })
    })
  }

}
