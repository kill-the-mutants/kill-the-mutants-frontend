var api = require('./api.json');
var env = require('./env.js');
var github = require('./github');
var models = require("../models");

// Testing purposes only TODO remove
// function deleteAllUsers() {
//   models.Users.destroy({where:{login:"NateFuller"}});
// }

exports.login = function(access_token, callback) {
  // deleteAllUsers(); // testing purposes only TODO remove

  // first get email
  github.getUser(access_token, function(github_user) {
    // check if the user is in the database
    console.log('Searching for user:', github_user);
    models.Users.findOne({
      where: {
        login: github_user.login
      }
    }).then(function(user) {
      // if user is not in the database, setup account
      if(user === null) {
        console.log('User does not exist:', github_user);
        setupAccount(github_user, access_token, callback);
      } else {
        console.log('Found user:', user);
        console.log('Updating user with access_token:', access_token);
        user.updateAttributes({
          access_token: access_token    // update access_token incase of revoked access
        }).then(function(db_user) {
          var updated_user = db_user.get({plain: true});
          console.log('Updated user:', updated_user);
          callback(updated_user);
        }, function(err) {
          console.log('Error updating user:', err);
          callback(undefined, err);     // user update error
        });
      }
    }, function(err) {
      console.log('Error searching for user:', err);
      callback(undefined, err);         // user search error
    });
  });
};

function setupAccount(github_user, access_token, callback) {
  github_user.access_token = access_token;
  github_user.completed_signup = false;
  github_user.completed_presurvey = false;
  github_user.completed_postsurvey = false;
  github_user.completed_all_tests = false;

  // first add to database
  console.log('Creating user:', github_user);
  models.Users.create(github_user).then(function(db_user) {
    var created_user = db_user.get({plain: true});
    console.log('Successfully created user:', created_user);

    // then fork https://github.com/kill-the-mutants/kill-the-mutants
    var repo = {
      owner: 'kill-the-mutants',
      repo: 'kill-the-mutants'
    };

    github.fork(created_user.access_token, repo, function(data) {
      callback(created_user);
    });
  }, function(err) {
    console.log('Error creating user:', err);
    callback(undefined, err);           // user create error
  });
}

exports.updateUser = function(username, options, callback) {
  console.log('Searching for user:', username);
  models.Users.findOne({
    where: {
      login: username
    }
  }).then(function(user) {
    if (user === null) {
      console.log('User does not exist:', username);
      callback({message: 'User ' + username + 'does not exist.'}); // user DNE error
    } else {
      console.log('Found user:', user);
      console.log('Updating user with options:', options);
      user.updateAttributes(options).then(function(db_user) {
        var updated_user = db_user.get({plain: true});
        console.log('Updated user:', updated_user);
        callback(updated_user);
      }, function(err) {
        console.log('Error updating user:', err);
        callback(undefined, err);       // user update error
      });
    }
  }, function(err) {
    console.log('Error searching for user:', err);
    callback(undefined, err);           // user search error
  });
};
