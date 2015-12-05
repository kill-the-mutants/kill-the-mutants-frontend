var express = require('express');
var users = require('../lib/users');
var router = express.Router();

router.get('/complete-signup', function(req, res) {
  var user = req.session.user;
  if (!user || user.completed_signup) {
    res.redirect('/');
  } else {
    res.locals.view_signup = true;
    res.render('signup', { title: "Complete Your KTM Signup" });
  }
});

router.post('/complete-signup', function(req, res) {
  var user = req.session.user;
  if (!user || user.completed_signup) {
    res.redirect('/');
  } else {
    var options = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      gender: req.body.gender,
      age: req.body.age,
      exp_level: req.body['exp-level'],
      completed_signup: true
    };
    users.updateUser(user.login, options, function(user, err) {
      if(err) {
        res.render('500', {error: JSON.stringify(err)});
      } else {
        req.session.user = user;
        if (!user.completed_presurvey) {
          res.redirect('/users/pre-survey');
        } else {
          res.redirect('/game');
        }
      }
    });
  }
});

router.get('/pre-survey', function(req, res) {
  var user = req.session.user;
  if (!user) {
    res.redirect('/');
  } else if (!user.completed_signup) {
    res.redirect('/users/complete-signup');
  } else {
    res.locals.view_survey = true;
    res.render('pre-survey', {
      title: "KTM - Entry Survey",
    });
  }
});

router.post('/pre-survey', function(req, res) {
  var user = req.session.user;
  if (!user) {
    res.redirect('/');
  } else if (!user.completed_signup) {
    res.redirect('/complete-signup');
  } else {
    var options = {
      completed_presurvey: true
    };
    users.updateUser(user.login, options, function(user, err) {
      if(err) {
        res.render('500', {error: JSON.stringify(err)});
      } else {
        req.session.user = user;
        res.redirect('/game');
      }
    });
  }
});

router.get('/post-survey', function(req, res) {
  var user = req.session.user;
  if (!user) {
    res.redirect('/');
  } else if (user && !user.completed_signup) {
    res.redirect('/users/complete-signup');
  } else {
    res.locals.view_survey = true;
    res.render('post-survey', {
      title: "KTM - Post Usage Survey",
    });
  }
});

router.post('/post-survey', function(req, res) {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
