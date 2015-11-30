var https = require('https');
var api = require('./api.json');
var env = require('./env.js');

// given an options JSON, make a request
exports.requestToken = function(authenticationInformation, callback) {
  var body = 'client_id' + api.GITHUB_CLIENT_ID +
    '&client_secret' + api.GITHUB_CLIENT_SECRET +
    '&code=' + authenticationInformation.code +
    '&redirect_uri=' + authenticationInformation.redirect_uri;
  var headers = {
    'Accept' : 'application/json'
  }
  var options = {
    host : 'github.com',
    method: 'POST',
    path : '/login/oauth/access_token',
    headers : headers
  };
  makeRequest(options, function(data) {
    if(callback) {
      callback(data);
    }
  }, body);
};


// given an options JSON, make a request
function makeRequest(options, callback, reqBody) {
  console.log("MAKING REQUEST");
  var req = https.request(options, function(res) {
    var resBody = '';

    // add each data chunk
    res.on('data', function(data) {
      data = data.toString("utf-8"); // read the Buffer
      resBody += data;
    });


    res.on('end', function() {
      console.log(resBody);
      if(resBody) {
        resBody = JSON.parse(resBody);
      }
      callback(resBody);
    });
  });

  // send request body if it exists
  if(reqBody !== undefined) {
    req.write(reqBody);
  }

  req.end();
  req.on('error', function(e) {
    console.error(e);
  });
}
