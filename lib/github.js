var https = require('https');
var api = require('./api.json');
var env = require('./env.js');
var querystring = require('querystring');

// given an options JSON, make a request
var requestToken = function(authenticationInformation, callback) {
  var body = 'client_id=' + api.GITHUB_CLIENT_ID +
  '&client_secret=' + api.GITHUB_CLIENT_SECRET +
  '&code=' + authenticationInformation.code +
  '&redirect_uri=' + authenticationInformation.redirect_uri;
  var headers = {
    'Accept' : 'application/json'
  };
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

var getPrimaryEmail = function(access_token, callback) {
  var query = {
    access_token : access_token
  };
  var headers = {
    'Accept' : 'application/json',
    'User-Agent': 'kill-the-mutants'
  };
  var options = {
    host : 'api.github.com',
    method: 'GET',
    path : '/user/emails?' + querystring.stringify(query),
    headers : headers
  };
  makeRequest(options, function(emails) {
    if(callback) {
      // check to make sure we didn't get an error
      if(emails.message){
        callback(emails.message);
      }
      else {
        var primaryEmail = emails.filter(function(obj) {
          return obj.primary === true;
        })[0].email;
        callback(primaryEmail);
      }
    }
  });
};

var getUser = function(access_token, callback) {
  var query = {
    access_token : access_token
  };
  var headers = {
    'Accept' : 'application/json',
    'User-Agent': 'kill-the-mutants'
  };
  var options = {
    host : 'api.github.com',
    method: 'GET',
    path : '/user?' + querystring.stringify(query),
    headers : headers
  };
  makeRequest(options, function(user) {
    if(callback) {
      // check to make sure we didn't get an error
      if(user.message){
        callback(user.message);
      }
      else {
        var min_user = {
          login: user.login,
          email: user.email
        };
        callback(min_user);
      }
    }
  });
};

var fork = function(access_token, repo, callback) {
  var query = {
    access_token : access_token
  };
  var headers = {
    'Accept' : 'application/json',
    'User-Agent': 'kill-the-mutants'
  };
  var options = {
    host : 'api.github.com',
    method: 'POST',
    path : '/repos/' + repo.owner + '/' + repo.repo + '/forks?' + querystring.stringify(query),
    headers : headers
  };
  makeRequest(options, function(response) {
    if(callback) {
      callback(response);
    }
  });
};

// Get's a blob about a specific path in the GitHub repo,
// NOTE: Files in the blob will contain a 'download_url'
// value that links to it's raw source code
var getPathContents = function(access_token, repo, path, callback) {
  var query = {
    access_token : access_token,
    client_id : api.GITHUB_CLIENT_ID,
    client_secret : api.GITHUB_CLIENT_SECRET
  };
  var headers = {
    'Accept' : 'application/json',
    'User-Agent': 'kill-the-mutants'
  };
  var options = {
    host : 'api.github.com',
    method: 'GET',
    path : '/repos/' + repo.owner + '/' + repo.repo + '/contents/' + path + '?' + querystring.stringify(query),
    headers : headers
  };
  makeRequest(options, function(response) {
    if(callback) {
      if (response.message === 'Not Found') {
        callback(undefined, "Could not find '" + path + "' in repository '" + repo.owner + "/" + repo.repo + "'.");
      } else {
        callback(response);
      }
    }
  });
};

//TODO move to helper module or remove
// Given an array of JSON objects, looks for an object with
// property === propName and propName: propValue. Returns the first object it finds.
function findElement(arr, propName, propValue) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][propName] == propValue) {
      return arr[i];
    }
  }
}

//TODO move to helper module?
// given an options JSON, make a request
function makeRequest(options, callback, reqBody) {
  var req = https.request(options, function(res) {
    var resBody = '';

    // add each data chunk
    res.on('data', function(data) {
      data = data.toString("utf-8"); // read the Buffer
      resBody += data;
    });


    res.on('end', function() {
      // console.log(resBody);
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

module.exports = {
  requestToken: requestToken,
  getPrimaryEmail: getPrimaryEmail,
  getUser: getUser,
  fork: fork,
  getPathContents: getPathContents
};
