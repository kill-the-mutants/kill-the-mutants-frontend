var github = require('../lib/github');
var request = require('request');

function getGameCode(user, testname, callback) {
  var repo = {
    owner: user.login,
    repo: 'kill-the-mutants'
  };

  getGameCodePaths(user.access_token, repo, testname, function(paths, err) {
    if(err) {
      callback(undefined, err);
    } else {
      getGameCodeBodies(repo, paths, function(bodies, err) {
        if(err) {
          callback(undefined, err);
        } else {
          callback(bodies);
        }
      });
    }
  });
}

function getGameCodeBodies(repo, paths, callback) {
  var host = 'https://raw.githubusercontent.com/';
  var base = host + repo.owner + '/' + repo.repo;
  var testsDownloadUrl = base + '/master/' + paths.testsPath;
  var snippetDownloadUrl = base + '/master/' + paths.snippetPath;

  request.get(testsDownloadUrl, function(testsErr, testsResponse, testsBody) {
    request.get(snippetDownloadUrl, function(snippetErr, snippetResponse, snippetBody) {
      if (!testsErr && !snippetErr && testsResponse.statusCode == 200 && snippetResponse.statusCode == 200) {
        var bodies = {
          testsBody: testsBody,
          snippetBody: snippetBody
        }
        callback(bodies);
      } else {
        callback(undefined, "Could not download test file or snippet file. " + JSON.stringify(testsErr) + JSON.stringify(snippetErr));
      }
    });
  });
}

function getGameCodePaths(access_token, repo, testname, callback) {
  github.getPathContents(access_token, repo, testname, function(pathContents, err){
    if(err) {
      callback(undefined, err);
    } else {
      getLatestTestsPath(pathContents, function(testsPath) {
        if(testsPath === undefined) {
          callback(undefined, 'No Tests.java found.')
        } else {
          var paths = {
            testsPath: testsPath,
            snippetPath: testname + '/Snippet.java'
          }
          callback(paths);
        }
      });
    }
  });
}

// Returns path to the latest Tests.java file from a given pathContents
// pathContents is an array from github describing a path in a given repo
function getLatestTestsPath(pathContents, callback) {
  var pathIndex = -1;
  var latestTimestamp = 0;
  for(var i = 0; i < pathContents.length; i++) {
    var currentTimestamp = parseInt(pathContents[i].name, 10); // convert string to base 10 integer
    if(currentTimestamp !== NaN) {
      if(currentTimestamp >= latestTimestamp){
        latestTimestamp = currentTimestamp;
        pathIndex = i;
      }
    }
  }
  if(pathIndex < 0) {
    callback(undefined);
  } else {
    callback(pathContents[pathIndex].path + '/Tests.java');
  }
}

module.exports = {
  getGameCode: getGameCode
};
