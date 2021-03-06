var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var user = req.session.user;
  if (user && !user.completed_signup) {
    res.redirect('/users/complete-signup');
  } else if (user && !user.completed_presurvey){
    res.redirect('/users/pre-survey');
  } else {
    res.redirect('/home');
  }
});

router.get('/about', function(req, res) {
  res.locals.view_about = true;
  res.render('about', { title: "About Kill the Mutants" });
});

router.get('/login', function(req, res) {
  res.redirect('/oauth/login');
});

router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

router.get('/home', function(req, res) {
  res.locals.view_home = true;
  res.render('home', { title: "Kill the Mutants" });
});

module.exports = router;
