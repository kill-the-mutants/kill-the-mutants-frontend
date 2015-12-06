var express = require('express');
var game = require('../lib/game');
var docker = require('../lib/docker');
var results = require('../lib/results');
var router = express.Router();

router.get('/', function(req, res) {
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
  var testname = req.body.testname;

  docker.execute(user, 'example1', false, 'junit', code, function(stdout, stderr) {
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
  var testname = req.body.testname;

  docker.execute(user, 'example1', true, 'pit', code, function(docker_arguments, stdout, stderr) {
    console.log('docker_arguments', docker_arguments)

    // mutation testing was run; add to the database
    results.store_results(user, 'example1', code, docker_arguments, stdout, stderr, function(db_output, err){
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
