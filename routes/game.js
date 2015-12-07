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

  docker.execute(user, testname, false, 'junit', code, function(docker_arguments, stdout, stderr) {

    fs.writeFile(__dirname + '/../lib/tmp/test/err.txt', stderr, function(error) {
      if (error) {
        console.log("Could not save stderr.");
        console.log(error);
      } else {
        console.log("Saved stderr!");
      }
    });

    fs.writeFile(__dirname + '/../lib/tmp/test/out.txt', stdout, function(error) {
      if (error) {
        console.log("Could not save stdout.");
        console.log(error);
      } else {
        console.log("Saved stdout!");
      }
    });

    var compileRegExp = new RegExp(/(?=.*|\s).*\/Tests.java:.*\n(?:[ ]*.*\n)*(\d errors?)/g);
    var compileErrs = stderr.match(compileRegExp);

    var testOutRegExp = new RegExp(/Time.*\n(:?[ ]*.*\n)*(Tests.*)*/g);
    var testOut = stdout.match(testOutRegExp); // for some reason, all test output goes to stderr

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

    res.send({
      code: code,
      stdout: stdout,
      stderr: stderr
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

  docker.execute(user, testname, false, 'pit', code, function(docker_arguments, stdout, stderr) {
    console.log('docker_arguments', docker_arguments);

    // mutation testing was run; add to the database
    results.store_results(user, testname, code, docker_arguments, stdout, stderr, function(db_output, err){

      // fs.writeFile(__dirname + '/../lib/tmp/test/err.txt', stderr, function(error) {
      //   if (error) {
      //     console.log("Could not save stderr.");
      //     console.log(error);
      //   } else {
      //     console.log("Saved stderr!");
      //   }
      // });
      //
      //
      // fs.writeFile(__dirname + '/../lib/tmp/test/out.txt', stdout, function(error) {
      //   if (error) {
      //     console.log("Could not save stdout.");
      //     console.log(error);
      //   } else {
      //     console.log("Saved stdout!");
      //   }
      // });

      var compileRegExp = new RegExp(/(?=.*|\s).*\/Tests.java:.*\n(?:[ ]*.*\n)*(\d errors?)/g);
      var compileErrs = stderr.match(compileRegExp);

      if (compileErrs !== null) {
        stderr = compileErrs[0];
      } else if (stderr.includes("All tests did not pass without mutation when calculating line coverage. Mutation testing requires a green suite.")) {
        stderr = "Your test suite is not currently passing!\nPlease click \"Run Tests\" in order to see information on the failing test(s).";
      } else {
        stderr = null;
      }

      res.send({
        code: code,
        stdout: stdout,
        stderr: stderr,
        db_output: db_output,
        err: err
      });
    });
  });
});

module.exports = router;
