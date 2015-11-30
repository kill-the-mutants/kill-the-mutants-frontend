var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.locals.view_home = true;
  res.render('home', { title: "Kill the Mutants" });
});

router.get('/about', (req, res) => {
  res.locals.view_about = true;
  res.render('about', { title: "About Kill the Mutants" });
});

router.get('/login', (req, res) => {
  res.redirect('/oauth/login');
});

module.exports = router;
