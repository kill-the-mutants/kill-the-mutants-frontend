var models = require("../models");

// requires a user aquired from req.session
function store_results(user, testname, code, docker_arguments, stdout, stderr, callback){
  parse_results(user, testname, code, docker_arguments, stdout, stderr, function(results){

    // first look for the user in the database
    models.Users.findOne({
      where: {
        login: user.login
      }
    }).then(function(db_user) {
      if(db_user === null) {                        // user does not exist
        callback(undefined, 'User does not exist!');
      } else {

        // then create and add the results
        create_results(db_user, results, callback);

      }
    }, function(err) {                              // user search failed
      callback(undefined, err);
    });

  });
}

function parse_results(user, testname, code, docker_arguments, stdout, stderr, callback) {
  console.log("PARSING RESULTS");
  var compileRegExp = new RegExp(/(?=.*|\s).*\/Tests.java:.*\n(?:[ ]*.*\n)*(\d errors?)/g);
  var compileErrs = stderr.match(compileRegExp);



  if (compileErrs !== null)
    console.log(compileErrs[0]);
  else
    console.log("NO COMPILE ERRORS FOUND");

  var results = {
    testname: testname,
    timestamp: docker_arguments.timestamp,
    total_mutants: 0,
    killed_mutants: 0,
    tests_work: 1
  };
  callback(results);
}

// requires a user aquired from sequelize
function create_results(user, results, callback) {
  console.log('creating new results!', results);
  models.Results.create(results).then(function(db_results) {
    console.log('added new results!', db_results);
    console.log('adding results to user!');
    user.addResults(db_results).then(function(output) {
      console.log('added results to user!', output);
      callback(output);
    }, function(err) {                            // add results to user failed
      callback(undefined, err);
    });
  }, function(err) {                              // results creation failed
    callback(undefined, err);
  });
}

module.exports = {
  store_results: store_results
};
