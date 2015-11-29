var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('home', { title: "Kill the Mutants" });
});

router.get('/about', (req, res) => {
  res.render('about', { title: "About Kill the Mutants" });
});

module.exports = router;
