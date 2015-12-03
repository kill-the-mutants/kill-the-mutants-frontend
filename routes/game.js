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
      path: 'example' + exampleNumber + '/Snippet.java'
    };

    github.getFileContents(user.access_token, repo, function(contents) {
      if (contents.message === 'Not Found') {
        res.status(404);
        res.render('404', { error: "This example doesn't exist." });
        return;
      }
      request.get(contents.download_url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          res.locals.view_game = true;
          res.render('game', {
            title: 'Kill the Mutants',
            skeleton: body
          });
        } else {
          res.status(500);
          res.render('500', { error: "Oh no! An error occurred obtaining the example you've requested =(" });
        }
      });
    });
  } else if (user && !user.completed_signup) {
    res.redirect('/users/complete-signup');
  } else {
    res.redirect('/');
  }
});

module.exports = router;
