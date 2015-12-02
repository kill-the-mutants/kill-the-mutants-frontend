var express = require('express');
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
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
