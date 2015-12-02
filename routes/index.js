var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var user = req.session.user;
  if (user && !user.completed_signup) {
    res.redirect('/users/complete-signup');
  } else {
    res.locals.view_home = true;
    res.render('home', { title: "Kill the Mutants" });
  }
});

router.get('/about', function(req, res) {
  res.locals.view_about = true;
  res.render('about', { title: "About Kill the Mutants" });
});
//
// router.get('/test', function(req, res) {
//   res.locals.view_signup = true;
//   res.render('signup', { title: "Complete Your KTM Signup" });
// });

router.get('/login', function(req, res) {
  res.redirect('/oauth/login');
});

module.exports = router;
