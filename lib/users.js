var api = require('./api.json');
var env = require('./env.js');
var github = require('./github');
var models = require("../models");

exports.login = function(access_token, callback) {
  // first get email
  github.getPrimaryEmail(access_token, function(email) {
    console.log(email);

    // check if the user is in the database
    models.Users.findOne({
      where: {
        email: email
      }
    }).then(function(user) {
      // if user is not in the database, setup account
      if(!user) {
        setupAccount(access_token, callback);
      } else {
        callback(); //TODO return email?
      }
    });
  });
};

function setupAccount(access_token, callback) {
  // add to database
  // fork https://github.com/kill-the-mutants/kill-the-mutants
  callback();
}
