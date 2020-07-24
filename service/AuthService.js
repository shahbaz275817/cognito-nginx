global.fetch = require('node-fetch');
global.navigator = () => null;

const { USER_POOL, APP_CLIENT_ID,POOL_REGION } = require('../bin/configs')

const request = require('request')

var jwkToPem = require('jwk-to-pem'),
  jwt = require('jsonwebtoken');


const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const poolData = {
  UserPoolId: USER_POOL,
  ClientId: APP_CLIENT_ID
};
const pool_region = POOL_REGION;
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);



exports.Register = function (body, callback) {
  var name = body.name;
  var email = body.email;
  var password = body.password;
  var attributeList = [];
  attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({ Name: "email", Value: email }));
  userPool.signUp(name, password, attributeList, null, function (err, result) {
    if (err)
      callback(err);
//     var cognitoUser = result.user;
//     console.log({cognitoUser})
    callback(null, 'Signup successfull..please verify your account');
  })
}


exports.Login = function (body, callback) {
  var userName = body.name;
  var password = body.password;
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: userName,
    Password: password
  });
  var userData = {
    Username: userName,
    Pool: userPool
  }
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      var accesstoken = result.getAccessToken().getJwtToken();
      callback(null, accesstoken);
    },
    onFailure: (function (err) {
      callback(err);
    })
  })
};

exports.Verify = function (body, callback) {
  var userName = body.name;
  var code = body.code;
  var userData = {
    Username: userName,
    Pool: userPool
  }
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  cognitoUser.confirmRegistration(code, false, function (err, result) {
    if (err) {
      callback(err);
    } else {
      callback(null, result)
    }
  })
};

exports.Validate = function (token, callback) {
  request({
    url: `https://cognito-idp.${pool_region}.amazonaws.com/${poolData.UserPoolId}/.well-known/jwks.json`,
    json: true
  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      pems = {};
      var keys = body['keys'];
      for (var i = 0; i < keys.length; i++) {
        var key_id = keys[i].kid;
        var modulus = keys[i].n;
        var exponent = keys[i].e;
        var key_type = keys[i].kty;
        var jwk = { kty: key_type, n: modulus, e: exponent };
        var pem = jwkToPem(jwk);
        pems[key_id] = pem;
      }
      var decodedJwt = jwt.decode(token, { complete: true });
      if (!decodedJwt) {
        console.log("Not a valid JWT token");
        callback(new Error('Not a valid JWT token'));
      }
      var kid = decodedJwt.header.kid;
      var pem = pems[kid];
      if (!pem) {
        console.log('Invalid token');
        callback(new Error('Invalid token'));
      }
      jwt.verify(token, pem, function (err, payload) {
        if (err) {
          console.log("Invalid Token.");
          callback(new Error('Invalid token'));
        } else {
          console.log("Valid Token.");
          callback(null, "Valid token");
        }
      });
    } else {
      console.log("Error! Unable to download JWKs");
      callback(error);
    }
  });
}
