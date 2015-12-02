var express = require('express');
var github = require('../lib/github');
var users = require('../lib/users');
var tokens = require('../lib/api.json');
var querystring = require('querystring');
var router = express.Router();

router.get('/login', function(req, res) {
  var hostname = req.headers.host;
  var uri = 'http://'+hostname+'/oauth/callback';

  var query = {
    client_id : tokens.GITHUB_CLIENT_ID,
    redirect_uri : uri,
    scope : 'user,public_repo'
  };

  res.redirect('https://github.com/login/oauth/authorize?' + querystring.stringify(query));
});

router.get('/callback', function(req, res) {
  var error = req.query.error;
  if(error) {
    res.render('500', { error : error });
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
      req.session.user = user.dataValues;
      res.redirect('/');
    });
  });
});

module.exports = router;
