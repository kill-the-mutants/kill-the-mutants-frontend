var express = require('express');
var game = require('../lib/game');
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

// NOTE: The next three route handlers are copy pastes of each other at the moment. They
// each receive a request from the front-end via AJAX containing the current code existing
// in the user's test editor and send it back to the front end as a dummy response.
router.post('/compile', function(req, res) {
  var user = req.session.user;

  if (!user || !user.completed_signup || !user.completed_presurvey) {
    res.redirect('/'); // just let the root route handle redirection because I'm tired of replicated code
    return;
  }

  var code = req.body.code;
  res.contentType('json');
  res.send({ code: code }); // sending back the code as a dummy response ¯\_(ツ)_/¯
});

router.post('/run-tests', function(req, res) {
  var user = req.session.user;

  if (!user || !user.completed_signup || !user.completed_presurvey) {
    res.redirect('/'); // just let the root route handle redirection because I'm tired of replicated code
    return;
  }

  var code = req.body.code;
  res.contentType('json');
  res.send({ code: code }); // sending back the code as a dummy response ¯\_(ツ)_/¯
});

router.post('/mutation-test', function(req, res) {
  var user = req.session.user;

  if (!user || !user.completed_signup || !user.completed_presurvey) {
    res.redirect('/'); // just let the root route handle redirection because I'm tired of replicated code
    return;
  }

  var code = req.body.code;
  res.contentType('json');
  res.send({ code: code }); // sending back the code as a dummy response ¯\_(ツ)_/¯
});

module.exports = router;
