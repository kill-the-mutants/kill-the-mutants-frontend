var bodyParser = require('body-parser');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var express = require('express');
var handlebars = require('express-handlebars');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');

var index = require('./routes/index');
var users = require('./routes/users');
var oauth = require('./routes/oauth');
var game = require('./routes/game');

var app = express();

// view engine setup
var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

// Body Parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static File Serving
app.use(express.static(__dirname + '/public'));

// Middleware to set a variable accessible from front end representing
// whether the current session user is logged in or not.
function adjustViewForLogin(req, res, next) {
    res.locals.loggedIn = false;
    if (req.session.user) {
      res.locals.loggedIn = true;
      res.locals.username = req.session.user.login;
    }
    next();
}

// Session Support:
app.use(session({
  secret: 'notmuchofasecret',
  saveUninitialized: false, // doesn't save uninitialized session
  resave: false // doesn't save session if not modified
}));

// Custom Middleware
app.use(adjustViewForLogin);

// Flash Support.
app.use(flash());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/', index);
app.use('/users', users);
app.use('/oauth', oauth);
app.use('/game', game);

function notFound404(req, res) {
    res.status(404);
    res.render('404');
}

function internalServerError500(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500', { error: err });
}

app.use(notFound404);
app.use(internalServerError500);

module.exports = app;
