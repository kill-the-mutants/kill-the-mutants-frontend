var express = require('express');
var game = require('../lib/game');
var docker = require('../lib/docker');
var fs = require('fs');
var results = require('../lib/results');
var router = express.Router();
var url = require('url');

router.get('/', function(req, res) {
  // TODO fix this
  res.redirect('/game/example1');
});

router.get('/:testname', function(req, res) {
  var user = req.session.user;

  if (user && user.completed_signup) {
    var testname = req.params.testname;

    game.getGameCode(user, testname, function(result, err) {
      if(err) {
        res.render('500', { error: err });
      } else {
        res.locals.view_game = true;
        res.render('game', {
          title: 'Kill the Mutants',
          tests: result.testsBody,
          snippet: result.snippetBody
        });
      }
    });

  } else if (user && !user.completed_signup) {
    res.redirect('/users/complete-signup');
  } else {
    res.redirect('/');
  }
});

router.post('/run-tests', function(req, res) {
  var user = req.session.user;

  if (!user || !user.completed_signup || !user.completed_presurvey) {
    res.redirect('/');
    return;
  }

  var code = req.body.code;
  var refererPathElements = url.parse(req.headers.referer).pathname.split('/');
  var testname = refererPathElements[refererPathElements.length - 1]; // test name should be the last element in the path

  // build and run docker container
  docker.execute(user, testname, false, 'junit', code, function(docker_arguments, stdout, stderr) {
    parse_tests_output(stdout, stderr, function(output) {
      console.log(output);
      res.send({
        output: output
      });
    });
  });
});

router.post('/mutation-test', function(req, res) {
  var user = req.session.user;

  if (!user || !user.completed_signup || !user.completed_presurvey) {
    res.redirect('/');
    return;
  }

  var code = req.body.code;
  var refererPathElements = url.parse(req.headers.referer).pathname.split('/');
  var testname = refererPathElements[refererPathElements.length - 1]; // test name should be the last element in the path

  // build and run docker container
  docker.execute(user, testname, true, 'pit', code, function(docker_arguments, stdout, stderr) {
    parse_mutation_output(stdout, stderr, function(output, tests_work, total_mutants, killed_mutants, duration) {
      console.log(output);

      var resultsObj = {
        user: user,
        testname: testname,
        timestamp: docker_arguments.timestamp,
        total_mutants: total_mutants,
        killed_mutants: killed_mutants,
        tests_work: tests_work,
        duration: duration,
        code: code,
        stdout: stdout,
        stderr: stderr
      };

      // mutation testing was run; add to the database
      results.store_results(resultsObj, function(db_output, err){
        res.send({
          output: output,
          score: (killed_mutants / total_mutants) * 100
        });
      });
    });
  });
});

function parse_tests_output(stdout, stderr, callback) {
  var compileRegExp = new RegExp(/(?=.*|\s).*\/Tests.java:.*\n(?:[ ]*.*\n)*(\d errors?)/g);
  var compileErrs = stderr.match(compileRegExp);

  var testOutRegExp = new RegExp(/Time.*\n(:?[ ]*.*\n)*(Tests.*)*/g);
  var testOut = stdout.match(testOutRegExp); // for some reason, all test output goes to stderr

  // clean stdout and stderr
  if (compileErrs) {
    stderr = compileErrs[0];
    stdout = null;
  } else if (testOut) {
    stdout = testOut[0];
    stderr = null;
  } else {
    stderr = "Something broke trying to run your tests!";
    stdout = null;
  }

  // return stderr if present, otherwise stdout
  var output = (stderr !== null) ? stderr : stdout;
  callback(output);
}

function parse_mutation_output(stdout, stderr, callback) {
  var compileRegExp = new RegExp(/(?=.*|\s).*\/Tests.java:.*\n(?:[ ]*.*\n)*(\d errors?)/g);
  var compileErrs = stderr.match(compileRegExp);
  var tests_work, total_mutants, killed_mutants, duration;

  // clean stderr
  if (compileErrs !== null) {
    stderr = compileErrs[0];
    tests_work = false;
  } else if (stderr.includes("All tests did not pass without mutation when calculating line coverage. Mutation testing requires a green suite.")) {
    stderr = "Your test suite is not currently passing!\nPlease click \"Run Tests\" in order to see information on the failing test(s).";
    tests_work = false;
  } else {
    total_mutants = parse_total_mutants(stdout);
    killed_mutants = parse_killed_mutants(stdout);
    duration = parse_duration(stdout);
    tests_work = true;
    stderr = null;
  }

  // return stderr if present, otherwise stdout
  var output = (stderr !== null) ? stderr : stdout;
  callback(output, tests_work, total_mutants, killed_mutants, duration);
}

function parse_duration(stdout) {
  var regExp = new RegExp(/Total.*(\d+)/i);
  if(regExp && regExp[1])
    return parseInt(regExp[1]);
  return undefined;
}

function parse_total_mutants(stdout) {
  var regExp = new RegExp(/(?:Generated (\d+) mutations Killed (\d+))/i);
  if(regExp && regExp[1])
    return parseInt(mutantsRegExp[1]);
  return undefined;
}

function parse_killed_mutants(stdout) {
  var regExp = new RegExp(/(?:Generated (\d+) mutations Killed (\d+))/i);
  if(regExp && regExp[2])
    return parseInt(mutantsRegExp[2]);
  return undefined;
}

module.exports = router;
