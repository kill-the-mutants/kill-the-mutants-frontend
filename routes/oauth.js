var express = require('express');
var github = require('../lib/github');
var users = require('../lib/users');
var tokens = require('../lib/api.json');
var querystring = require('querystring');
var router = express.Router();

router.get('/login', function(req, res) {
  var user = req.session.user;

  if (!user) {
    var hostname = req.headers.host;
    var uri = 'http://'+hostname+'/oauth/callback';

    var query = {
      client_id : tokens.GITHUB_CLIENT_ID,
      redirect_uri : uri,
      scope : 'user,public_repo'
    };
    res.redirect('https://github.com/login/oauth/authorize?' + querystring.stringify(query));
  } else {
    console.log('Already logged in');
    res.redirect('/');
  }
});

router.get('/callback', function(req, res) {
  var user = req.session.user;

  if (user) {
    res.redirect('/');
    return; // doing this to avoid lots of else statements and confusing braces
  }

  var error = req.query.error;
  if(error) {
    res.render('500', { error : error });
    return;
  }

  if (!req.query.code) {
    res.render('500', { error : "Code not provided for accessing GitHub OAuth." });
    return;
  }

  var hostname = req.headers.host;
  var uri = 'http://'+hostname+'/oauth/callback';
  var code = req.query.code;

  var authenticationInformation = {
    code: code,
    redirect_uri: uri
  };

  github.requestToken(authenticationInformation, function(data) {
    var access_token = data.access_token;
    users.login(access_token, function(user) {
      res.cookie('access_token', data.access_token);
      req.session.user = user;
      if (!user.completed_signup) {
        res.redirect('/users/complete-signup');
      } else if (!user.completed_presurvey) {
        res.redirect('/users/pre-survey');
      } else {
        res.redirect('/');
      }
    });
  });
});

module.exports = router;
