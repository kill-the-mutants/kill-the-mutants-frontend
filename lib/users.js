var api = require('./api.json');
var env = require('./env.js');
var github = require('./github');
var models = require("../models");

exports.login = function(access_token, callback) {
  //first get email
  github.getUser(access_token, function(github_user) {
    // check if the user is in the database
    models.Users.findOne({
      where: {
        login: github_user.login
      }
    }).then(function(user) {
      // if user is not in the database, setup account
      if(user === null) {
        setupAccount(github_user, access_token, callback); //TODO allow async?
      } else {
        callback(); //TODO return email?
      }
    });
  });
};

function setupAccount(user, access_token, callback) {
  user.access_token = access_token;

  // first add to database
  models.Users.create(user).then(function(data) {
    var created_user = data.get({plain: true});
    console.log('Successfully created account:', created_user);

    // then fork https://github.com/kill-the-mutants/kill-the-mutants
    var repo = {
      owner: 'kill-the-mutants',
      repo: 'kill-the-mutants'
    };

    github.fork(access_token, repo, function(data) {
      callback(created_user);
    });
  }, function(err) {
    console.log('Error creating account:', err);
    callback(undefined, err);
  });
}
