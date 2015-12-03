var api = require('./api.json');
var env = require('./env.js');
var github = require('./github');
var models = require("../models");

// Testing purposes only
function deleteAllUsers() {
  models.Users.destroy({where:{login:"NateFuller"}});
}

exports.login = function(access_token, callback) {
  deleteAllUsers(); // testing purposes only
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
        user.update({
          // update the user's access_token incase the user revoked access at some point
          // and OAuth had to create a new one
          access_token: access_token
        }).then(function() {
          callback(user); //TODO return email?
        });
      }
    });
  });
};

function setupAccount(user, access_token, callback) {
  user.access_token = access_token;

  user.completed_signup = false;

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

exports.updateUser = function(username, options, callback) {
  models.Users.findOne({
    where: {
      login: username
    }
  }).then(function(user) {
    if (user === null) {
      // this shouldn't happen, but maybe it could if the user's session expired before
      // they made the request to update the user?
      var error = "Unexpected database lookup error. Sorry m8.";
      console.log(error);
      callback(error);
    } else {
      user.update(options).then(function(user) {
        callback(undefined, user);
      });
    }
  });
};
