var express = require('express');
var github = require('../lib/github');
var users = require('../lib/users');
var tokens = require('../lib/api.json');
var querystring = require('querystring');
var router = express.Router();

router.get('/login', function(req, res) {
  var hostname = req.headers.host; // hostname = 'localhost:8080'
  var uri = 'http://'+hostname+'/oauth/callback'; // pathname = '/MyApp'

  var query = {
    client_id : tokens.GITHUB_CLIENT_ID,
    redirect_uri : uri,
    scope : 'user:email,public_repo'
  };

  res.redirect('https://github.com/login/oauth/authorize?' + querystring.stringify(query));
});

router.get('/callback', function(req, res) {
  var error = req.query.error;
  if(error) {
    res.render('500', { title : error });
  }

  var hostname = req.headers.host; // hostname = 'localhost:8080'
  var uri = 'http://'+hostname+'/oauth/callback'; // pathname = '/MyApp'
  var code = req.query.code;

  var authenticationInformation = {
    code: code,
    redirect_uri: uri
  };

  github.requestToken(authenticationInformation, function(data) {
    var access_token = data.access_token;
    users.login(access_token, function() {
      res.cookie('access_token', data.access_token);
      res.redirect('/');
    });
  });
});

module.exports = router;
