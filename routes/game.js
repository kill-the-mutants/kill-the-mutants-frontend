var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  var user = req.session.user;

  if (user && user.completed_signup) {
    res.locals.view_game = true;
    res.render('game', { title: "Kill the Mutants" });
  } else if (user && !user.completed_signup) {
    res.redirect('/users/complete-signup');
  } else {
    res.redirect('/');
  }
});

module.exports = router;
