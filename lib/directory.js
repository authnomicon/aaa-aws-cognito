var AWS = require('aws-sdk');


function AmazonCognitoDirectory(id, region) {
  this._id = id;
  this._region = region;
  
  this._userPool = new AWS.CognitoIdentityServiceProvider({
    region: this._region
  });
}

AmazonCognitoDirectory.prototype.get = function(id, cb) {
  // https://forums.aws.amazon.com/thread.jspa?threadID=233751
  // https://github.com/aws/amazon-cognito-identity-js/issues/302
  // https://stackoverflow.com/questions/43488445/how-do-i-look-up-a-cognito-user-by-their-sub-uuid
  
  var params = {
    UserPoolId: this._id,
    Limit: 1,
    Filter: "sub = \"" + id + "\""
  };
  this._userPool.listUsers(params, function(err, data) {
    var users = data.Users
      , user = {}
      , attributes, attribute, i, len;
    if (users.length == 0) {
      return cb(null);
    } else if (users.length > 1) {
      return cb(new Error('Amazon Cognito search too many results'));
    }
    
    attributes = users[0].Attributes;
    user.username = users[0].Username;
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
};


module.exports = AmazonCognitoDirectory;
