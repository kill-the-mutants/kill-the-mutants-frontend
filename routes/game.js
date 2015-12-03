var fs = require('fs');
var express = require('express');
var github = require('../lib/github');
var request = require('request');
var router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/game/example1');
});

router.get('/example:num', function(req, res) {
  var user = req.session.user;

  if (user && user.completed_signup) {
    var exampleNumber = req.params.num;

    var repo = {
      owner: user.login,
      repo: 'kill-the-mutants',
      path: 'example' + exampleNumber
    };

    // THIS IS TERRIBLY WRITTEN CODE
    // But I can not, for the life of me, think of how else to request the bodies
    // of two separate remote files since everything's asynchronous.

    // Get the URLs to Tests.java and Snippet.java raw source code files in GitHub.
    // files: a json object containing the URLs to the source code for Tests.java and Snippet.java
    github.getExampleContents(user.access_token, repo, function(error, files) {
      if (error) {
        res.status(404);
        res.render('404', { error: error });
        return;
      }
      // replace repo's path value with that of the testsFile we want to obtain the URL of
      repo.path = files.testsFile.path;
      github.getFileContents(user.access_token, repo, function(testsErr, testsResponse) {
        // replace repo's path value with taht of the snippetFile we want to obtain the URL of
        repo.path = files.snippetFile.path;

        github.getFileContents(user.access_token, repo, function(snippetErr, snippetResponse) {
          if (testsErr || snippetErr) {
            res.status(404);
            res.render('404', { error: testsErr || snippetErr });
            return;
          }
          request.get(testsResponse.download_url, function(testsErr, testsResponse, testsBody) {
            request.get(snippetResponse.download_url, function(snippetErr, snippetResponse, snippetBody) {
              if (!testsErr && !snippetErr && testsResponse.statusCode == 200 && snippetResponse.statusCode == 200) {
                res.locals.view_game = true;
                res.render('game', {
                  title: 'Kill the Mutants',
                  tests: testsBody,
                  snippet: snippetBody
                });
              } else {
                res.status(500);
                res.render('500', { error: "Oh no! An error occurred obtaining the example you've requested." });
              }
            });
          });
        });
      });
    }); // END TERRIBLY WRITTEN CODE
  } else if (user && !user.completed_signup) {
    res.redirect('/users/complete-signup');
  } else {
    res.redirect('/');
  }
});

module.exports = router;
