var https = require('https');
var api = require('./api.json');
var env = require('./env.js');
var querystring = require('querystring');

// given an options JSON, make a request
exports.requestToken = function(authenticationInformation, callback) {
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

exports.getPrimaryEmail = function(access_token, callback) {
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

exports.getUser = function(access_token, callback) {
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

exports.fork = function(access_token, repo, callback) {
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

// If successful, calls callback() with a 'files' object containing paths
// to Tests.java and Snippet.java in the repository. NOTE: these paths
// are NOT the same as the URLs to the raw source code.
exports.getExampleContents = function(access_token, repo, callback) {
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
    path : '/repos/' + repo.owner + '/' + repo.repo + '/git/trees/master?recursive=1',
    headers : headers
  };
  makeRequest(options, function(response) {
    // if the repo couldn't be found
    if (response.message === 'Not Found') {
      callback("We couldn't find your repository to load the example!");
      return;
    } else {
      // store only the example directory's contents in 'exampleContents'
      var exampleContents = response.tree.filter(function(item) {
        if ('path' in item && item.path.substring(0, repo.path.length) === repo.path) {
          return true;
        } else {
          return false;
        }
      });
      // invalid example requested for
      if (exampleContents.length === 0) {
        callback("This example doesn't exist in your repository!");
        return;
      }
      // store only the test folders from exampleContents in 'testFolders' so we can run 'getLatestTestsPath'
      // in order to correctly parse the folder paths and find the latest Tests.java file
      var testFolders = exampleContents.filter(function(item) {
        if ('path' in item && 'type' in item && item.path.split('/').length == 2 && item.type === 'tree') {
          return true;
        } else {
          return false;
        }
      });
      var files = {
        testsFile: findElement(exampleContents, 'path', getLatestTestsPath(testFolders)),
        snippetFile: findElement(exampleContents, 'path', repo.path + '/Snippet.java')
      };
      callback(null, files);
    }
  });
};

// Given an array of JSON objects, looks for an object with
// property === propName and propName: propValue. Returns the first object it finds.
function findElement(arr, propName, propValue) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][propName] == propValue) {
      return arr[i];
    }
  }
}

// Returns path to the latest Tests.java file
function getLatestTestsPath(arr) {
  var latest = -1;
  var path = arr[0].path;
  for (var i = 0; i < arr.length; i++) {
    var currTimestamp = parseInt(arr[i].path.split('/')[1], 10); // convert string to base 10 integer
    if (currTimestamp > latest) {
      latest = currTimestamp;
      path = arr[i].path;
    }
  }
  if (latest < 0) {
    return undefined;
  } else {
    return path + '/Tests.java';
  }
}

// Get's a blob about a specific file in the GitHub repo,
// This blob will contain a 'download_url' value that links to the raw source
// code of the file located at repo.path in the repository.
exports.getFileContents = function(access_token, repo, callback) {
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
    path : '/repos/' + repo.owner + '/' + repo.repo + '/contents/' + repo.path,
    headers : headers
  };
  makeRequest(options, function(response) {
    if(callback) {
      if (response.message === 'Not Found') {
        callback("We could not find \"" + repo.path + "\" in your repository.");
      } else {
        callback(null, response);
      }
    }
  });
};

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
