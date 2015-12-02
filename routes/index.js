var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.locals.view_home = true;
  res.render('home', { title: "Kill the Mutants" });
});

router.get('/about', function(req, res) {
  res.locals.view_about = true;
  res.render('about', { title: "About Kill the Mutants" });
});

router.get('/login', function(req, res) {
  res.locals.view_login_signup = true;
  res.render('login', { title: "KTM Login" });
});

module.exports = router;
