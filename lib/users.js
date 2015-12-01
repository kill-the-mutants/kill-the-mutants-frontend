var api = require('./api.json');
var env = require('./env.js');
var github = require('./github');
var models = require("../models");

exports.login = function(access_token, callback) {
  //first get email
  github.getPrimaryEmail(access_token, function(email) {
    // check if the user is in the database
    models.Users.findOne({
      where: {
        email: email
      }
    }).then(function(user) {
      console.log(user);
      // if user is not in the database, setup account
      if(user === null) {
        setupAccount(email, access_token, callback); //TODO allow async?
      } else {
        callback(); //TODO return email?
      }
    });
  });
};

function setupAccount(email, access_token, callback) {
  // first add to database
  var user = {
    email: email,
    access_token: access_token
  }

  models.Users.create(user).then(function(data) {
    var created_user = data.get({plain: true});
    console.log('Successfully created account:', created_user);
    callback(created_user);
  }, function(err) {
    console.log('Error creating account:', err)
    callback(undefined, err);
  });

  // fork https://github.com/kill-the-mutants/kill-the-mutants
}