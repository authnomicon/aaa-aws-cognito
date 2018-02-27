var AWS = require('aws-sdk')
  , crypto = require('crypto');


  // TODO: Implement this:
  // https://github.com/mozilla/node-srp
  // https://github.com/aws/amazon-cognito-identity-js (search for SRP_A)
  // https://www.npmjs.com/package/cognito-srp

function AmazonCognitoPasswordVerifier(id, region) {
  this._id = id;
  this._region = region;
  
  this._userPool = new AWS.CognitoIdentityServiceProvider({
    region: this._region
  });
}

AmazonCognitoPasswordVerifier.prototype.verify = function(username, password, cb) {
  var self = this;
  
  // https://stackoverflow.com/questions/37438879/resolve-unable-to-verify-secret-hash-for-client-in-amazon-cognito-userpools
  // https://github.com/aws/amazon-cognito-identity-js/issues/253
  var clientId = process.env.AMAZON_COGNITO_APP_CLIENT_ID;
  var clientSecret = process.env.AMAZON_COGNITO_APP_CLIENT_SECRET;
  var secretHash = crypto.createHmac('sha256', clientSecret)
                         .update(username + clientId)
                         .digest('base64');
  
  var params = {
    UserPoolId: this._id,
    AuthFlow: 'USER_SRP_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username
    }
  };
  this._userPool.adminInitiateAuth(params, function(err, data) {
    console.log(params)
    console.log(err);
    console.log(data);
    return;
    
    
    if (err) {
      switch (err.code) {
      case 'UserNotFoundException': // User does not exist.
        return cb(null, false);
      case 'NotAuthorizedException': // Incorrect username or password.
        return cb(null, false);
      }
      
      return cb(err);
    }
    
    // TODO: As an optional optimization, parse user data from data.AuthenticationResult.IdToken
    
    var params = {
      UserPoolId: self._id,
      Username: username
    };
    self._userPool.adminGetUser(params, function(err, data) {
      if (err) { return cb(err); }
      
      var user = {}
        , attributes = data.UserAttributes || []
        , attribute, i, len;
      user.username = data.Username;
      for (i = 0, len = attributes.length; i < len; ++i) {
        attribute = attributes[i];
        switch (attribute.Name) {
        case 'sub':
          user.id = attribute.Value;
          break;
        case 'email':
          user.emails = user.emails || [];
          user.emails[0] = user.emails[0] || {};
          user.emails[0].value = attribute.Value;
          break;
        // TODO: email verified
        }
      }
      
      return cb(null, user);
    });
  });
};


module.exports = AmazonCognitoPasswordVerifier;
